<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceUnit;
use App\Models\DeviceVersion;
use App\Models\TemporaryDeviceUnit;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceVersionQueries
{
    public function getDeviceVersionsByDeviceUnit(null $root, array $args, GraphQLContext $context): mixed
    {

        $deviceUnit = DeviceUnit::findOrFail($args['deviceUnitId']);
        $device = $deviceUnit->deviceVersion->device;

        return $device->versions;
    }

    public function getTemporaryDeviceVersions(null $root, array $args, GraphQLContext $context): mixed
    {
        $deviceId = TemporaryDeviceUnit::where('order_id', $args['orderId'])->value('device_id');

        return DeviceVersion::where('device_id', $deviceId)->get();
    }
}
