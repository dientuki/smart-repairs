<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('device_types')->insert([
            'name' => 'mobile',
            'express_check' => 'display,camara frontal, camara trasera, lateral superior, lateral inferior, lateral izquierdo, lateral derecho, tapa',
            'express_check_default' => false,
            'extra_check' => 'enciende, volumen arriba, volumen abajo, boton power',
            'extra_check_default' => true
        ]);
        DB::table('device_types')->insert([
            'name' => 'tablet',
            'express_check' => 'display,camara frontal, camara trasera, lateral superior, lateral inferior, lateral izquierdo, lateral derecho, tapa',
            'express_check_default' => false,
            'extra_check' => 'enciende, volumen arriba, volumen abajo, boton power',
            'extra_check_default' => true            
        ]);        
    }
}
