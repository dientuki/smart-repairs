<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('brands')->insert([
            'name' => 'Generica',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $jpgFiles = [
            ['resources/seeders/motorola.svg', 'Motorola'],
            ['resources/seeders/samsung.svg', 'Samsung'],
        ];

        foreach ($jpgFiles as $fileData) {
            // Upload file to storage
            $uploadedFile = Storage::putFile('logos', $fileData[0]);

            // Save uploaded file path and description to database
            $brand = DB::table('brands')->where('name', $fileData[1])->first();

            if (!$brand) {
                DB::table('brands')->insert([
                    'name' => $fileData[1],
                    'hash_filename' => $uploadedFile,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
