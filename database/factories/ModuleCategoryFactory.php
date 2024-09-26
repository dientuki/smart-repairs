<?php

namespace Database\Factories;

use App\Models\ModuleCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleCategoryFactory extends Factory
{
    protected $model = ModuleCategory::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
        ];
    }
}
