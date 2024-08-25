<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceUnit;
use App\Models\TemporaryDeviceUnit;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitQueries
{
    use TeamContextTrait;

    private function getDeviceUnits(array $values)
    {
        return DeviceUnit::where($values)->get();
    }

    public function getDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        return DeviceUnit::where([
            'team_id' => $team_id,
            'id' => $args['deviceUnitId']
        ])->first();
    }

    public function getTemporaryDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {
        return TemporaryDeviceUnit::where('order_id', $args['orderId'])->first();
    }

    public function getDeviceUnitsByVersionId(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $args['versionId']
        ]);
    }

    public function getTemporaryDeviceUnits(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);
        $deviceVersion = TemporaryDeviceUnit::where('order_id', $args['orderId'])->value('device_version_id');

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $deviceVersion
        ]);
    }

    public function getDeviceUnitsByDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {
        $deviceVersion = DeviceUnit::where('id', $args['deviceUnitId'])->value('device_version_id');
        $team_id = $this->getTeamIdFromContext($context);

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $deviceVersion
        ]);
    }
}
