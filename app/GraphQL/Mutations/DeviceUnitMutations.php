<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Brand;
use App\Models\Device;
use App\Models\DeviceType;
use Illuminate\Support\Facades\DB;
use App\Models\DeviceUnit;
use App\Models\DeviceVersion;
use App\Models\TemporaryDeviceUnit;
use App\Traits\TeamContextTrait;
use Exception;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitMutations
{
    use TeamContextTrait;

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
        $team_id = $this->getTeamIdFromContext($context);

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
        $team_id = $this->getTeamIdFromContext($context);

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
                    'commercial_name' => $args['input']['commercialname'],
                    'brand_id' => $brand->id,
                    'device_type_id' => $type->id,
                    'url' => $args['input']['url'],
                ]
            );

            if (!empty($args['input']['versionid']) && !empty($args['input']['versionlabel'])) {
                $deviceVersion = DeviceVersion::updateOrCreate(
                    ['id' => $args['input']['versionid']],
                    [
                        'version' => $args['input']['versionlabel'],
                        'device_id' => $device->id,
                    ]
                );
            }

            $temporaryDeviceUnit = TemporaryDeviceUnit::create([
                'device_id' => $device->id,
                'device_version_id' => isset($deviceVersion) ? $deviceVersion->id : null,
                'device_unit_id' => $args['input']['serialid'],
                'serial' => $args['input']['seriallabel'],
                'unlock_type' => $args['input']['unlocktype'],
                'unlock_code' => $args['input']['unlockcode'],
            ]);
            DB::commit();

            return [
                '__typename' => 'TemporaryDeviceUnitPayload',
                'status' => true,
                'temporarydeviceunit' => $temporaryDeviceUnit->id,
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
                        'name' => $device->brand->name,
                    ],
                    'deviceType' => [
                        'id' => $device->deviceType->id,
                        'name' => $device->deviceType->name,
                    ],
                ]
            ];
        } catch (Exception $e) {
            DB::rollBack();

            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ];
        };
    }
/*
    public function confirmDeviceUnit(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);
    }
        */
}
