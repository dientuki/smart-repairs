<?php

namespace Tests\Unit\GraphQL\Mutations;

use App\Models\Order;
use App\Models\OrderComment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Auth;

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

    #[Test]
    public function cannot_add_comment_with_invalid_data()
    {
        // Crear orden (si no existe)
        $order = Order::factory()->create();

        // Preparar los argumentos para la mutación
        $commentData = [
            'comment' => null,
            'ispublic' => null,
        ];

        // Ejecutar la mutación GraphQL
        $response = $this->graphQL('
            mutation {
                addComment(
                    orderId: "' . $order->id . '",
                    comment: {
                        comment: "' . $commentData['comment'] . '",
                        ispublic: ' . $this->boolToString(true) . '
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

        $response->assertJsonStructure([
            'errors' => [
                [
                    'message',
                    'extensions' => [
                        'validation' => [
                            'comment.comment',
                        ],
                    ],
                ],
            ],
          ]);
    }

    #[Test]
    public function update_my_comment_successfully()
    {
        // Crear orden (si no existe)
        $order = Order::factory()->create();
        $orderComment = OrderComment::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
            'user_id' => Auth::id()
        ]);

        // Preparar los argumentos para la mutación
        $commentData = [
            'comment' => 'Este es un nuevo comentario de prueba',
            'ispublic' => false,
        ];

        // Ejecutar la mutación GraphQL
        $response = $this->graphQL('
            mutation {
                updateComment(
                    commentId: "' . $orderComment->id . '",
                    comment: {
                        comment: "' . $commentData['comment'] . '",
                        ispublic: ' . $this->boolToString($commentData['ispublic']) . '
                    }
                )
            }
        ');

        // Verificar la respuesta de GraphQL
        $response->assertJson([
            'data' => [
                'updateComment' => true
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

    #[Test]
    public function cannot_update_other_users_comments()
    {
        // Crear orden (si no existe)
        $order = Order::factory()->create();
        $orderComment = OrderComment::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
        ]);

        // Preparar los argumentos para la mutación
        $commentData = [
            'comment' => 'Este es un nuevo comentario de prueba',
            'ispublic' => false,
        ];

        // Ejecutar la mutación GraphQL
        $response = $this->graphQL('
            mutation {
                updateComment(
                    commentId: "' . $orderComment->id . '",
                    comment: {
                        comment: "' . $commentData['comment'] . '",
                        ispublic: ' . $this->boolToString($commentData['ispublic']) . '
                    }
                )
            }
        ');

        // Verificar la respuesta de GraphQL
        $response->assertJson([
            'data' => [
                'updateComment' => false
            ]
        ]);
    }

    #[Test]
    public function cannot_update_comment_with_invalid_data()
    {
        // Crear orden (si no existe)
        $order = Order::factory()->create();
        $orderComment = OrderComment::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
        ]);

        // Preparar los argumentos para la mutación
        $commentData = [
            'comment' => null,
            'ispublic' => null,
        ];

        // Ejecutar la mutación GraphQL
        $response = $this->graphQL('
            mutation {
                updateComment(
                    commentId: "' . $orderComment->id . '",
                    comment: {
                        comment: "' . $commentData['comment'] . '",
                        ispublic: ' . $this->boolToString(true) . '
                    }
                )
            }
        ');

        // Verificar la respuesta de GraphQL
        $response->assertJsonStructure([
            'errors' => [
                [
                    'message',
                    'extensions' => [
                        'validation' => [
                            'comment.comment',
                        ],
                    ],
                ],
            ],
          ]);
    }

    #[Test]
    public function delete_my_comment_successfully()
    {
        $order = Order::factory()->create();
        $orderComment = OrderComment::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
            'user_id' => Auth::id()
        ]);

        $response = $this->graphQL('
            mutation {
                deleteComment(commentId: "' . $orderComment->id . '")
            }
        ');

        $response->assertJson([
            'data' => [
                'deleteComment' => true
            ]
        ]);

        // Verificar que el comentario fue eliminado de la base de datos
        $this->assertDatabaseMissing('order_comments', [
            'id' => $orderComment->id
        ]);
    }

    #[Test]
    public function cannot_delete_other_users_comments()
    {
        $order = Order::factory()->create();
        $orderComment = OrderComment::factory()->create([
            'order_id' => $order->id,
            'team_id' => $this->team->id,
        ]);

        $response = $this->graphQL('
            mutation {
                deleteComment(commentId: "' . $orderComment->id . '")
            }
        ');

        $response->assertJson([
            'data' => [
                'deleteComment' => false
            ]
        ]);

        // Verificar que el comentario fue eliminado de la base de datos
        $this->assertDatabaseHas('order_comments', [
            'id' => $orderComment->id
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
