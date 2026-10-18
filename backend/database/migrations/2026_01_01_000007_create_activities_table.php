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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('event_type', 50); // TRACK_PARCEL, CALCULATE_RATE, SUBMIT_QUOTE, BOOK_PARCEL, UPDATE_STATUS, CREATE_PARCEL, ADMIN_LOGIN, etc.
            $table->text('description');
            $table->string('entity_type', 50)->nullable(); // shipment, quote, rate, admin
            $table->string('entity_id', 64)->nullable(); // TRN12345, QTE-...
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
