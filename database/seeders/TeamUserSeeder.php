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

        $users = DB::table('users')->get();
        $teams = DB::table('teams')->get();

        DB::table('team_user')->insert([
            'user_id' => $users[0]->id,
            'team_id' => $teams[0]->id
        ]);
        DB::table('team_user')->insert([
            'user_id' => $users[1]->id,
            'team_id' => $teams[1]->id
        ]);
        DB::table('team_user')->insert([
            'user_id' => $users[2]->id,
            'team_id' => $teams[2]->id
        ]);
        // segundo usuario medio al team medio
        DB::table('team_user')->insert([
            'user_id' => $users[3]->id,
            'team_id' => $teams[1]->id
        ]);
        // segundo usuario full al team full, que tambien esta en el team medio
        DB::table('team_user')->insert([
            'user_id' => $users[3]->id,
            'team_id' => $teams[0]->id
        ]);
    }
}
