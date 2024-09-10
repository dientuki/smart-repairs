<?php

namespace Database\Seeders;

use App\Enum\DiscountEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SimpleServiceJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = DB::table('teams')->get();


        DB::table('simple_service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Pin de carga tipo-c',
            'price' => 25000,
            'team_id' => $teams[2]->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('simple_service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Modulo pantalla J7',
            'price' => 1500,
            'team_id' => $teams[2]->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('simple_service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Modulo pantalla J5',
            'price' => 5,
            'team_id' => $teams[2]->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
