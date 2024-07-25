<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Exception;
use App\Models\Device;
use App\Models\TemporaryDeviceUnit;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerDeviceMutations
{
    private function removeEmptyStrings(array $array): array {
        // Filter out elements with an empty string value
        return array_filter($array, function($value) {
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
        //dd($args);
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

            return $temporaryDeviceUnit->id;
        } catch (Exception $e) {
            DB::rollBack();

            dd($e);

            return false;
        };
    }
}
