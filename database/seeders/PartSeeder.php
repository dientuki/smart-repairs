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
        // 0 generica 1 moto 2 samb

        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'S2MU005X',
            'observations' => 'IC-POWER SUPERVISOR, compatible con S2MU005X/01/02/03',
            'module_category_id' => $moduleCategory[2]->id,
            'brand_id' => $brands[2]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'U4006',
            'observations' => 'OVP (Over Voltage Protection)',
            'module_category_id' => $moduleCategory[2]->id,
            'brand_id' => $brands[2]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'Boton tac-switch smd tres pines',
            'observations' => 'Boton smd de 3 contactos para encendido y volumen',
            'module_category_id' => $moduleCategory[2]->id,
            'brand_id' => $brands[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('parts')->insert([
            'id' => (string) Str::ulid(),
            'part_number' => 'Sin numero',
            'module_category_id' => $moduleCategory[1]->id,
            'brand_id' => $brands[2]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
