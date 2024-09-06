<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = DB::table('packages')->get();

        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Laboratronica',
            'package_id' => $packages[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Dientuki\'s Corp',
            'package_id' => $packages[1]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Moncho',
            'package_id' => $packages[2]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
