<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Exceptions\GraphQLBusinessException;
use App\Models\Brand;
use App\Models\Device;
use App\Models\DeviceType;
use Illuminate\Support\Facades\DB;
use App\Models\DeviceUnit;
use App\Models\DeviceVersion;
use App\Models\Order;
use App\Models\TemporaryDeviceUnit;
use App\Traits\UserDataTrait;
use Exception;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitMutations
{
    use UserDataTrait;

    private function separarString($input)
    {
        $var1 = $input;
        $var2 = '';

        if (preg_match('/^(.*)\s?\((.*)\)$/', $input, $matches)) {
            $var1 = trim($matches[1]);
            $var2 = trim($matches[2]);
        }

        return [$var1, $var2];
    }

    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed The result of resolving the field, matching what was promised in the schema
     */
    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        $team_id = $this->getTeamId();

        return DeviceUnit::create([
            'device_version_id' => $args['deviceunit']['deviceVersionId'],
            'team_id' => $team_id,
            'serial' => $args['deviceunit']['serial'],
            'unlock_type' => $args['deviceunit']['unlocktype'],
            'unlock_code' => $args['deviceunit']['unlockcode'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $deviceUnit = DeviceUnit::find($args['deviceUnitId']);
        $team_id = $this->getTeamId();

        if ($deviceUnit && $deviceUnit->team_id === $team_id) {
            $deviceUnit->serial = $args['deviceunit']['serial'];
            $deviceUnit->unlock_type = $args['deviceunit']['unlocktype'];
            $deviceUnit->unlock_code = $args['deviceunit']['unlockcode'];
            return $deviceUnit->save();
        }

        return false;
    }

    public function createTemporaryDeviceUnit(null $root, array $args): mixed
    {
        try {
            DB::beginTransaction();

            $brand = Brand::find($args['input']['brandid']);
            if ($brand) {
                $brand->update(['name' => $args['input']['brandlabel']]);
            } else {
                $brand = Brand::create(['name' => $args['input']['brandlabel']]);
            }

            $type = DeviceType::find($args['input']['typeid']);
            if ($type) {
                $type->update(['name' => $args['input']['typelabel']]);
            } else {
                $type = DeviceType::create(['name' => $args['input']['typelabel']]);
            }

            $device = Device::find($args['input']['deviceid']);
            if ($device) {
                $device->update([
                    'commercial_name' => $args['input']['commercialname'],
                    'brand_id' => $brand->id,
                    'device_type_id' => $type->id,
                    'url' => $args['input']['url'],
                ]);
            } else {
                $device = Device::create([
                    'commercial_name' => $args['input']['commercialname'],
                    'brand_id' => $brand->id,
                    'device_type_id' => $type->id,
                    'url' => $args['input']['url'],
                ]);
            }

            if (!empty($args['input']['versionlabel'])) {
                list($var1, $var2) = $this->separarString($args['input']['versionlabel']);

                $deviceVersion = DeviceVersion::updateOrCreate(
                    ['id' => $args['input']['versionid']],
                    [
                        'version' => $var1,
                        'description' => $var2,
                        'device_id' => $device->id,
                    ]
                );
            }

            DB::commit();

            return [
                '__typename' => 'TemporaryDeviceUnitPayload',
                'status' => true,
                'brand' => [
                    'id' => $brand->id,
                    'label' => $brand->name,
                ],
                'deviceType' => [
                    'id' => $type->id,
                    'label' => $type->name,
                ],
                'device' => [
                    'id' => $device->id,
                    'commercial_name' => $device->commercial_name,
                    'url' => $device->url,
                    'brand' => [
                        'id' => $device->brand->id,
                        'label' => $device->brand->name,
                    ],
                    'deviceType' => [
                        'id' => $device->deviceType->id,
                        'label' => $device->deviceType->name,
                    ],
                ],
                'deviceVersion' => (isset($deviceVersion)) ? [
                    'id' => $deviceVersion->id,
                    'label' => $deviceVersion->label,
                ] : null,
                //'deviceVersionId' => (isset($deviceVersion)) ? $deviceVersion->id : null,
            ];
        } catch (GraphQLBusinessException $e) {
            DB::rollBack();

            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'i18nKey' => $e->getI18nKey(),
            ];
        };
    }

    public function confirmDeviceUnit(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $team_id = $this->getTeamId();
        $order = Order::where('id', $args['input']['order'])->first();
        $tmpOrder = TemporaryDeviceUnit::where('order_id', $args['input']['order'])->first();

        //dd($tmpOrder, $args);

        try {
            DB::beginTransaction();

            $brand = Brand::updateOrCreate(
                ['id' => $args['input']['brandid']],
                ['name' => $args['input']['brandlabel']]
            );

            $type = DeviceType::updateOrCreate(
                ['id' => $args['input']['typeid']],
                ['name' => $args['input']['typelabel']]
            );

            $device = Device::updateOrCreate(
                ['id' => $args['input']['deviceid']],
                [
                    'commercial_name' => $args['input']['devicelabel'],
                    'brand_id' => $brand->id,
                    'device_type_id' => $type->id,
                    'url' => $args['input']['url'],
                ]
            );

            $deviceVersion = DeviceVersion::updateOrCreate(
                ['id' => $args['input']['versionid']],
                [
                    'version' => $args['input']['versionlabel'],
                    'device_id' => $device->id,
                ]
            );

            if ($tmpOrder) {
                $deviceUnit = DeviceUnit::updateOrCreate(
                    ['id' => $args['input']['serialid']],
                    [
                        'serial' => $args['input']['seriallabel'],
                        'unlock_type' => $tmpOrder->unlock_type,
                        'unlock_code' => $tmpOrder->unlock_code,
                        'team_id' => $team_id,
                        'device_version_id' => $deviceVersion->id,
                    ]
                );
                $tmpOrder->delete();
            } else {
                $deviceUnit = DeviceUnit::updateOrCreate(
                    ['id' => $args['input']['deviceunitid']],
                    [
                        'serial' => $args['input']['seriallabel'],
                        'team_id' => $team_id,
                        'device_version_id' => $deviceVersion->id,
                    ]
                );
            }
            $order->device_id = $device->id;
            $order->device_unit_id = $deviceUnit->id;
            $order->save();

            DB::commit();

            return [
                '__typename' => 'ConfirmDeviceUnitPayload',
                'success' => true,
            ];
        } catch (GraphQLBusinessException $e) {
            DB::rollBack();

            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'i18nKey' => $e->getI18nKey(),
            ];
        };
    }
}
