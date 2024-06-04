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
        $user = DB::table('users')->first()->id;

        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'observation' => 'No enciende (este es obs)',
            'customer_id' => $customers[0]->id,
            'team_id' => $team,
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'observation' => 'creo que es error de usuario',
            'customer_id' => $customers[0]->id,
            'team_id' => $team,
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('orders')->insert([
            'id' => (string) Str::ulid(),
            'status' => OrderStatusEnum::ForBudgeting,
            'observation' => 'Sali a comprar el pan, se metio dentro de uno y le di un mordisco',
            'customer_id' => $customers[1]->id,
            'team_id' => $team,
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
