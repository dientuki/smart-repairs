<?php

namespace Tests\Unit\GraphQL\Queries;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Customer;
use App\Models\Team;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\Unit\GraphQL\TestCaseGraphQL;
use PHPUnit\Framework\Attributes\Test;

class CustomerQueryTest extends TestCaseGraphQL
{
    use RefreshDatabase;
    use MakesGraphQLRequests;

    #[Test]
    public function it_can_fetch_a_list_of_customers_ordered_by_first_name()
    {
        Storage::fake('public');

        // Crear un equipo y asociarlo a clientes
        Customer::factory()->create(['first_name' => 'Alice', 'team_id' => $this->team->id]);
        Customer::factory()->create(['first_name' => 'Bob', 'team_id' => $this->team->id]);
        Customer::factory()->create(['first_name' => 'Charlie', 'team_id' => $this->team->id]);

        //$user = $this->authenticate([], $team);

        // Query de GraphQL para obtener los clientes
        $query = '
        {
            customers {
                id
                first_name
                last_name
                label
                phone
                email
            }
        }
        ';

        // Ejecutar la query
        $response = $this->graphQL($query);

        // Verificar que los resultados están ordenados por first_name
        $response->assertJson([
            'data' => [
                'customers' => [
                    ['first_name' => 'Alice'],
                    ['first_name' => 'Bob'],
                    ['first_name' => 'Charlie'],
                ],
            ],
        ]);
    }

    #[Test]
    public function it_fetches_only_customers_belonging_to_the_team()
    {
        Storage::fake('public');

        // Crear dos equipos y asociar clientes
        $team1 = Team::factory()->create();
        Customer::factory()->create(['first_name' => 'Alice', 'team_id' =>$this->team->id]);
        Customer::factory()->create(['first_name' => 'Bob', 'team_id' => $team1->id]);

        //$user = $this->authenticate([], $team1);

        // Query de GraphQL
        $query = '
        {
            customers {
                id
                first_name
            }
        }
        ';

        // Ejecutar la query
        $response = $this->graphQL($query);

        // Verificar que solo se obtienen los clientes del equipo 1
        $response->assertJsonMissing([
            'data' => [
                'customers' => [
                    ['first_name' => 'Bob'],
                ],
            ],
        ])->assertJson([
            'data' => [
                'customers' => [
                    ['first_name' => 'Alice'],
                ],
            ],
        ]);
    }

    #[Test]
    public function it_handles_optional_fields()
    {
        Storage::fake('public');

        // Crear un equipo y un cliente con campos opcionales nulos
        Customer::factory()->create([
            'first_name' => 'Alice',
            'phone' => null,
            'email' => null,
            'team_id' => $this->team->id
        ]);

//$user = $this->authenticate([], $team);

        // Query de GraphQL
        $query = '
        {
            customers {
                id
                first_name
                phone
                email
            }
        }
        ';

        // Ejecutar la query
        $response = $this->graphQL($query);

        // Verificar que los campos opcionales pueden ser nulos
        $response->assertJson([
            'data' => [
                'customers' => [
                    [
                        'first_name' => 'Alice',
                        'phone' => null,
                        'email' => null,
                    ],
                ],
            ],
        ]);
    }

    #[Test]
    public function it_returns_empty_list_if_team_has_no_customers()
    {
        Storage::fake('public');

        // Crear un equipo sin clientes
        $team = Team::factory()->create();

        $user = $this->authenticate([], $team);

        // Query de GraphQL
        $query = '
        {
            customers {
                id
                first_name
            }
        }
        ';

        // Ejecutar la query
        $response = $this->graphQL($query);

        // Verificar que la lista está vacía
        $response->assertJson([
            'data' => [
                'customers' => [],
            ],
        ]);
    }

    #[Test]
    public function user_not_authenticated_cannot_access()
    {
        // Crear algunos clientes en la base de datos
        Customer::factory()->create(['first_name' => 'Alice', 'team_id' => $this->team->id]);
        Customer::factory()->create(['first_name' => 'Bob', 'team_id' => $this->team->id]);

        $this->logout();

        // Realizar la consulta GraphQL sin autenticación
        $query = '
        {
            customers {
                id
                first_name
                last_name
                label
                phone
                email
            }
        }
        ';

        $response = $this->graphQL($query);

        // Verificar que el usuario no autenticado no pueda acceder a los clientes
        $response->assertStatus(401); // O el código de estado HTTP que uses para no autorizado
        $response->assertJson(['message' => 'Unauthenticated.']);
    }
}
