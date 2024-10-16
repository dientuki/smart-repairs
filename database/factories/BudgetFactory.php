<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Order;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetFactory extends Factory
{
    protected $model = Budget::class;

    public function definition()
    {
        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'team_id' => Team::inRandomOrder()->first()->id
        ];
    }
}
