<?php

namespace Tests\Unit\GraphQL;

use App\Models\Team;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;

abstract class TestCaseGraphQL extends TestCase implements RequiresAuthenticationInterface
{
    use MakesGraphQLRequests;

    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();
        $this->team = Team::factory()->create();
        $this->authenticate([], $this->team); // Autenticar para pruebas de GraphQL
    }

    /**
     * Simula un usuario autenticado para las pruebas.
     *
     * @param array $attributes
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    protected function authenticate(array $attributes = [], Team $team = null): Authenticatable
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $user */
        $user = User::factory()->create($attributes);

        // Si no se pasa un equipo, se crea uno nuevo
        if (!$team) {
            $team = Team::factory()->create();
        }

        if (!($user instanceof User)) {
            throw new \Exception('User instance is not of type User');
        }

        // Asociar al usuario con el equipo
        $team->members()->attach($user);
        $user->latest_team_id = $team->id;
        $user->save();

        Auth::login($user);

        return $user;
    }

    /**
     * Desloguea al usuario actual.
     */
    protected function logout()
    {
        Auth::logout();
    }

    // En una clase base TestCaseGraphQL
    public function assertUserNotAuthenticated($query)
    {
        $this->logout();

        $response = $this->graphQL($query);

        $response->assertStatus(401); // O el código de estado HTTP que uses para no autorizado
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    public function boolToString(bool $value): string
    {
        return $value ? 'true' : 'false';
    }
}
