<?php

namespace Tests\Unit\GraphQL\Mutations;

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
        $team = Team::factory()->create();
        $user = $this->authenticate([], $team);

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
            'team_id' => $team->id,
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
        $team = Team::factory()->create();
        $user = $this->authenticate([], $team);

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
