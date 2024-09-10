<?php

use App\Enum\DiscountEnum;
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
        Schema::create('service_jobs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->enum('discount_type', DiscountEnum::getAllCasesAsArray())->default(DiscountEnum::default()->value);

            $table->foreignUlid('team_id')->constrained();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_jobs');
    }
};
