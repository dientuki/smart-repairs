<?php

namespace Database\Factories;

use App\Models\ServiceJob;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceJobFactory extends Factory
{
    protected $model = ServiceJob::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'team_id' => Team::inRandomOrder()->first()->id
        ];
    }
}
