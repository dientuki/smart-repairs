<?php

namespace App\GraphQL\Queries;

use App\Enum\DiscountEnum;
use App\Models\ServiceJob;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ServiceJobQueries
{
    use TeamContextTrait;

    public function getDiscounts(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

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
        $team_id = $this->getTeamIdFromContext($context);

        return ServiceJob::where(
            ['discount_type' => DiscountEnum::None->value],
            ['team_id' => $team_id]
        )->get();
    }
}
