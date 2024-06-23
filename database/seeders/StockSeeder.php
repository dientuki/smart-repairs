<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = DB::table('teams')->first()->id;
        $parts = DB::table('parts')->get();
        $l = count($parts);

        for ($i = 0; $i < $l; $i++) {
            DB::table('stocks')->insert([
                'id' => (string) Str::ulid(),
                'part_id' => $parts[$i]->id,
                'quantity' => rand(1, 50),
                'warning' => rand(1, 10),
                'team_id' => $team,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
