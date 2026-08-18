<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_headers', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number', 100)->unique();
            $table->dateTime('transaction_date');
            $table->foreignId('booking_header_id')->nullable()->constrained('booking_headers')->onDelete('set null');
            $table->foreignId('payment_header_id')->nullable()->constrained('payment_headers')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->foreignId('room_type_id')->nullable()->constrained('room_types')->onDelete('set null');
            $table->foreignId('room_unit_id')->nullable()->constrained('room_units')->onDelete('set null');
            $table->foreignId('payment_gateway_id')->nullable()->constrained('payment_gateways')->onDelete('set null');
            $table->foreignId('payment_channel_id')->nullable()->constrained('payment_gateway_channels')->onDelete('set null');
            $table->string('invoice_number', 100)->nullable();
            $table->string('transaction_type', 50);
            $table->string('payment_method', 30);
            $table->string('payment_status', 30);
            $table->decimal('subtotal_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('admin_fee', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('gateway_reference')->nullable();
            $table->string('gateway_transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_header_id')->constrained('transaction_headers')->onDelete('cascade');
            $table->string('item_name');
            $table->text('description')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('subtotal_amount', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('tenant_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number', 100)->unique();
            $table->foreignId('booking_header_id')->constrained('booking_headers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->foreignId('room_unit_id')->constrained('room_units')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_price', 12, 2)->default(0);
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->string('status', 30)->default('Active')->comment('Draft, Active, Expired, Terminated');
            $table->string('document')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('reviewer_name');
            $table->decimal('rating', 3, 2)->default(0);
            $table->text('review_text');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'room_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('tenant_contracts');
        Schema::dropIfExists('transaction_details');
        Schema::dropIfExists('transaction_headers');
    }
};
