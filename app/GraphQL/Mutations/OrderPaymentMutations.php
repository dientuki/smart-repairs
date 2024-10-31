<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Exceptions\GraphQLBusinessException;
use App\Models\OrderPayment;
use App\Traits\UserDataTrait;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class OrderPaymentMutations
{
    use UserDataTrait;

    /**
     * Return a value for the field.
     *
     * @param  null  $root Always null, since this field has no parent.
     * @param  array{}  $args The field arguments passed by the client.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context Shared between all fields.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Metadata for advanced query resolution.
     * @return mixed The result of resolving the field, matching what was promised in the schema
     */
    public function addPayment(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed
    {
        try {
            $payment = OrderPayment::create([
                'order_id' => $args['order'],
                'amount' => $args['amount'],
            ]);

            return [
                '__typename' => 'AddPaymentPayload',
                'success' => true,
                'amount' => $payment->amount,
                'created_at' => $payment->created_at,
            ];
        } catch (GraphQLBusinessException $e) {
            return [
                '__typename' => 'ErrorPayload',
                'status' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'i18nKey' => $e->getI18nKey(),
            ];
        };
    }
}
