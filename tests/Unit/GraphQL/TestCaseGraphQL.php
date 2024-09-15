<?php

namespace Tests\Unit\GraphQL;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Auth;

abstract class TestCaseGraphQL extends TestCase
{
    public function createApplication()
    {
        $app = require __DIR__ . '/../../../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticate(); // Autenticar para pruebas de GraphQL
    }

    /**
     * Simula un usuario autenticado para las pruebas.
     *
     * @param array $attributes
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    protected function authenticate(array $attributes = []): Authenticatable
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $user */
        $user = User::factory()->create($attributes);
        Auth::login($user);

        return $user;
    }
}
