<?php

namespace Database\Factories;

use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'website' => $this->faker->optional()->url,
            'email' => $this->faker->optional()->safeEmail,
            'phones' => json_encode([$this->faker->phoneNumber]),
            'address' => $this->faker->optional()->address,
            'hash_filename' => $this->faker->optional()->imageUrl(),
        ];
    }
}
