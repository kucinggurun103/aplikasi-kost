<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_events', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_event_id')->constrained('notification_events')->onDelete('cascade');
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->integer('trigger_days')->default(0);
            $table->time('send_time')->nullable();
            $table->boolean('email_enabled')->default(false);
            $table->boolean('whatsapp_enabled')->default(false);
            $table->string('email_subject')->nullable();
            $table->text('email_content')->nullable();
            $table->string('whatsapp_subject')->nullable();
            $table->text('whatsapp_content')->nullable();
            $table->boolean('allow_manual_send')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('notification_queues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_template_id')->nullable()->constrained('notification_templates')->onDelete('set null');
            $table->foreignId('payment_header_id')->nullable()->constrained('payment_headers')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('channel', 20)->comment('Email, WhatsApp, Push');
            $table->string('recipient');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->json('payload')->nullable();
            $table->string('status', 20)->default('Pending')->comment('Pending, Processing, Sent, Failed');
            $table->integer('attempts')->default(0);
            $table->text('error_message')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_template_id')->nullable()->constrained('notification_templates')->onDelete('set null');
            $table->foreignId('payment_header_id')->nullable()->constrained('payment_headers')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('channel', 20);
            $table->string('recipient');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status', 30)->default('sent');
            $table->dateTime('sent_at')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->string('module', 100);
            $table->string('action', 100);
            $table->string('table_name', 100)->nullable();
            $table->bigInteger('record_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('dashboard_summaries', function (Blueprint $table) {
            $table->id();
            $table->date('summary_date');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->integer('occupied_room')->default(0);
            $table->integer('available_room')->default(0);
            $table->integer('total_booking')->default(0);
            $table->integer('total_transaction')->default(0);
            $table->decimal('total_income', 14, 2)->default(0);
            $table->timestamps();

            $table->unique(['summary_date', 'branch_id']);
        });

        Schema::create('web_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name');
            $table->string('site_tagline')->nullable();
            $table->text('site_description')->nullable();
            $table->text('site_keywords')->nullable();
            $table->string('site_logo')->nullable();
            $table->string('navbar_logo')->nullable();
            $table->string('footer_logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('primary_color', 20)->nullable();
            $table->string('secondary_color', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->text('address')->nullable();
            $table->boolean('maintenance_mode')->default(false);
            $table->timestamps();
        });

        Schema::create('social_media', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 100);
            $table->string('icon')->nullable();
            $table->text('url');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('social_media');
        Schema::dropIfExists('web_settings');
        Schema::dropIfExists('dashboard_summaries');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('notification_queues');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('notification_events');
    }
};
