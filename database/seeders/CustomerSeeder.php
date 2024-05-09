<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('customers')->insert([
            'first_name' => 'Juan Alberto',
            'last_name' => 'Perez',
            'email' => 'dientuki@gmail.com',
            'phone' => '1324',
            'team_id' => 1,
        ]);
    }
}
