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
        Schema::create('quotes', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone')->nullable();
            $table->string('company_name')->nullable();

            $table->string('origin_city');
            $table->string('origin_country')->default('United States');
            $table->string('dest_city');
            $table->string('dest_country')->default('United States');

            $table->string('cargo_type')->nullable();
            $table->decimal('weight_kg', 10, 2)->default(10.0);
            $table->integer('pieces')->default(1);
            $table->json('dimensions')->nullable();
            
            $table->string('selected_service')->default('standard_ground');
            $table->decimal('estimated_rate', 12, 2)->default(0.0);
            $table->string('transit_days')->nullable();
            $table->text('special_instructions')->nullable();
            $table->string('status', 30)->default('PENDING');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
