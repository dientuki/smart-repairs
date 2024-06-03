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
        $devices = DB::table('devices')->get();
        $orders = DB::table('orders')->get();

        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_id' => $devices[0]->id,
            'team_id' => $team,
            'order_id' => $orders[0]->id,
            'serial' => '123456789',
            'unlock_type' => 'code', //UnlockEnum::CODE,
            'unlock_code' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_id' => $devices[1]->id,
            'team_id' => $team,
            'order_id' => $orders[1]->id,
            'serial' => '123456789',
            'unlock_type' => 'code', //UnlockEnum::CODE,
            'unlock_code' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('device_units')->insert([
            'id' => (string) Str::ulid(),
            'device_id' => $devices[0]->id,
            'team_id' => $team,
            'order_id' => $orders[2]->id,
            'serial' => '123456789',
            'unlock_type' => 'code', //UnlockEnum::CODE,
            'unlock_code' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
