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
        Schema::create('device_units', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('device_id');
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('order_id');

            $table->string('serial');
            $table->string('unlock_type'); //Enum
            $table->string('unlock_code')->nullable();

            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('device_id')->references('id')->on('devices');
            $table->foreign('order_id')->references('id')->on('orders');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_units');
    }
};
