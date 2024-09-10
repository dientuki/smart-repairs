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
        Schema::create('package_resource', function (Blueprint $table) {
            $table->foreignUlid('resource_id')->constrained();
            $table->foreignUlid('package_id')->constrained();
            $table->string('name');

            $table->unique(['resource_id', 'package_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_resource');
    }
};
