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
        $teams = DB::table('teams')->get();

        DB::table('device_type_checks')->insert([
            'id' => (string) Str::ulid(),
            'device_type_id' => $device_type[0]->id,
            'team_id' => $teams[0]->id,
            'damages' => json_encode(['Pantalla rota', 'Camara rayada']),
            'features' => json_encode(['Camara trasera', 'Camara frontal']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('device_type_checks')->insert([
            'id' => (string) Str::ulid(),
            'device_type_id' => $device_type[0]->id,
            'team_id' => $teams[2]->id,
            'damages' => json_encode(['Pantalla rota', 'Camara rayada']),
            'features' => json_encode(['Camara trasera', 'Camara frontal']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
