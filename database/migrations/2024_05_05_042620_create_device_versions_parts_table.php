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
        Schema::create('device_versions_part', function (Blueprint $table) {
            $table->foreignUlid('device_version_id')->constrained();
            $table->foreignUlid('part_id')->constrained();

            $table->unique(['device_version_id', 'part_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_versions_part');
    }
};
