<?php

namespace App\GraphQL\Queries;

use App\Models\Discount;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DiscountQueries
{
    use UserDataTrait;

    public function getDiscounts(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

        return Discount::where([
            ['is_active', '=', true],
            ['team_id', '=', $team_id]
        ])->get();
    }
}
