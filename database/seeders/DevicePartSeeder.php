<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DevicePartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = DB::table('devices')->get();
        $parts = DB::table('parts')->get();

        DB::table('device_parts')->insert([
            'device_id' => $devices[2]->id,
            'part_id' => $parts[0]->id,
        ]);

        DB::table('device_parts')->insert([
            'device_id' => $devices[2]->id,
            'part_id' => $parts[1]->id,
        ]);

        DB::table('device_parts')->insert([
            'device_id' => $devices[2]->id,
            'part_id' => $parts[2]->id,
        ]);

        DB::table('device_parts')->insert([
            'device_id' => $devices[4]->id,
            'part_id' => $parts[3]->id,
        ]);

        DB::table('device_parts')->insert([
            'device_id' => $devices[5]->id,
            'part_id' => $parts[3]->id,
        ]);
    }
}
