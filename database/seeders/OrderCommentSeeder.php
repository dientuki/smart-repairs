<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = DB::table('teams')->first()->id;
        $users = DB::table('users')->get();
        $orders = DB::table('orders')->get();

        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[0]->id,
            'team_id' => $team,
            'comment' => 'Lo hice encender, pero no da ningun sonido, este es publico',
            'user_id' => $users[0]->id,
            'is_public' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[0]->id,
            'team_id' => $team,
            'comment' => 'este es privado',
            'user_id' => $users[4]->id,
            'is_public' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
