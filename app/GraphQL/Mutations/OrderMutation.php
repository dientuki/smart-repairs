<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Order;
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


}