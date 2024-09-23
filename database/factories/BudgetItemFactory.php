<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\BudgetItem;
use App\Models\ServiceJob;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetItemFactory extends Factory
{
    protected $model = BudgetItem::class;

    public function definition()
    {
        return [
            'budget_id' => Budget::inRandomOrder()->first()->id,
            'itemable_id' => ServiceJob::factory(),
            'itemable_type' => ServiceJob::class,
            'quantity' => $this->faker->numberBetween(1, 10),
            'unit_price' => $this->faker->randomFloat(2, 1, 1000),
            'item_total' => function (array $attributes) {
                return $attributes['unit_price'] * $attributes['quantity'];
            },
        ];
    }
}
