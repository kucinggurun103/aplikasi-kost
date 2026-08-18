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
            $table->decimal('admin_fee', 12, 2)->default(25000)->after('whatsapp_api_url');
        });

        Schema::create('discount_rules', function (Blueprint $table) {
            $table->id();
            $table->integer('minimum_months');
            $table->decimal('discount_percentage', 5, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_rules');
        Schema::table('web_settings', function (Blueprint $table) {
            $table->dropColumn(['admin_fee']);
        });
    }
};
