<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Storage::deleteDirectory('avatar');

        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Maximiliano Zarate',
            'email' => 'full@gmail.com',
            'password' => Hash::make('1234'),
            'hash_filename' => Storage::putFile('avatar', 'resources/seeders/avatar.jpeg'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Juan Medio 1 Alberto',
            'email' => 'medio1@gmail.com',
            'password' => Hash::make('1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'HP662 Pantone 6C 101',
            'email' => 'moncho@gmail.com',
            'password' => Hash::make('1234'),
            'hash_filename' => Storage::putFile('avatar', 'resources/seeders/moncho.jpg'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Maximiliano Medio 2 Zarate',
            'email' => 'medio2@gmail.com',
            'password' => Hash::make('1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Full 2 Zarate',
            'email' => 'full2@gmail.com',
            'password' => Hash::make('1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
