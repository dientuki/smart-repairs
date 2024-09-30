<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Models\Customer;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;
use Faker\Factory;

class CustomerMutationTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    /**
     * Test to ensure that a customer is successfully created with valid data.
     *
     * @return void
     */
    #[Test]
    public function add_customer_successfully()
    {
        $faker = Factory::create();

        $customer = [
            'firstname' => $faker->firstName,
            'lastname' => $faker->lastName,
            'phone' => '+123456789',
            'email' => $faker->email,
        ];

        $response = $this->graphQL('
            mutation {
                upsertCustomer(
                    customer: {
                        id: "",
                        firstname: "' . $customer['firstname'] . '",
                        lastname: "' . $customer['lastname'] . '",
                        phone: "' . $customer['phone'] . '",
                        email: "' . $customer['email'] . '"
                    }
                ) {
                    __typename
                    ... on UpsertCustomerPayload {
                        customer {
                            id
                            label
                            first_name
                            last_name
                            phone
                            email
                        }
                        operation
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'upsertCustomer' => [
                    '__typename' => 'UpsertCustomerPayload',
                    'customer' => [
                        'label' => $customer['firstname'] . ' ' . $customer['lastname'],
                        'first_name' => $customer['firstname'],
                        'last_name' => $customer['lastname'],
                        'phone' => $customer['phone'],
                        'email' => $customer['email'],
                    ],
                    'operation' => 'Created',
                ],
            ],
        ]);

        $this->assertDatabaseHas('customers', [
            'first_name' => $customer['firstname'],
            'last_name' => $customer['lastname'],
            'phone' => $customer['phone'],
            'email' => $customer['email'],
            'team_id' => $this->team->id
        ]);
    }

    /**
     * Test to ensure that the mutation validation works correctly.
     *
     * @return void
     */
    #[Test]
    public function add_customer_validation()
    {
        $response = $this->graphQL('
            mutation {
                upsertCustomer(
                    customer: {
                        id: "",
                        firstname: "Jhon",
                        lastname: "Doe",
                        phone: "",
                        email: ""
                    }
                ) {
                    __typename
                    ... on UpsertCustomerPayload {
                        customer {
                            id
                            label
                            first_name
                            last_name
                            phone
                            email
                        }
                        operation
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        $response->assertJsonStructure([
          'errors' => [
              [
                  'message',
                  'extensions' => [
                      'validation' => [
                          'customer.phone',
                          'customer.email',
                      ],
                  ],
              ],
          ],
        ]);
    }

    #[Test]
    public function update_customer_successfully()
    {
        // Crear un equipo y cliente
        $customerDB = Customer::factory()->create(['team_id' => $this->team->id]);

        $faker = Factory::create();
        $customer = [
            'firstname' => $faker->firstName,
            'lastname' => $faker->lastName,
            'phone' => '+123456789',
            'email' => $faker->email,
        ];

        // Realizar la mutación de actualización
        $response = $this->graphQL('
            mutation {
                upsertCustomer(
                    customer: {
                        id: "' . $customerDB->id . '",
                        firstname: "' . $customer['firstname'] . '",
                        lastname: "' . $customer['lastname'] . '",
                        phone: "' . $customer['phone'] . '",
                        email: "' . $customer['email'] . '"
                    }
                ) {
                    __typename
                    ... on UpsertCustomerPayload {
                        customer {
                            id
                            label
                            first_name
                            last_name
                            phone
                            email
                        }
                        operation
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        // Verificar que la mutación retornó true
        $response->assertJson([
            'data' => [
                'upsertCustomer' => [
                    '__typename' => 'UpsertCustomerPayload',
                    'customer' => [
                        'id' => $customerDB->id,
                        'label' => $customer['firstname'] . ' ' . $customer['lastname'],
                        'first_name' => $customer['firstname'],
                        'last_name' => $customer['lastname'],
                        'phone' => $customer['phone'],
                        'email' => $customer['email'],
                    ],
                    'operation' => 'Updated',
                ],
            ],
        ]);

        // Verificar que los datos del cliente se han actualizado en la base de datos
        $this->assertDatabaseHas('customers', [
            'id' => $customerDB->id,
            'first_name' => $customer['firstname'],
            'last_name' => $customer['lastname'],
            'phone' => $customer['phone'],
            'email' => $customer['email'],
        ]);
    }

    #[Test]
    public function user_cannot_update_customer_from_different_team()
    {
        // Crear un equipo y cliente
        $team = Team::factory()->create();
        $customerDB = Customer::factory()->create(['team_id' => $team->id]);

        // Intentar actualizar con datos inválidos
        $faker = Factory::create();
        $customer = [
            'firstname' => $faker->firstName,
            'lastname' => $faker->lastName,
            'phone' => '+123456789',
            'email' => $faker->email,
        ];

        // Realizar la mutación de actualización
        $response = $this->graphQL('
            mutation {
                upsertCustomer(
                    customer: {
                        id: "' . $customerDB->id . '",
                        firstname: "' . $customer['firstname'] . '",
                        lastname: "' . $customer['lastname'] . '",
                        phone: "' . $customer['phone'] . '",
                        email: "' . $customer['email'] . '"
                    }
                ) {
                    __typename
                    ... on UpsertCustomerPayload {
                        customer {
                            id
                            label
                            first_name
                            last_name
                            phone
                            email
                        }
                        operation
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ');

        // Verificar que la mutación retornó false (no se actualizó)
        $response->assertJson([
            'data' => [
                'upsertCustomer' => [
                    '__typename' => 'ErrorPayload',
                    'status' => false,
                    'i18nKey' => 'customer.error.wrong_team'
                ],
            ],
        ]);
    }

    /**
     * Test to ensure that an unauthenticated user cannot access the mutation.
     *
     * @return void
     */
    #[Test]
    public function user_not_authenticated_cannot_access()
    {
        $query = '
            mutation {
                upsertCustomer(
                    customer: {
                        id: "",
                        firstname: "name",
                        lastname: "last",
                        phone: "+123456789",
                        email: "email@gmail.com"
                    }
                ) {
                    __typename
                    ... on UpsertCustomerPayload {
                        customer {
                            id
                            label
                            first_name
                            last_name
                            phone
                            email
                        }
                        operation
                    }
                    ... on ErrorPayload {
                        status
                        i18nKey
                    }
                }
            }
        ';

        $this->assertUserNotAuthenticated($query);
    }
}
