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
        Schema::create('drivers', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('vehicle_type')->default('Box Truck');
            $table->string('plate_number')->nullable();
            $table->string('status')->default('AVAILABLE');
            $table->string('current_city')->default('New Jersey');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
