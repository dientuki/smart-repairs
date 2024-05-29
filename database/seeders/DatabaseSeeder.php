<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UserSeeder::class,
            TeamSeeder::class,
            TeamUserSeeder::class,
            DeviceTypeSeeder::class,
            BrandSeeder::class,
            ModuleCategorySeeder::class,
            PartSeeder::class,
            DeviceSeeder::class,
            CustomerSeeder::class,
            OrderSeeder::class,
            DeviceUnitSeeder::class,
            OrderCommentSeeder::class,
        ]);
    }
}
