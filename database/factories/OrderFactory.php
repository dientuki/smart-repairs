<?php

namespace Database\Factories;

use App\Enum\OrderStatusEnum;
use App\Models\Customer;
use App\Models\Device;
use App\Models\DeviceUnit;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => $this->faker->randomElement(OrderStatusEnum::getAllCasesAsArray()),
            'observation' => $this->faker->optional()->text,
            'diagnosis' => $this->faker->optional()->text,
            'created_by' => User::factory(),
            'assigned_to' => $this->faker->optional()->randomElement(User::pluck('id')),
            'customer_id' => Customer::factory(),
            'team_id' => Team::inRandomOrder()->first()->id,
            'device_id' => Device::factory(),
            'device_unit_id' => $this->faker->optional()->randomElement(DeviceUnit::pluck('id')),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
