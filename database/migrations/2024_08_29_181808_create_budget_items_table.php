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
        Schema::create('budget_items', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('budget_id')->constrained();
            $table->foreignUlid('part_id')->nullable()->constrained();
            $table->foreignUlid('service_job_id')->nullable()->constrained();
            $table->unsignedMediumInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->boolean('include_in_sum')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_items');
    }
};
