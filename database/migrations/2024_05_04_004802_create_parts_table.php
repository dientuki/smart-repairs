<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parts', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('screen_printing')->nullable();
            $table->string('part_number')->nullable();
            $table->string('observations')->nullable();
            $table->string('hash_filename')->nullable();

            $table->foreignUlid('brand_id')->constrained();
            $table->foreignUlid('module_category_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};
