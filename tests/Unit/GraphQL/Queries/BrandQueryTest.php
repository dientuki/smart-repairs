<?php

namespace Tests\Unit\GraphQL\Queries;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Brand; // Asegúrate de importar tu modelo Brand
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use PHPUnit\Framework\Attributes\Test;
use Tests\Unit\GraphQL\TestCaseGraphQL;

class BrandQueryTest extends TestCaseGraphQL
{
    use RefreshDatabase; // Este trait asegura que la base de datos se reinicia entre pruebas
    use MakesGraphQLRequests;

    #[Test]
    public function it_can_fetch_a_list_of_brands_ordered_by_name()
    {
        Storage::fake('public');

        // Crear algunas marcas en la base de datos usando el factory
        Brand::factory()->create(['name' => 'Nike', 'hash_filename' => 'nike.jpg']);
        Brand::factory()->create(['name' => 'Adidas', 'hash_filename' => 'adidas.jpg']);
        Brand::factory()->create(['name' => 'Puma', 'hash_filename' => 'puma.jpg']);

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
        $response = $this->graphQL($query);

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

    #[Test]
    public function it_can_fetch_a_list_of_brands_ordered_by_name_without_image()
    {
        Storage::fake('public');

        // Crear algunas marcas en la base de datos usando el factory
        Brand::factory()->create(['name' => 'Nike', 'hash_filename' => 'nike.jpg']);
        Brand::factory()->create(['name' => 'Adidas']);
        Brand::factory()->create(['name' => 'Puma', 'hash_filename' => 'puma.jpg']);

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
        $response = $this->graphQL($query);

        // Verificar que la respuesta contiene los datos esperados y están ordenados
        $response->assertJson([
            'data' => [
                'brands' => [
                    ['name' => 'Adidas', 'imageUrl' => null, 'label' => 'Adidas'],
                    ['name' => 'Nike', 'imageUrl' => Storage::url('nike.jpg'), 'label' => 'Nike'],
                    ['name' => 'Puma', 'imageUrl' => Storage::url('puma.jpg'), 'label' => 'Puma'],
                ],
            ],
        ]);
    }

    #[Test]
    public function user_not_authenticated_cannot_access()
    {
        // Realizar la consulta GraphQL sin autenticación
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
        $this->assertUserNotAuthenticated($query);
    }
}
