<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceTypeCheck;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceTypeCheckQueries
{
    use UserDataTrait;

    /** @param  array{}  $args */
    public function getDeviceChecksByTeam(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

        return DeviceTypeCheck::where('team_id', $team_id)->get();
    }
}
