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
        Schema::create('device_parts', function (Blueprint $table) {
            $table->foreignUlid('device_id')->constrained();
            $table->foreignUlid('part_id')->constrained();

            $table->unique(['device_id', 'part_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_parts');
    }
};
