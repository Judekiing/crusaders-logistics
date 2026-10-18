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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 64)->unique();
            
            // Sender
            $table->string('sender_name');
            $table->string('sender_email')->nullable();
            $table->string('sender_phone')->nullable();
            $table->string('origin_address')->nullable();
            $table->string('origin_city');
            $table->string('origin_state')->nullable();
            $table->string('origin_country')->default('United States');
            $table->string('origin_zip')->nullable();

            // Consignee / Receiver
            $table->string('receiver_name');
            $table->string('receiver_email')->nullable();
            $table->string('receiver_phone')->nullable();
            $table->string('dest_address')->nullable();
            $table->string('dest_city');
            $table->string('dest_state')->nullable();
            $table->string('dest_country')->default('United States');
            $table->string('dest_zip')->nullable();

            // Service & Package Specs
            $table->string('service_type')->default('express_air');
            $table->string('service_name')->default('Logistics Flix Priority Express');
            $table->string('package_type')->default('box');
            $table->text('package_description')->nullable();
            $table->integer('pieces')->default(1);
            $table->decimal('weight_kg', 10, 2)->default(1.0);
            $table->decimal('chargeable_weight_kg', 10, 2)->default(1.0);
            $table->json('dimensions')->nullable();
            $table->decimal('declared_value', 12, 2)->default(0.0);
            $table->string('currency', 10)->default('USD');
            $table->boolean('insurance_required')->default(false);
            $table->boolean('signature_required')->default(false);

            // Operational Status
            $table->string('current_status', 50)->default('ORDER_PLACED');
            $table->string('status_label')->default('Order Manifest Received');
            $table->timestamp('estimated_delivery')->nullable();
            $table->timestamp('booked_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->string('assigned_driver')->nullable();
            $table->string('vehicle_info')->nullable();
            $table->json('route_coordinates')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
