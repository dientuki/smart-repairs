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
            'resource' => 'simpleprice',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'stock',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'provider',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'customer',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'salepoint',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'supplier',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'deviceunit',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('resources')->insert([
            'id' => (string) Str::ulid(),
            'resource' => 'servicejob',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
