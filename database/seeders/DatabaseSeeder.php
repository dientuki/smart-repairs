<?php

namespace Database\Seeders;

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
            /*
            DeviceSeeder::class,
            DevicePartSeeder::class,
            CustomerSeeder::class,
            DeviceUnitSeeder::class,
            OrderSeeder::class,
            OrderCommentSeeder::class,
            SupplierSeeder::class,
            SupplierContactSeeder::class,
            StockSeeder::class
            */
        ]);
    }
}
