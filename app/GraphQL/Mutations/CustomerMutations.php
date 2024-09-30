<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enum\OperationStatusEnum;
use App\Exceptions\GraphQLBusinessException;
use App\Models\Customer;
use App\Traits\UserDataTrait;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class CustomerMutations
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
    public function upsertCustomer(null $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): array
    {
        $customer = Customer::find($args['customer']['id']);
        $team_id = $this->getTeamId();
        $status = OperationStatusEnum::NoChange;

        try {
            if ($customer && $customer->team_id !== $team_id) {
                throw new GraphQLBusinessException('customer.error.wrong_team');
            }

            if ($customer) {
                $customer->first_name = $args['customer']['firstname'];
                $customer->last_name = $args['customer']['lastname'];
                $customer->phone = $args['customer']['phone'];
                $customer->email = $args['customer']['email'];

                if ($customer->save()) {
                    $status = $customer->wasChanged() ? OperationStatusEnum::Updated : OperationStatusEnum::NoChange;
                }
            } else {
                $customer = new Customer();
                $customer->team_id = $team_id; // Asignar el team_id
                $customer->first_name = $args['customer']['firstname'];
                $customer->last_name = $args['customer']['lastname'];
                $customer->phone = $args['customer']['phone'];
                $customer->email = $args['customer']['email'];

                if ($customer->save()) {
                    $status = OperationStatusEnum::Created;
                }
            }

            return [
                '__typename' => 'UpsertCustomerPayload',
                'customer' => [
                    'id' => $customer->id,
                    'label' => $customer->label, // Asumiendo que tienes un método o atributo para obtener el label
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                ],
                'operation' => $status->value,
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
