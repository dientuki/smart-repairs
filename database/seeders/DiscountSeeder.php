<?php

namespace Database\Seeders;

use App\Enum\DiscountEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DiscountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = DB::table('teams')->get();

        foreach ($teams as $team) {
            DB::table('discounts')->insert([
                'id' => (string) Str::ulid(),
                'name' => 'Descuento porcentual',
                'price' => 5,
                'type' => DiscountEnum::Percentage,
                'team_id' => $team->id, // Asumiendo que ya tienes datos en la tabla 'teams'
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('discounts')->insert([
                'id' => (string) Str::ulid(),
                'name' => 'Descuento gremio',
                'price' => 5000,
                'type' => DiscountEnum::Amount,
                'team_id' => $team->id, // Asumiendo que ya tienes datos en la tabla 'teams'
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
