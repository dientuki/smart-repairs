<?php

namespace App\GraphQL\Queries;

use App\Enum\DiscountEnum;
use App\Models\ServiceJob;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ServiceJobQueries
{
    use UserDataTrait;

    public function getDiscounts(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

        return ServiceJob::where([
        ['discount_type', '!=', DiscountEnum::None->value],
        ['team_id', '=', $team_id]
        ])->get();
    }

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     * @return \App\Models\ServiceJob
     */
    public function getServices(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

        return ServiceJob::where(
            ['discount_type' => DiscountEnum::None->value],
            ['team_id' => $team_id]
        )->get();
    }
}
