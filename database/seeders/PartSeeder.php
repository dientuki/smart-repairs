<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = DB::table('brands')->get();
        $moduleCategory = DB::table('module_categories')->get();

        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'abc123',
            'observations' => 'Sin falla',
            'module_category_id' => $moduleCategory[0]->id,
            'brand_id' => $brands[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'def456',
            'observations' => 'Sin falla',
            'module_category_id' => $moduleCategory[1]->id,
            'brand_id' => $brands[1]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
