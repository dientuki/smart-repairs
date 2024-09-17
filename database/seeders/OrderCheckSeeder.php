<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderCheckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order = DB::table('orders')->get();
        $device_type_check = DB::table('device_type_checks')->get();
        $newDamages = [];
        $newFeaturess = [];

        $damages = json_decode($device_type_check[0]->damages, true);
        foreach ($damages as $index => $damage) {
            $newDamages[] = [
                'value' => $damage,
                'checked' => $index % 2 == 0 // Alternar entre true y false
            ];
        }

        $features = json_decode($device_type_check[0]->features, true);
        foreach ($features as $index => $feature) {
            $newFeaturess[] = [
                'value' => $feature,
                'checked' => $index % 2 == 1 // Alternar entre true y false
            ];
        }

        DB::table('order_checks')->insert([
            'id' => (string) Str::ulid(),
            'order_id' => $order[0]->id,
            'damages' => json_encode($newDamages),
            'damages_description' => 'Adicional al daño',
            'features' => json_encode($newFeaturess),
            'features_description' => 'Adicional al feature',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
