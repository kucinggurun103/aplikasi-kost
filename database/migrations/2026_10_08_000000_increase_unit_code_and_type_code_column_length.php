<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('room_types', function (Blueprint $table) {
            $table->string('type_code', 100)->change();
        });

        Schema::table('room_units', function (Blueprint $table) {
            $table->string('unit_code', 100)->change();
            $table->string('unit_number', 100)->change();
        });
    }

    public function down(): void
    {
        Schema::table('room_units', function (Blueprint $table) {
            $table->string('unit_code', 30)->change();
            $table->string('unit_number', 30)->change();
        });

        Schema::table('room_types', function (Blueprint $table) {
            $table->string('type_code', 30)->change();
        });
    }
};

