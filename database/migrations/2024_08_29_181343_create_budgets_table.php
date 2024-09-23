<?php

use App\Enum\BudgetStatusEnum;
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
        Schema::create('budgets', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('order_id')->constrained();
            $table->foreignUlid('user_id')->constrained();
            $table->decimal('total', 12, 2)->nullable()->default(0);
            $table->decimal('subtotal', 12, 2)->nullable()->default(0);
            $table->decimal('discount', 12, 2)->nullable()->default(0);
            $table->enum('status', BudgetStatusEnum::getAllCasesAsArray())->default(BudgetStatusEnum::default()->value);
            $table->date('valid_until')->nullable();

            $table->foreignUlid('team_id')->constrained();
            $table->timestamps();

            $table->index(['order_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
