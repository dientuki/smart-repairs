<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\OrderStatusEnum;
use App\Models\Order;
use App\Models\OrderCheck;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderMutations
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

        $order = Order::find($args['id']);

        if ($order && $order->team_id === auth()->user()->teams->first()->id) {
            return Order::updateStatus($args['id'], $args['status']);
        }

        return null;
    }


    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        try {
            DB::beginTransaction();

            $order = Order::create([
                'id' => (string) Str::ulid(),
                'status' => OrderStatusEnum::ForBudgeting,
                'observation' => $args['order']['observation'],
                'customer_id' => $args['order']['customer_id'],
                'team_id' => auth()->user()->teams->first()->id,
                'user_id' => auth()->user()->id,
                'device_unit_id' => $args['order']['device_unit_id'],
            ]);

            OrderCheck::create([
                'id' => (string) Str::ulid(),
                'order_id' => $order->id,
                'damages' => json_encode($args['order']['damages']),
                'damages_description' => $args['order']['damage_description'],
                'features' => json_encode($args['order']['features']),
                'features_description' => $args['order']['feature_description'],
            ]);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();

            return false;
        };
    }
}
