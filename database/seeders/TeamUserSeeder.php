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

        $teamUserId = 0;
        foreach ($users as $user) {
            $teamUserId++;
            if ($teamUserId > count($teams)) {
                break;
            }
            DB::table('team_user')->insert([
                'user_id' => $user->id,
                'team_id' => $teams[$teamUserId - 1]->id
            ]);
        }
    }
}
