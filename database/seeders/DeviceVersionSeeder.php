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
            'version' => 'SM-F700F/DS',
            'description' => 'International',
            'device_id' => $device[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'SM-F700U/DS',
            'description' => 'USA',
            'device_id' => $device[0]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'XT2027-1',
            'device_id' => $device[1]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_versions')->insert([
            'id' => (string) Str::ulid(),
            'version' => 'XT2027-1/SS',
            'device_id' => $device[1]->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
