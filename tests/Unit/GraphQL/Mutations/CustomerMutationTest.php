<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Models\Customer;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;

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
        $response = $this->graphQL('
            mutation {
                addCustomer(customer: {
                    firstname: "John",
                    lastname: "Doe",
                    phone: "+123456789",
                    email: "john.doe@example.com"
                }) {
                    id
                    label
                    first_name
                    last_name
                    phone
                    email
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'addCustomer' => [
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'phone' => '+123456789',
                    'email' => 'john.doe@example.com',
                ],
            ],
        ]);

        $this->assertDatabaseHas('customers', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '+123456789',
            'email' => 'john.doe@example.com',
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
                addCustomer(customer: {
                    firstname: "John",
                    lastname: "Doe",
                    phone: "",
                    email: ""
                }) {
                    id
                }
            }
        ');

        $response->assertJson([
          'errors' => [
              [
                  'message' => 'Validation failed for the field [addCustomer].',
                  'extensions' => [
                      'validation' => [
                          'customer.phone' => [
                              'The customer.phone field is required when customer.email is not present.',
                          ],
                          'customer.email' => [
                              'The customer.email field is required when customer.phone is not present.',
                          ],
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
        $customer = Customer::factory()->create(['team_id' => $this->team->id]);

        // Realizar la mutación de actualización
        $response = $this->graphQL('
            mutation {
                updateCustomer(customerId: "' . $customer->id . '", customer: {
                    firstname: "UpdatedFirstName",
                    lastname: "UpdatedLastName",
                    phone: "+123456789",
                    email: "updated@example.com"
                })
            }
        ');

        // Verificar que la mutación retornó true
        $response->assertJson([
            'data' => [
                'updateCustomer' => true,
            ],
        ]);

        // Verificar que los datos del cliente se han actualizado en la base de datos
        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'first_name' => 'UpdatedFirstName',
            'last_name' => 'UpdatedLastName',
            'phone' => '+123456789',
            'email' => 'updated@example.com',
        ]);
    }

    #[Test]
    public function user_cannot_update_customer_from_different_team()
    {
        // Crear un equipo y cliente
        $team = Team::factory()->create();
        $customer = Customer::factory()->create(['team_id' => $team->id]);

        // Intentar actualizar con datos inválidos
        $response = $this->graphQL('
            mutation {
                updateCustomer(customerId: "' . $customer->id . '", customer: {
                    firstname: "UpdatedFirstName",
                    lastname: "UpdatedLastName",
                    phone: "+123456789",
                    email: "updated@example.com"
                })
            }
        ');

        //dd($response);

        // Verificar que la mutación retornó false (no se actualizó)
        $response->assertJson([
            'data' => [
                'updateCustomer' => false,
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
                addCustomer(customer: {
                    firstname: "John",
                    lastname: "Doe",
                    phone: "+123456789",
                    email: "john.doe@example.com"
                }) {
                    id
                }
            }
        ';

        $this->assertUserNotAuthenticated($query);
    }
}
