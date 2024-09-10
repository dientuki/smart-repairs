<?php

use App\Enum\OrderStatusEnum;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->enum('status', OrderStatusEnum::getAllCasesAsArray())->default(OrderStatusEnum::default()->value);
            $table->text('observation')->nullable();
            $table->text('diagnosis')->nullable();
            $table->boolean('was_edited')->default(false);

            $table->foreignUlid('customer_id')->constrained();
            $table->foreignUlid('team_id')->constrained();
            $table->foreignUlid('user_id')->constrained();
            $table->foreignUlid('device_id')->constrained();
            $table->foreignUlid('device_unit_id')->nullable()->constrained();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
