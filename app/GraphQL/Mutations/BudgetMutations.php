<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\DiscountEnum;
use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\Order;
use App\Models\ServiceJob;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class BudgetMutations
{
    use TeamContextTrait;

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

        $budget = Budget::updateOrCreate(
            ['order_id' => $args['orderId']],
            ['user_id' => auth()->user()->id]
        );

        $subtotal = 0;
        $discount = 0;

        foreach ($args['budgetItems'] as $key => $budgetItem) {
            switch ($budgetItem['type']) {
                case 'part':
                    $item = BudgetItem::updateOrCreate(
                        [
                            'id' => $budgetItem['itemId'],
                            'budget_id' => $budget->id,
                            'part_id' => $budgetItem['serviceId'],
                            'quantity' => $budgetItem['quantity'],
                            'unit_price' => $budgetItem['unitPrice'],
                            'include_in_sum' => $budgetItem['includeInSum']
                        ]
                    );
                    if ($budgetItem['includeInSum']) {
                        $subtotal += $item->unit_price * $item->quantity;
                    }
                    break;
                case 'service':
                    $item = BudgetItem::updateOrCreate(
                        [
                            'id' => $budgetItem['itemId'],
                            'budget_id' => $budget->id,
                            'service_job_id' => $budgetItem['serviceId'],
                            'quantity' => $budgetItem['quantity'],
                            'unit_price' => $budgetItem['unitPrice'],
                            'include_in_sum' => $budgetItem['includeInSum']
                        ]
                    );
                    $subtotal += $item->unit_price;
                    break;
                case 'discount':
                    if ($budgetItem['includeInSum']) {
                        $discountRecord = ServiceJob::find($budgetItem['serviceId']);
                    }

                    $discountItem = BudgetItem::updateOrCreate(
                        [
                            'id' => $budgetItem['itemId'],
                            'budget_id' => $budget->id,
                            'service_job_id' => $budgetItem['serviceId'],
                            'quantity' => $budgetItem['quantity'],
                            'unit_price' => $budgetItem['unitPrice'],
                            'include_in_sum' => $budgetItem['includeInSum']
                        ]
                    );
            }
        }

        if (isset($discountRecord) && isset($discountItem)) {
            switch ($discountRecord->discount_type) {
                case DiscountEnum::Percentage->value:
                    $discount = round(($subtotal * $discountItem->unit_price) / 100, 2);
                    break;
                case DiscountEnum::Amount->value:
                    $discount = $discountItem->unit_price;
                    break;
            }

        }


        $budget->total = $subtotal - $discount;
        $budget->save();
    }

}