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
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Dientuki\'s Corp',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Moncho',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
