<?php

namespace App\GraphQL\Queries;

use App\Models\Budget;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class BudgetQueries
{
    public function getBudget(null $root, array $args, GraphQLContext $context): mixed
    {
        return Budget::where(['order_id' => $args['orderId']])->get();
    }
}
