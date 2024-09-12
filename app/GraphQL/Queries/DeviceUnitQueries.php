<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceUnit;
use App\Models\TemporaryDeviceUnit;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitQueries
{
    use UserDataTrait;

    private function getDeviceUnits(array $values)
    {
        return DeviceUnit::where($values)->get();
    }

    public function getDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();

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
        $team_id = $this->getTeamId();

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $args['versionId']
        ]);
    }

    public function getTemporaryDeviceUnits(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamId();
        $deviceVersion = TemporaryDeviceUnit::where('order_id', $args['orderId'])->value('device_version_id');

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $deviceVersion
        ]);
    }

    public function getDeviceUnitsByDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {
        $deviceVersion = DeviceUnit::where('id', $args['deviceUnitId'])->value('device_version_id');
        $team_id = $this->getTeamId();

        return $this->getDeviceUnits([
            'team_id' => $team_id,
            'device_version_id' => $deviceVersion
        ]);
    }
}
