<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SupplierContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('supplier_contacts')->insert([
            'id' => (string) Str::ulid(),
            'firstname' => 'Cristian',
            'lastname' => 'Díaz',
            'email' => 'cdiaz@elcelu.com.ar',
            'phone' => '+5491124589865',
            'team_id' => DB::table('teams')->first()->id,
            'supplier_id' => DB::table('suppliers')->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
