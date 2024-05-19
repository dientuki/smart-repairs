<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderCommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_comments')->insert([
            'order_id' => 1,
            'team_id' => 1,
            'comment' => 'No enciende (este es obs)',
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'order_id' => 2,
            'team_id' => 1,
            'comment' => 'Sali a comprar el pan',
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'order_id' => 1,
            'team_id' => 1,
            'comment' => 'Lo hice encender, pero no da ningun sonido, este es publico',
            'user_id' => 1,
            'is_public' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('order_comments')->insert([
            'order_id' => 1,
            'team_id' => 1,
            'comment' => 'este es privado',
            'user_id' => 1,
            'is_public' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
