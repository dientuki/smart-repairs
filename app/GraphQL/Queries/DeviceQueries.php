<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Device;
use App\Models\TemporaryDeviceUnit;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceQueries
{
    private function getDevices(Array $values) {
        return Device::where($values)->get();
    }

    public function getDeviceByBrandWithTmpOrder(null $root, array $args, GraphQLContext $context): mixed
    {
        $deviceId = TemporaryDeviceUnit::where('order_id', $args['orderId'])->value('device_id');
        $deviceInfo = Device::select('brand_id', 'device_type_id')->where('id', $deviceId)->first();

        return $this->getDevices([
            'brand_id' => $deviceInfo->brand_id,
            'device_type_id' => $deviceInfo->device_type_id
        ]);
    }

    public function getDeviceByTypeAndBrand(null $root, array $args, GraphQLContext $context): mixed
    {
        return $this->getDevices([
            'brand_id' => $args['brandId'],
            'device_type_id' => $args['typeId']
        ]);
    }
}
