<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer = DB::table('customers')->first()->id;
        $team = DB::table('teams')->first()->id;

        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => 'for budgeting', //'OrderStatusEnum::FORBUDGETING,
            'customer_id' => $customer,
            'team_id' => $team,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => 'for budgeting', //'OrderStatusEnum::FORBUDGETING,
            'customer_id' => $customer,
            'team_id' => $team,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
