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
        Schema::create('temporary_device_units', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('serial')->nullable();
            $table->enum('unlock_type', UnlockEnum::getAllCasesAsArray()); //Enum
            $table->string('unlock_code')->nullable();

            $table->foreignUlid('device_id')->constrained();
            $table->foreignUlid('device_version_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUlid('device_unit_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUlid('order_id')->nullable()->constrained()->onDelete('set null');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temporary_device_units');
    }
};
