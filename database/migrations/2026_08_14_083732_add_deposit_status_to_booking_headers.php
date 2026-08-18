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
            $table->string('deposit_status', 30)->nullable()->after('deposit'); // e.g. Held, Refunded
            $table->timestamp('deposit_refunded_at')->nullable()->after('deposit_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_headers', function (Blueprint $table) {
            $table->dropColumn(['deposit_status', 'deposit_refunded_at']);
        });
    }
};
