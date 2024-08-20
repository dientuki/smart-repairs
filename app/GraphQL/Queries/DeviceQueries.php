<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Device;
use App\Models\TemporaryDeviceUnit;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceQueries
{
    public function getDeviceByBrandWithTmpOrder(null $root, array $args, GraphQLContext $context): mixed
    {
        $deviceId = TemporaryDeviceUnit::where('order_id', $args['orderId'])->value('device_id');
        $deviceInfo = Device::select('brand_id', 'device_type_id')->where('id', $deviceId)->first();


        return Device::where('brand_id', $deviceInfo->brand_id)
            ->where('device_type_id', $deviceInfo->device_type_id)
            ->get();
    }
}
