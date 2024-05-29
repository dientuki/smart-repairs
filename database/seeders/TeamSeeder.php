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
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Laboratronica',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
