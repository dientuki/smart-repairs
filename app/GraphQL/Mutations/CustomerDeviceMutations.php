<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Exception;
use App\Models\TemporaryDeviceUnit;
use App\Models\Device;
use App\Models\DeviceUnit;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerDeviceMutations
{
    private function removeEmptyStrings(array $array): array
    {
        // Filter out elements with an empty string value
        return array_filter($array, function ($value) {
            return $value !== "";
        });
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
        if (
            isset($args['deviceunit'])
            && isset($args['deviceunit']['deviceversionid'])
            && ($args['deviceunit']['deviceversionid'] === '')
        ) {
            $deviceVersionId = DeviceUnit::where('id', $args['deviceunit']['deviceunitid'])->value('device_version_id');
            if ($deviceVersionId) {
                $args['deviceunit']['deviceversionid'] = $deviceVersionId;
            }
        }

        try {
            DB::beginTransaction();

            $device = Device::updateOrCreate(
                ['id' => $args['device']['id']],
                [
                    'commercial_name' => $args['device']['commercialname'],
                    'brand_id' => $args['device']['brandid'],
                    'device_type_id' => $args['device']['typeid'],
                    'url' => $args['device']['url'],
                ]
            );

            $temporaryDeviceUnit = TemporaryDeviceUnit::create([
                'device_id' => $device->id,
                'device_version_id' => $args['deviceunit']['deviceversionid'],
                'device_unit_id' => $args['deviceunit']['deviceunitid'],
                'serial' => $args['deviceunit']['serial'],
                'unlock_type' => $args['deviceunit']['unlocktype'],
                'unlock_code' => $args['deviceunit']['unlockcode'],
            ]);
            DB::commit();

            return [
                '__typename' => 'CustomerDeviceUnitPayload',
                'status' => true,
                'temporarydeviceunit' => $temporaryDeviceUnit->id,
                'deviceid' => $device->id
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
}
