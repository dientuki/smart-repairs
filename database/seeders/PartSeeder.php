<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('parts')->insert([
            'name' => 'Pin de carga',
            'part_number' => 'abc123',
            'brand_id' => 1
        ]);
        DB::table('parts')->insert([
            'name' => 'Pantalla',
            'part_number' => 'def456',
            'brand_id' => 2
        ]);
    }
}
