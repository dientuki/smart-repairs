<?php

namespace Database\Seeders;

use App\Enum\DiscountEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ServiceJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = DB::table('teams')->first()->id;

        DB::table('service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Mano de obra',
            'price' => 25000,
            'discount_type' => DiscountEnum::None, // Usa DiscountEnum para definir el tipo de descuento
            'team_id' => DB::table('teams')->first()->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Descuento gremio',
            'price' => 1500,
            'discount_type' => DiscountEnum::Amount, // Usa DiscountEnum para definir el tipo de descuento
            'team_id' => DB::table('teams')->first()->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_jobs')->insert([
            'id' => (string) Str::ulid(),
            'name' => 'Descuento porcentual',
            'price' => 5,
            'discount_type' => DiscountEnum::Percentage, // Usa DiscountEnum para definir el tipo de descuento
            'team_id' => DB::table('teams')->first()->id, // Asumiendo que ya tienes datos en la tabla 'teams'
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
