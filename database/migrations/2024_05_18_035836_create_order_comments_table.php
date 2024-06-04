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
        Schema::create('order_comments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->text('comment');

            $table->foreignUlid('order_id')->constrained();
            $table->foreignUlid('team_id')->constrained();
            $table->foreignUlid('user_id')->constrained();

            $table->boolean('is_public')->default(false);
            $table->boolean('was_edited')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_comments');
    }
};
