<?php

namespace Database\Seeders;

use App\Enum\DiscountEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ServiceJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = DB::table('teams')->get();

        foreach ($teams as $team) {
            DB::table('service_jobs')->insert([
                'id' => (string) Str::ulid(),
                'name' => 'Mano de obra',
                'price' => 25000,
                'team_id' => $team->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
