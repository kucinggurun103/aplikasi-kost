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
        Schema::table('web_settings', function (Blueprint $table) {
            $table->string('smtp_username')->nullable();
            $table->string('smtp_password')->nullable();
            $table->string('whatsapp_api_key')->nullable();
            $table->string('whatsapp_api_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('web_settings', function (Blueprint $table) {
            $table->dropColumn(['smtp_username', 'smtp_password', 'whatsapp_api_key', 'whatsapp_api_url']);
        });
    }
};
