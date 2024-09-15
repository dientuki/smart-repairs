<?php

namespace Tests\Unit\GraphQL\Queries;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Brand; // Asegúrate de importar tu modelo Brand
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\Unit\GraphQL\TestCaseGraphQL;

class BrandQueryTest extends TestCaseGraphQL
{
    use RefreshDatabase; // Este trait asegura que la base de datos se reinicia entre pruebas


    #[Test]
    public function it_can_fetch_a_list_of_brands_ordered_by_name()
    {
        Storage::fake('public');

        // Crear algunas marcas en la base de datos usando el factory
        Brand::factory()->create(['name' => 'Nike', 'hash_filename' => 'nike.jpg']);
        Brand::factory()->create(['name' => 'Adidas', 'hash_filename' => 'adidas.jpg']);
        Brand::factory()->create(['name' => 'Puma', 'hash_filename' => 'puma.jpg']);

        /** @var \Illuminate\Contracts\Auth\Authenticatable $user */
        $user = User::factory()->create();
        $this->actingAs($user); // Simular inicio de sesión

        // Query de GraphQL para obtener las marcas
        $query = '
        {
            brands {
                id
                name
                imageUrl
                label
            }
        }
        ';

        // Ejecutar la query en el endpoint de GraphQL
        $response = $this->postJson('/graphql', ['query' => $query]);

        // Verificar que la respuesta contiene los datos esperados y están ordenados
        $response->assertJson([
            'data' => [
                'brands' => [
                    ['name' => 'Adidas', 'imageUrl' => Storage::url('adidas.jpg'), 'label' => 'Adidas'],
                    ['name' => 'Nike', 'imageUrl' => Storage::url('nike.jpg'), 'label' => 'Nike'],
                    ['name' => 'Puma', 'imageUrl' => Storage::url('puma.jpg'), 'label' => 'Puma'],
                ],
            ],
        ]);
    }
}
