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
        Schema::create('stock_suppliers', function (Blueprint $table) {
            $table->foreignUlid('stock_id')->constrained();
            $table->foreignUlid('supplier_id')->constrained();
            $table->decimal('price', 12, 2);

            $table->unique(['stock_id', 'supplier_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_suppliers');
    }
};
