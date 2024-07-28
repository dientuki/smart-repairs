<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\OrderStatusEnum;
use App\Models\Order;
use App\Models\OrderCheck;
use App\Models\TemporaryDeviceUnit;
use App\Traits\TeamContextTrait;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderMutations
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
    public function updateStatus(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        // TODO implement the resolver
        //$user = auth()->user();
        //$phone = $args['phone'];

        $order = Order::find($args['id']);
        $team_id = $this->getTeamIdFromContext($context);

        if ($order && $order->team_id === $team_id) {
            return Order::updateStatus($args['id'], $args['status']);
        }

        return null;
    }


    public function create(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $team_id = $this->getTeamIdFromContext($context);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'status' => OrderStatusEnum::ForBudgeting,
                'observation' => $args['order']['observation'],
                'customer_id' => $args['order']['customerid'],
                'team_id' => $team_id,
                'user_id' => auth()->user()->id
            ]);

            OrderCheck::create([
                'order_id' => $order->id,
                'damages' => json_encode($args['order']['damages']),
                'damages_description' => $args['order']['damagedescription'],
                'features' => json_encode($args['order']['features']),
                'features_description' => $args['order']['featuredescription'],
            ]);

            TemporaryDeviceUnit::where('id', $args['order']['tempdeviceunitid'])->update([
                'order_id' => $order->id,
            ]);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();

            return false;
        };
    }
}
