<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\OrderStatusEnum;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderMutation
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
    public function updateStatus(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];

        return Order::updateStatus($args['id'], $args['status']);
    }


    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): Order
    {
        return Order::create([
            'id' => (string) Str::upper(Str::ulid()),
            'status' => OrderStatusEnum::ForBudgeting,
            'observation' => $args['order']['observation'],
            'customer_id' => $args['order']['customer_id'],
            'team_id' => DB::table('teams')->first()->id,
            'user_id' => DB::table('users')->first()->id,
            'device_unit_id' => $args['order']['device_unit_id'],
        ]);
    }



}