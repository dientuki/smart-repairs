<?php

namespace Database\Factories;

use App\Models\Discount;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountFactory extends Factory
{
    protected $model = Discount::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'team_id' => Team::inRandomOrder()->first()->id
        ];
    }
}
