<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\DeviceUnit;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class DeviceUnitMutations
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
            'device_id' => $args['deviceunit']['deviceid'],
            'team_id' => auth()->user()->teams->first()->id,
            'serial' => $args['deviceunit']['serial'],
            'unlock_type' => $args['deviceunit']['unlocktype'],
            'unlock_code' => $args['deviceunit']['unlockcode'],
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $deviceUnit = DeviceUnit::find($args['deviceUnitId']);

        if ($deviceUnit && $deviceUnit->team_id === auth()->user()->teams->first()->id) {
            $deviceUnit->serial = $args['deviceunit']['serial'];
            $deviceUnit->unlock_type = $args['deviceunit']['unlocktype'];
            $deviceUnit->unlock_code = $args['deviceunit']['unlockcode'];
            return $deviceUnit->save();
        }

        return false;
    }
}