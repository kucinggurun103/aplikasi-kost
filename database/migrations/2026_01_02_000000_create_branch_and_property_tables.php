<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('google_maps_url')->nullable();
            $table->string('latitude', 30)->nullable();
            $table->string('longitude', 30)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('branch_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'branch_id']);
        });

        Schema::create('room_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('room_category_id')->constrained('room_categories')->onDelete('cascade');
            $table->string('type_code', 30)->unique();
            $table->string('type_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('room_size', 8, 2)->nullable();
            $table->decimal('monthly_price', 12, 2)->default(0);
            $table->decimal('deposit_price', 12, 2)->default(0);
            $table->boolean('electricity_included')->default(false);
            $table->boolean('water_included')->default(false);
            $table->string('cover_image')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('room_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->string('unit_code', 30)->unique();
            $table->string('unit_number', 30);
            $table->string('building_name', 100)->nullable();
            $table->string('floor', 20)->nullable();
            $table->string('status', 30)->default('Available')->comment('Available, Occupied, Reserved, Maintenance, Inactive');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['room_type_id', 'unit_number']);
        });

        Schema::create('room_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->string('image');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('room_type_facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->foreignId('facility_id')->constrained('facilities')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['room_type_id', 'facility_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_type_facilities');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('room_images');
        Schema::dropIfExists('room_units');
        Schema::dropIfExists('room_types');
        Schema::dropIfExists('room_categories');
        Schema::dropIfExists('branch_users');
        Schema::dropIfExists('branches');
    }
};
