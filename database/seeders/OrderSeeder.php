<?php

namespace Database\Seeders;

use App\Enum\OrderStatusEnum;
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
        $customers = DB::table('customers')->get();
        $team = DB::table('teams')->first()->id;

        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'customer_id' => $customers[0]->id,
            'team_id' => $team,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'customer_id' => $customers[0]->id,
            'team_id' => $team,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'customer_id' => $customers[1]->id,
            'team_id' => $team,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
