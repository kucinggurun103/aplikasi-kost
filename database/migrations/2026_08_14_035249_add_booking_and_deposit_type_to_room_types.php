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
        Schema::table('room_types', function (Blueprint $table) {
            $table->decimal('booking_price', 12, 2)->default(0)->after('monthly_price');
            $table->string('deposit_type', 20)->default('Upfront')->after('deposit_price'); // 'Upfront', 'AtEnd', 'None'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_types', function (Blueprint $table) {
            $table->dropColumn(['booking_price', 'deposit_type']);
        });
    }
};
