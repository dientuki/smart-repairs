<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('customers')->insert([
            'id' => (string) Str::ulid(),
            'first_name' => 'Juan Alberto',
            'last_name' => 'Perez',
            'email' => 'juan@perez.com',
            'phone' => '1324',
            'team_id' => DB::table('teams')->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('customers')->insert([
            'id' => (string) Str::ulid(),
            'first_name' => 'Camila Lucrecia',
            'last_name' => 'Silca',
            'email' => 'calusilva@gmail.com',
            'phone' => '1324',
            'team_id' => DB::table('teams')->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
