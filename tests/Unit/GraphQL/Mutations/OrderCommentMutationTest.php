<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Models\Order;
use App\Models\OrderComment;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;

class OrderCommentMutationTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    /**
     * Test to ensure that a customer is successfully created with valid data.
     *
     * @return void
     */
    #[Test]
    public function add_comment_successfully()
    {
        // Crear orden (si no existe)
        $order = Order::factory()->create();

        // Preparar los argumentos para la mutación
        $commentData = [
            'comment' => 'Este es un comentario de prueba',
            'ispublic' => true,
        ];

        // Ejecutar la mutación GraphQL
        $response = $this->graphQL('
            mutation {
                addComment(
                    orderId: "' . $order->id . '",
                    comment: {
                        comment: "' . $commentData['comment'] . '",
                        ispublic: ' . $this->boolToString($commentData['ispublic']) . '
                    }
                ) {
                    id
                    comment
                    created_at
                    is_public
                    user_id
                    was_edited
                    user {
                        name
                        imageUrl
                    }
                }
            }
        ');

        //dd($response->json());

        // Verificar la respuesta de GraphQL
        $response->assertJson([
            'data' => [
                'addComment' => [
                    'comment' => $commentData['comment'],
                    'is_public' => $commentData['ispublic'],
                ]
            ]
        ]);

        // Verificar que el comentario fue creado en la base de datos
        $this->assertDatabaseHas('order_comments', [
            'order_id' => $order->id,
            'team_id' => $this->team->id, // Asumimos que tienes un método que obtiene el team_id
            'comment' => $commentData['comment'],
            'is_public' => $commentData['ispublic'],
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
