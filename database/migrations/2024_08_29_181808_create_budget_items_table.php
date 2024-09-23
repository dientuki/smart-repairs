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
            $table->morphs('itemable');
            $table->unsignedMediumInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('item_total', 12, 2)->nullable()->default(0);
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
