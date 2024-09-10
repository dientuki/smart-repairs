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
        Schema::create('device_type_checks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('device_type_id')->constrained();
            $table->foreignUlid('team_id')->constrained();

            $table->json('damages');
            $table->json('features');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_type_checks');
    }
};
