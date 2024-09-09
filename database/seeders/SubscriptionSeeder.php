<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = DB::table('packages')->get();
        $teams = DB::table('teams')->get();

        DB::table('subscriptions')->insert([
            'id' => (string) Str::ulid(),
            'package_id' => $packages[0]->id,
            'team_id' => $teams[0]->id,
            'trial_end_at' => now()->addDays(15),
            'start_at' => now(),
            'end_at' => now()->addMonth(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('subscriptions')->insert([
            'id' => (string) Str::ulid(),
            'package_id' => $packages[1]->id,
            'team_id' => $teams[1]->id,
            'trial_end_at' => now()->addDays(15),
            'start_at' => now(),
            'end_at' => now()->addMonth(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('subscriptions')->insert([
            'id' => (string) Str::ulid(),
            'package_id' => $packages[2]->id,
            'team_id' => $teams[2]->id,
            'trial_end_at' => now()->addDays(15),
            'start_at' => now(),
            'end_at' => now()->addMonth(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
