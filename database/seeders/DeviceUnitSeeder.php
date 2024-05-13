<?php

namespace Database\Seeders;

use App\Enum\UnlockEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('device_units')->insert([
            'device_id' => 1,
            'team_id' => 1,
            'order_id' => 1,
            'serial' => '123456789',
            'unlock_type' => 'code', //UnlockEnum::CODE,
            'unlock_code' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
