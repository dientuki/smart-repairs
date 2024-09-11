<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Storage::deleteDirectory('logos');

        DB::table('brands')->insert([
            'id' => (string) Str::ulid(),
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

            DB::table('brands')->insert([
                'id' => (string) Str::ulid(),
                'name' => $fileData[1],
                'hash_filename' => $uploadedFile,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
