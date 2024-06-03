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
        $user = DB::table('users')->first()->id;
        $orders = DB::table('orders')->get();

        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[0]->id,
            'team_id' => $team,
            'comment' => 'No enciende (este es obs)',
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[1]->id,
            'team_id' => $team,
            'comment' => 'Sali a comprar el pan',
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[0]->id,
            'team_id' => $team,
            'comment' => 'Lo hice encender, pero no da ningun sonido, este es publico',
            'user_id' => $user,
            'is_public' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[0]->id,
            'team_id' => $team,
            'comment' => 'este es privado',
            'user_id' => $user,
            'is_public' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $orders[2]->id,
            'team_id' => $team,
            'comment' => 'creo que es error de usuario',
            'user_id' => $user,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
