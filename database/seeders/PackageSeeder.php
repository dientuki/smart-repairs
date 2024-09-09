<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('packages')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Full',
            'price' => 40000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('packages')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Medio',
            'price' => 20000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('packages')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Basico',
            'price' => 10000,
            'default' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
