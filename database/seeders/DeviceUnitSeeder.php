<?php

namespace Database\Seeders;

use App\Enum\UnlockEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = DB::table('teams')->first()->id;
        $devices = DB::table('device_versions')->get();

        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_version_id' => $devices[0]->id,
            'team_id' => $team,
            'serial' => '123456789',
            'unlock_type' => UnlockEnum::None,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_version_id' => $devices[1]->id,
            'team_id' => $team,
            'serial' => '123456789',
            'unlock_type' => UnlockEnum::Code,
            'unlock_code' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_version_id' => $devices[0]->id,
            'team_id' => $team,
            'serial' => '456789123',
            'unlock_type' => UnlockEnum::Pattern,
            'unlock_code' => '0,1,2,6,8',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
