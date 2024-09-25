<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\ModuleCategory;
use App\Models\Part;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartFactory extends Factory
{
    protected $model = Part::class;

    public function definition()
    {
        return [
            'brand_id' => Brand::factory(),
            'module_category_id' => ModuleCategory::factory(),
        ];
    }
}
