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
            'part_number' => 'abc123',
            'observations' => 'Sin falla',
            'module_category_id' => 1,
            'brand_id' => 1
        ]);
        DB::table('parts')->insert([
            'part_number' => 'def456',
            'observations' => 'Sin falla',
            'module_category_id' => 2,
            'brand_id' => 2
        ]);
    }
}
