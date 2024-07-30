<?php

namespace Database\Seeders;

use App\Models\Device;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TeamSeeder::class,
            TeamUserSeeder::class,
            DeviceTypeSeeder::class,
            BrandSeeder::class,
            ModuleCategorySeeder::class,
            PartSeeder::class,
            DeviceSeeder::class,
            DeviceVersionSeeder::class,
            DeviceVersionPartSeeder::class,
            DeviceTypeCheckSeeder::class,
            DeviceUnitSeeder::class,
            CustomerSeeder::class,
            OrderSeeder::class,
            OrderCommentSeeder::class,
            SupplierSeeder::class,
            SupplierContactSeeder::class,
            StockSeeder::class
        ]);
    }
}
