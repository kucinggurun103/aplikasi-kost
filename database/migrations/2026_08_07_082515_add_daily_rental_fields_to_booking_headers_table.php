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
        Schema::table('booking_headers', function (Blueprint $table) {
            $table->string('rent_type', 30)->default('Monthly')->after('check_out_date');
            $table->integer('duration_days')->default(0)->after('duration_month');
            $table->decimal('custom_price', 12, 2)->nullable()->after('monthly_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_headers', function (Blueprint $table) {
            $table->dropColumn(['rent_type', 'duration_days', 'custom_price']);
        });
    }
};
