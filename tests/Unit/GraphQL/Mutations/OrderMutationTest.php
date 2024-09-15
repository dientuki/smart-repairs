<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;

class OrderMutationTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    /**
     * Test to ensure that a customer is successfully created with valid data.
     *
     * @return void
     */
    #[Test]
    public function update_diagnosis_for_order_belongs_to_team_successfully()
    {
        $newDiagnosis = 'UpdatedDiagnosis';
        $order = Order::factory()->create(['team_id' => $this->team->id]);

        $response = $this->graphQL('
            mutation {
                updateDiagnosis(
                    id: "' . $order->id . '",
                    diagnosis: "' . $newDiagnosis . '"
                )
            }
        ');


        // Verificar que la mutación retornó true
        $response->assertJson([
            'data' => [
                'updateDiagnosis' => true,
            ],
        ]);

        // Verificar que los datos del cliente se han actualizado en la base de datos
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'diagnosis' => $newDiagnosis
        ]);
    }

    #[Test]
    public function not_update_diagnosis_for_order_not_belongs_to_team()
    {
        $team = Team::factory()->create();
        $order = Order::factory()->create(['team_id' => $team->id]);

        $response = $this->graphQL('
            mutation {
                updateDiagnosis(
                    id: "' . $order->id . '",
                    diagnosis: "Lorem ipsum"
                )
            }
        ');


        // Verificar que la mutación retornó true
        $response->assertJson([
            'data' => [
                'updateDiagnosis' => false,
            ],
        ]);

        // Verificar que los datos del cliente se han actualizado en la base de datos
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'diagnosis' => $order->diagnosis
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
