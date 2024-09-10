<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeviceTypeCheckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $device_type = DB::table('device_types')->get();
        $team = DB::table('teams')->first()->id;

        DB::table('device_type_checks')->insert([
            'id' => (string) Str::ulid(),
            'device_type_id' => $device_type[0]->id,
            'team_id' => $team,
            'damages' => json_encode(['Pantalla rota', 'Camara rayada']),
            'features' => json_encode(['Camara trasera', 'Camara frontal']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
