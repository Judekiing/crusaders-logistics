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
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('shipment_id', 64)->nullable();
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject');
            $table->string('type', 50)->default('STATUS_UPDATE');
            $table->string('status', 30)->default('SENT');
            $table->text('preview_text')->nullable();
            $table->longText('html_content')->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};
