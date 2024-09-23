<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Exceptions\GraphQLBusinessException;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Discount;
use App\Models\Part;
use App\Models\ServiceJob;
use App\Traits\UserDataTrait;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class BudgetMutations
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
    public function updateBudget(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $subtotal = 0;
        $discountValue = 0;
        $discountPercentageTotal = [];

        try {
            DB::beginTransaction();

            $budget = Budget::updateOrCreate(
                ['order_id' => $args['orderId']],
                [
                    'user_id' => $this->getUserId(),
                    'team_id' => $this->getTeamId(),
                ]
            );

            $part = (new Part())->getMorphClass();
            $discount = (new Discount())->getMorphClass();
            $serviceJob = (new ServiceJob())->getMorphClass();

            foreach ($args['budgetItems'] as $key => $budgetItem) {
                if (in_array($budgetItem['itemableType'], [$discount, $serviceJob])) {
                    if ($budgetItem['quantity'] != 1) {
                        throw new GraphQLBusinessException('budget.error.quantity');
                    }
                }

                $item = BudgetItem::updateOrCreate(
                    [
                        'id' => $budgetItem['id'],
                        'budget_id' => $budget->id,
                        'itemable_id' => $budgetItem['itemableId'],
                        'itemable_type' => $budgetItem['itemableType'],
                        'quantity' => $budgetItem['quantity'],
                        'unit_price' => $budgetItem['unitPrice'],
                        'item_total' => $budgetItem['quantity'] * $budgetItem['unitPrice'],
                        'include_in_sum' => $budgetItem['includeInSum']
                    ]
                );


                switch ($budgetItem['itemableType']) {
                    case $part:
                    case $serviceJob:
                        $subtotal += ($item->unit_price * $item->quantity);
                        break;
                    case $discount:
                        if (Discount::where('id', $budgetItem['itemableId'])->where('type', DiscountEnum::Percentage)->exists()) {
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
                    $discountTmp = round( ( ($subtotal * $discountPercentage['discount']) / 100), 2);
                    $discountValue += $discountTmp;
                    BudgetItem::find($discountPercentage['id'])->update(['item_total' => $discountTmp]);
                }
            }


            $budget->subtotal = $subtotal;
            $budget->discount = $discountValue;
            $budget->total = $subtotal - $discountValue;
            $budget->save();

            DB::commit();

            return [
                '__typename' => 'UpdateBudgetPayload',
                'success' => true,
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
}
