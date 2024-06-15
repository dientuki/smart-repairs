<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\DeviceUnit;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitMutation
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

        return DeviceUnit::create([
            'id' => (string) Str::upper(Str::ulid()),
            'device_id' => $args['deviceUnit']['deviceid'],
            'team_id' => auth()->user()->teams->first()->id,
            'serial' => $args['deviceUnit']['serial'],
            'unlock_type' => $args['deviceUnit']['unlocktype'],
            'unlock_code' => $args['deviceUnit']['unlockcode'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $deviceUnit = DeviceUnit::find($args['deviceUnitId']);

        if ($deviceUnit && $deviceUnit->team_id === auth()->user()->teams->first()->id) {
            $deviceUnit->serial = $args['deviceUnit']['serial'];
            $deviceUnit->unlock_type = $args['deviceUnit']['unlocktype'];
            $deviceUnit->unlock_code = $args['deviceUnit']['unlockcode'];
            return $deviceUnit->save();
        }

        return false;
    }
}