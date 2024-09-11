<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Storage::deleteDirectory('teams');

        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Laboratronica Argentina',
            'website' => 'https://www.laboratronicaargentina.com',
            'email' => 'laboratronicaargentina@gmail.com',
            'address' => 'Córdoba 108 dto 3, Campana, Buenos Aires, Argentina',
            'phones' => json_encode(['3489-5261992']),
            'hash_filename' => Storage::putFile('teams', 'resources/seeders/labo.png'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Dientuki\'s Corp',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('teams')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Moncho',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
