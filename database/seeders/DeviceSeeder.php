<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('devices')->insert([
            'commercial_name' => 'Motorola One Hyper',
            'tech_name' => 'motorola-one-hyper',
            'brand_id' => 2,
            'device_type_id' => 1,
            'url'=> 'https://www.gsmarena.com/motorola_one_hyper-9944.php'
        ]);        
    }
}
