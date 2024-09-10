<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('suppliers')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'El celu',
            'email' => 'web@elcelu.com.ar',
            'website' => 'https://www.elcelu.com.ar',
            'phone' => '+5491124589865',
            'address' => 'Larrea 141, CABA',
            'team_id' => DB::table('teams')->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
