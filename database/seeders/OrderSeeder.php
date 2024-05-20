<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            'status' => 'for budgeting', //'OrderStatusEnum::FORBUDGETING,
            'customer_id' => 1,
            'team_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'status' => 'for budgeting', //'OrderStatusEnum::FORBUDGETING,
            'customer_id' => 1,
            'team_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
