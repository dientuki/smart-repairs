<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'phone' => $this->faker->optional()->phoneNumber,
            'email' => $this->faker->optional()->safeEmail,
            'team_id' => Team::inRandomOrder()->first()->id
        ];
    }
}
