<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'simpleservicejob',
            'description' => 'Simple price',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'stock',
            'description' => 'Stock',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'provider',
            'description' => 'Provider',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'salepoint',
            'description' => 'Sale point',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'user',
            'description' => 'User',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'supplier',
            'description' => 'Supplier',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'deviceunit',
            'description' => 'Device unit',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'servicejob',
            'description' => 'Service job',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
