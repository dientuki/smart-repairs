<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Device;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceMutation
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
            'id' => (string) Str::ulid(),
            'commercial_name' => $args['device']['commercial_name'],
            'tech_name' => $args['device']['tech_name'],
            'brand_id' => $args['device']['brand_id'],
            'device_type_id' => $args['device']['device_type_id'],
            'url' => $args['device']['url'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $device = Device::find($args['deviceId']);
        $device->commercial_name = $args['device']['commercial_name'];
        $device->tech_name = $args['device']['tech_name'];
        $device->brand_id = $args['device']['brand_id'];
        $device->device_type_id = $args['device']['device_type_id'];
        $device->url = $args['device']['url'];
        $device->save();
        return $device;
    }
}