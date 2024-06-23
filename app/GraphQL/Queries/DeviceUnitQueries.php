<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceUnit;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitQueries
{
    use TeamContextTrait;

    public function getDeviceUnits(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        return DeviceUnit::where('team_id', $team_id)->get();
    }
}
