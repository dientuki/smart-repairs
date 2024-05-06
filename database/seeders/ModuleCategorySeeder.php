<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuleCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('module_categories')->insert([
            'name' => 'Modulo de carga',
        ]);
        DB::table('module_categories')->insert([
            'name' => 'Modulo de pantalla',
        ]);
    }
}
