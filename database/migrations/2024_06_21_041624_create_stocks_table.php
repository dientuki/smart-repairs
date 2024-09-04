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
        Schema::create('stocks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('part_id')->constrained();
            $table->foreignUlid('team_id')->constrained();
            $table->unsignedMediumInteger('quantity');
            $table->unsignedMediumInteger('warning');
            $table->decimal('price', 15, 2);
            //$table->date('price_updated_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
