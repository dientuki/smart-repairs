<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = DB::table('brands')->get();
        $deviceType = DB::table('device_types')->first()->id;

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'Galaxy Z Flip',
            'brand_id' => $brands[2]->id,
            'device_type_id' => $deviceType,
            'url' => 'www.gsmarena.com/samsung_galaxy_z_flip-10054.php',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'One Hyper',
            'brand_id' => $brands[1]->id,
            'device_type_id' => $deviceType,
            'url' => 'www.gsmarena.com/motorola_one_hyper-9944.php',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'J2 Prime',
            'brand_id' => $brands[2]->id,
            'device_type_id' => $deviceType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'A20',
            'brand_id' => $brands[2]->id,
            'device_type_id' => $deviceType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'S02S',
            'brand_id' => $brands[2]->id,
            'device_type_id' => $deviceType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('devices')->insert([
            'id' => (string) Str::ulid(),
            'commercial_name' => 'A03',
            'brand_id' => $brands[2]->id,
            'device_type_id' => $deviceType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
