<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceTypeCheck;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceTypeCheckQueries
{
    use TeamContextTrait;

    /** @param  array{}  $args */
    public function getDeviceChecksByTeam(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        return DeviceTypeCheck::where('team_id', $team_id)->get();
    }
}
