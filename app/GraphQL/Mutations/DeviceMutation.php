<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Customer;
use App\Models\Device;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerMutation
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
        //$user = auth()->user();

        return Device::create([
            'id' => (string) Str::upper(Str::ulid()),
            'commercial_name' => $args['device']['commercial_name'],
            'tech_name' => $args['device']['tech_name'],
            'brand' => $args['device']['brand'],
            'type' => $args['device']['type'],
            'url' => $args['device']['url'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        $device = Device::find($args['deviceId']);
        $device->commercial_name = $args['device']['commercial_name'];
        $device->tech_name = $args['device']['tech_name'];
        $device->brand = $args['device']['brand'];
        $device->type = $args['device']['type'];
        $device->url = $args['device']['url'];
        $device->save();
        return $device;
    }
}