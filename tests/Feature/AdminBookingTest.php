<?php

use App\Models\User;
use App\Models\Branch;
use App\Models\RoomType;
use App\Models\BookingHeader;
use App\Models\PaymentHeader;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->tenant = User::factory()->create(['role' => 'tenant']);
    $this->branch = Branch::factory()->create();
    $this->roomType = RoomType::factory()->create([
        'branch_id' => $this->branch->id,
        'booking_price' => 250000,
        'monthly_price' => 1500000,
        'deposit_amount' => 500000,
    ]);
});

it('can create a manual booking without payment proof', function () {
    $response = $this->actingAs($this->admin)->post('/admin/transactions/bookings/manual', [
        'tenant_id' => $this->tenant->id,
        'room_type_id' => $this->roomType->id,
        'rent_type' => 'Monthly',
        'duration_month' => 3,
        'check_in_date' => now()->format('Y-m-d'),
    ]);

    $response->assertSuccessful();

    $booking = BookingHeader::where('tenant_id', $this->tenant->id)->first();
    expect($booking)->not->toBeNull();
    expect($booking->status)->toBe('Pending');
    expect($booking->payment_status)->toBe('Pending');

    // Should generate one invoice for the DP
    $invoices = PaymentHeader::where('booking_header_id', $booking->id)->get();
    expect($invoices)->toHaveCount(1);
    expect($invoices->first()->status)->toBe('Pending');
});

it('can create a manual booking with payment proof directly', function () {
    Storage::fake('public');
    $file = UploadedFile::fake()->image('proof.jpg');

    $response = $this->actingAs($this->admin)->post('/admin/transactions/bookings/manual', [
        'tenant_id' => $this->tenant->id,
        'room_type_id' => $this->roomType->id,
        'rent_type' => 'Monthly',
        'duration_month' => 3,
        'check_in_date' => now()->format('Y-m-d'),
        'payment_proof' => $file,
    ]);

    $response->assertSuccessful();

    $booking = BookingHeader::where('tenant_id', $this->tenant->id)->first();
    
    // Booking status should change immediately due to DP paid
    expect($booking->status)->toBe('Confirmed');
    expect($booking->payment_status)->toBe('Partially Paid');

    // Should generate invoices for all 3 months + DP
    $invoices = PaymentHeader::where('booking_header_id', $booking->id)->get();
    expect($invoices)->toHaveCount(4); 
    
    $firstInvoice = $invoices->first();
    expect($firstInvoice->status)->toBe('Paid');
    expect($firstInvoice->proof_of_payment)->not->toBeNull();
    
    Storage::disk('public')->assertExists($firstInvoice->proof_of_payment);
});

it('can manually pay an existing invoice', function () {
    Storage::fake('public');

    // First create a booking
    $booking = BookingHeader::factory()->create([
        'tenant_id' => $this->tenant->id,
        'room_type_id' => $this->roomType->id,
        'branch_id' => $this->branch->id,
        'status' => 'Pending',
        'payment_status' => 'Pending',
    ]);
    
    // Create an invoice
    $invoice = PaymentHeader::factory()->create([
        'booking_header_id' => $booking->id,
        'status' => 'Unpaid',
        'subtotal' => 1500000,
        'grand_total' => 1500000,
    ]);

    $file = UploadedFile::fake()->image('manual_proof.jpg');

    $response = $this->actingAs($this->admin)->post("/admin/transactions/bookings/{$booking->id}/manual-pay", [
        'payment_id' => $invoice->id,
        'payment_proof' => $file,
    ]);

    $response->assertSuccessful();

    $invoice->refresh();
    expect($invoice->status)->toBe('Paid');
    expect($invoice->proof_of_payment)->not->toBeNull();
    Storage::disk('public')->assertExists($invoice->proof_of_payment);
    
    $booking->refresh();
    expect($booking->status)->toBe('Checked In');
});
