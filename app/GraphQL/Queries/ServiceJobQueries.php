<?php

namespace App\GraphQL\Queries;

use App\Models\Discount;
use App\Models\ServiceJob;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ServiceJobQueries
{
    use UserDataTrait;

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     * @return \App\Models\ServiceJob
     */
    public function getServices(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

        return ServiceJob::where(
            ['is_active' => true],
            ['team_id' => $team_id]
        )->get();
    }
}
