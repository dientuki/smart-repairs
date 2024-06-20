<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Customer;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerMutations
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
        return Customer::create([
            'id' => (string) Str::ulid(),
            'first_name' => $args['customer']['firstname'],
            'last_name' => $args['customer']['lastname'],
            'phone' => $args['customer']['phone'],
            'email' => $args['customer']['email'],
            'team_id' => auth()->user()->teams->first()->id
        ]);
    }

    public function update(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): bool
    {
        $customer = Customer::find($args['customerId']);

        if ($customer && $customer->team_id === auth()->user()->teams->first()->id) {
            $customer->first_name = $args['customer']['firstname'];
            $customer->last_name = $args['customer']['lastname'];
            $customer->phone = $args['customer']['phone'];
            $customer->email = $args['customer']['email'];
            return $customer->save();
        }

        return false;
    }
}
