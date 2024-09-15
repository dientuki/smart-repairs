<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\DeviceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'commercial_name' => $this->faker->word, // Nombre comercial aleatorio
            'url' => $this->faker->optional()->url, // URL opcional aleatoria
            'brand_id' => Brand::factory(), // Asume que tienes un factory para Brand
            'device_type_id' => DeviceType::factory(), // Asume que tienes un factory para DeviceType
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
