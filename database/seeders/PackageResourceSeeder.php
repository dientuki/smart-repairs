<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PackageResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = DB::table('resources')->get();
        $packages = DB::table('packages')->get();
        $medium = [1,2,3];

        DB::table('package_resources')->insert([
            'package_id' => $packages[2]->id,
            'resource_id' => $resources[0]->id,
            'name' => $packages[2]->name . ' ' . $resources[0]->resource
        ]);

        foreach ($resources as $index => $resource) {
            if ($index === 0) {
                continue;
            }
            DB::table('package_resources')->insert([
                'package_id' => $packages[0]->id,
                'resource_id' => $resource->id,
                'name' => $packages[0]->name . ' ' . $resource->resource
            ]);
        }

        foreach ($medium as $mediumItem) {
            DB::table('package_resources')->insert([
                'package_id' => $packages[1]->id,
                'resource_id' => $resources[$mediumItem]->id,
                'name' => $packages[1]->name . ' ' . $resources[$mediumItem]->resource
            ]);
        }
    }
}
