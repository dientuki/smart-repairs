<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Maximiliano Zarate',
            'email' => 'laboratronica@gmail.com',
            'password' => Hash::make('1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Juan Alberto',
            'email' => 'dientuki@gmail.com',
            'password' => Hash::make('1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
