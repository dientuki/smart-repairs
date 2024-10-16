<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\OrderComment;
use App\Models\Order;
use App\Models\Team;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderComment>
 */
class OrderCommentFactory extends Factory
{
    protected $model = OrderComment::class;

    public function definition()
    {
        return [
            'order_id' => Order::factory(),
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'comment' => $this->faker->sentence(),
            'is_public' => $this->faker->boolean(),
            'was_edited' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
