<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DeviceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jpgFiles = [
            ['resources/seeders/phone.webp', 'Mobile'],
            ['resources/seeders/tablet.jpg', 'Tablet'],
        ];


        foreach ($jpgFiles as $fileData) {
            // Upload file to storage
            $uploadedFile = Storage::putFile('device-types', $fileData[0]);

            DB::table('device_types')->insert([
                'id' => (string) Str::ulid(),
                'name' => $fileData[1],
                'hash_filename' => $uploadedFile,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        /*

        DB::table('device_types')->insert([
            'name' => 'mobile',
            //'express_check' => 'display,camara frontal, camara trasera, lateral superior, lateral inferior, lateral izquierdo, lateral derecho, tapa',
            //'express_check_default' => false,
            //'extra_check' => 'enciende, volumen arriba, volumen abajo, boton power',
            //'extra_check_default' => true
        ]);
        DB::table('device_types')->insert([
            'name' => 'tablet',
            //'express_check' => 'display,camara frontal, camara trasera, lateral superior, lateral inferior, lateral izquierdo, lateral derecho, tapa',
            //'express_check_default' => false,
            //'extra_check' => 'enciende, volumen arriba, volumen abajo, boton power',
            //'extra_check_default' => true
        ]);
        */
    }
}
