<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_headers', function (Blueprint $table) {
            $table->id();
            $table->string('booking_no', 100)->unique();
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('room_type_id')->constrained('room_types')->onDelete('cascade');
            $table->foreignId('room_unit_id')->nullable()->constrained('room_units')->onDelete('set null');
            $table->string('booking_source', 30)->default('Website')->comment('Website, Walk In, Admin, WhatsApp, Marketplace');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('duration_month')->default(1);
            $table->decimal('monthly_price', 12, 2)->default(0);
            $table->decimal('deposit', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->string('status', 30)->default('Pending')->comment('Pending, Confirmed, Checked In, Completed, Cancelled');
            $table->string('payment_status', 30)->default('Unpaid')->comment('Unpaid, Partially Paid, Paid, Refunded');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('booking_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_header_id')->constrained('booking_headers')->onDelete('cascade');
            $table->string('item_name');
            $table->text('description')->nullable();
            $table->integer('qty')->default(1);
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('provider', 100);
            $table->string('driver', 100)->nullable();
            $table->string('merchant_id')->nullable();
            $table->text('client_key')->nullable();
            $table->text('server_key')->nullable();
            $table->text('api_key')->nullable();
            $table->text('secret_key')->nullable();
            $table->string('environment', 20)->default('sandbox');
            $table->text('callback_url')->nullable();
            $table->string('logo')->nullable();
            $table->text('instruction')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('payment_gateway_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_gateway_id')->constrained('payment_gateways')->onDelete('cascade');
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('type', 50)->nullable();
            $table->decimal('fee', 12, 2)->default(0);
            $table->string('fee_type', 30)->default('fixed');
            $table->decimal('minimum', 12, 2)->default(0);
            $table->decimal('maximum', 12, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('payment_headers', function (Blueprint $table) {
            $table->id();
            $table->string('payment_no', 100)->unique();
            $table->foreignId('booking_header_id')->constrained('booking_headers')->onDelete('cascade');
            $table->foreignId('payment_gateway_id')->nullable()->constrained('payment_gateways')->onDelete('set null');
            $table->foreignId('payment_gateway_channel_id')->nullable()->constrained('payment_gateway_channels')->onDelete('set null');
            $table->string('payment_method', 30)->default('Transfer')->comment('Cash, Transfer, QRIS, Virtual Account, E-Wallet, Credit Card');
            $table->date('invoice_date');
            $table->date('due_date');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('admin_fee', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->string('status', 30)->default('Unpaid')->comment('Unpaid, Pending, Paid, Expired, Failed, Cancelled');
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->string('gateway_reference')->nullable();
            $table->string('gateway_transaction_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('payment_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_header_id')->constrained('payment_headers')->onDelete('cascade');
            $table->string('description');
            $table->decimal('amount', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_lines');
        Schema::dropIfExists('payment_headers');
        Schema::dropIfExists('payment_gateway_channels');
        Schema::dropIfExists('payment_gateways');
        Schema::dropIfExists('booking_lines');
        Schema::dropIfExists('booking_headers');
    }
};
