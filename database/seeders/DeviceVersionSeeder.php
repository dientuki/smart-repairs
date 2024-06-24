<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceVersionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $device = DB::table('devices')->get();

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'v1',
            'device_id' => $device[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'v2',
            'device_id' => $device[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'only me',
            'device_id' => $device[1]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
