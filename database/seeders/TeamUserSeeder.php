<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('team_user')->insert([
            'user_id' => DB::table('users')->first()->id,
            'team_id' => DB::table('teams')->first()->id
        ]);
    }
}
