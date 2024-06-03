<?php

use App\Enum\UnlockEnum;
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
            $table->ulid('id')->primary();

            $table->string('serial');
            $table->enum('unlock_type', UnlockEnum::getAllCasesAsArray()); //Enum
            $table->string('unlock_code')->nullable();

            $table->foreignUlid('team_id')->constrained();
            $table->foreignUlid('device_id')->constrained();
            $table->foreignUlid('order_id')->constrained();

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
