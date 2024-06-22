<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ModuleCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('module_categories')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Modulo de carga',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('module_categories')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Modulo de pantalla',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('module_categories')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Piezas electrónicas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
