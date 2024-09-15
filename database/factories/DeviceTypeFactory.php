<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeviceType>
 */
class DeviceTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word, // Nombre aleatorio para el tipo de dispositivo
            'hash_filename' => $this->faker->optional()->word, // Nombre de archivo hash opcional
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
