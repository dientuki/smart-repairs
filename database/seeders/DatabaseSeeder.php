<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\Discount;
use App\Models\OrderCheck;
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
            AdminSeeder::class,
            PackageSeeder::class,
            TeamSeeder::class,
            ResourceSeeder::class,
            PackageResourceSeeder::class,
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
            OrderCheckSeeder::class,
            SupplierSeeder::class,
            SupplierContactSeeder::class,
            StockSeeder::class,
            ServiceJobSeeder::class,
            DiscountSeeder::class,
            SubscriptionSeeder::class,
        ]);
    }
}
