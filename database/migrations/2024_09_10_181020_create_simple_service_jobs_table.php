<?php

use App\Enum\SimpleDiscountEnum;
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
        Schema::create('simple_service_jobs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->enum('discount_type', SimpleDiscountEnum::getAllCasesAsArray())->default(SimpleDiscountEnum::default()->value);
            $table->foreignUlid('team_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simple_service_jobs');
    }
};
