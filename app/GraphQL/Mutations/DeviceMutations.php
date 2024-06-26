<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Device;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceMutations
{
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

        return Device::create([
            'commercial_name' => $args['device']['commercialname'],
            'brand_id' => $args['device']['brandid'],
            'device_type_id' => $args['device']['typeid'],
            'url' => $args['device']['url'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $device = Device::find($args['deviceId']);
        if ($device) {
            $device->commercial_name = $args['device']['commercialname'];
            $device->brand_id = $args['device']['brandid'];
            $device->device_type_id = $args['device']['typeid'];
            $device->url = $args['device']['url'];
            return $device->save();
        }

        return false;
    }
}
