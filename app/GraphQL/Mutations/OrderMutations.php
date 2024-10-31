<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Enum\OrderStatusEnum;
use App\Exceptions\GraphQLBusinessException;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderCheck;
use App\Models\OrderPayment;
use App\Models\Part;
use App\Models\ServiceJob;
use App\Models\TemporaryDeviceUnit;
use App\Traits\UserDataTrait;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderMutations
{
    use UserDataTrait;

    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed The result of resolving the field, matching what was promised in the schema
     */
    public function updateStatus(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];

        $order = Order::find($args['id']);
        $team_id = $this->getTeamId();

        try {
            $status = false;

            if ($order && $order->team_id === $team_id) {
                $status = Order::updateStatus($args['id'], $args['status']);
            }



            return [
                '__typename' => 'UpdateOrderPayload',
                'success' => $status,
            ];
        } catch (GraphQLBusinessException $e) {
            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'i18nKey' => $e->getI18nKey(),
            ];
        }
    }

    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        try {
            DB::beginTransaction();

            $order = Order::create([
                'status' => OrderStatusEnum::ForBudgeting,
                'observation' => $args['order']['observation'],
                'customer_id' => $args['order']['customer'],
                'team_id' => $this->getTeamId(),
                'created_by' => $this->getUserId(),
                'device_id' => $args['tmpDeviceUnit']['device']
            ]);

            OrderCheck::create([
                'order_id' => $order->id,
                'damages' => json_encode($args['orderChecks']['damages']),
                'damages_description' => $args['orderChecks']['damagesdescription'],
                'features' => json_encode($args['orderChecks']['features']),
                'features_description' => $args['orderChecks']['featuresdescription'],
            ]);

            TemporaryDeviceUnit::create([
                'device_id' => $args['tmpDeviceUnit']['device'],
                'device_version_id' => $args['tmpDeviceUnit']['deviceversion'],
                'device_unit_id' => $args['tmpDeviceUnit']['deviceunit'],
                'serial' => $args['tmpDeviceUnit']['serial'],
                'unlock_type' => $args['tmpDeviceUnit']['unlocktype'],
                'unlock_code' => $args['tmpDeviceUnit']['unlockcode'],
                'order_id' => $order->id,
            ]);

            if ($args['money'] > 0) {
                OrderPayment::create([
                    'order_id' => $order->id,
                    'amount' => $args['money'],
                ]);
            }

            if (count($args['budgetItems']) > 0) {
                $budget = Budget::create(
                    [
                        'order_id' => $order->id,
                        'user_id' => $this->getUserId(),
                        'team_id' => $this->getTeamId(),
                    ]
                );

                $part = (new Part())->getMorphClass();
                $discount = (new Discount())->getMorphClass();
                $serviceJob = (new ServiceJob())->getMorphClass();

                $subtotal = 0;
                $discountValue = 0;
                $discountPercentageTotal = [];

                foreach ($args['budgetItems'] as $key => $budgetItem) {
                    if (in_array($budgetItem['itemableType'], [$discount, $serviceJob])) {
                        if ($budgetItem['quantity'] != 1) {
                            throw new GraphQLBusinessException('budget.error.quantity');
                        }
                    }

                    $item = BudgetItem::find($budgetItem['id']);
                    if ($item) {
                        $item->update([
                            'itemable_id' => $budgetItem['itemableId'],
                            'itemable_type' => $budgetItem['itemableType'],
                            'quantity' => $budgetItem['quantity'],
                            'unit_price' => $budgetItem['unitPrice'],
                            'item_total' => $budgetItem['quantity'] * $budgetItem['unitPrice'],
                            'include_in_sum' => $budgetItem['includeInSum']
                        ]);
                    } else {
                        $item = BudgetItem::create([
                            'budget_id' => $budget->id,
                            'itemable_id' => $budgetItem['itemableId'],
                            'itemable_type' => $budgetItem['itemableType'],
                            'quantity' => $budgetItem['quantity'],
                            'unit_price' => $budgetItem['unitPrice'],
                            'item_total' => $budgetItem['quantity'] * $budgetItem['unitPrice'],
                            'include_in_sum' => $budgetItem['includeInSum']
                        ]);
                    }

                    switch ($budgetItem['itemableType']) {
                        case $part:
                        case $serviceJob:
                            $subtotal += ($item->unit_price * $item->quantity);
                            break;
                        case $discount:
                            if (
                                Discount::where('id', $budgetItem['itemableId'])
                                    ->where('type', DiscountEnum::Percentage)
                                    ->exists()
                            ) {
                                $discountPercentageTotal[] = [
                                    'id' => $item->id,
                                    'discount' => $item->unit_price,
                                ];
                            } else {
                                $discountValue += $item->unit_price;
                            }
                            break;
                    }
                }

                if (count($discountPercentageTotal) > 0) {
                    foreach ($discountPercentageTotal as $discountPercentage) {
                        $discountTmp = round(( ($subtotal * $discountPercentage['discount']) / 100), 2);
                        $discountValue += $discountTmp;
                        BudgetItem::find($discountPercentage['id'])->update(['item_total' => $discountTmp]);
                    }
                }

                $budget->subtotal = $subtotal;
                $budget->discount = $discountValue;
                $budget->save();
            }


            DB::commit();

            return [
                '__typename' => 'AddOrderPayload',
                'success' => true,
                'order' => $order->id,
            ];
        } catch (GraphQLBusinessException $e) {
            DB::rollBack();

            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'i18nKey' => $e->getI18nKey(),
            ];
        };
    }

    public function updateDiagnosis(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $order = Order::find($args['id']);

        if ($order->team_id === $this->getTeamId()) {
            $order->diagnosis = $args['diagnosis'] === '' ? null : $args['diagnosis'];
            $order->save();
            return true;
        }

        return false;
    }

    public function updateObservation(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $order = Order::find($args['id']);

        if ($order->team_id === $this->getTeamId()) {
            $order->observation = $args['observation'];
            $order->save();
            return true;
        }

        return false;
    }
}
