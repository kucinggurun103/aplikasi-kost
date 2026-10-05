<?php

use App\Models\BookingHeader;
use App\Models\Branch;
use App\Models\PaymentHeader;
use App\Models\RoomCategory;
use App\Models\RoomType;
use App\Models\User;
use App\Models\UserProfile;

beforeEach(function () {
    $this->tenant = User::factory()->create();
    UserProfile::create([
        'user_id' => $this->tenant->id,
        'identity_number' => 'ID-'.$this->tenant->id,
        'phone_number' => '081234567890',
    ]);
    $branch = Branch::create(['code' => 'INVOICE-BR', 'name' => 'Invoice Test']);
    $category = RoomCategory::create(['name' => 'Invoice Category']);
    $roomType = RoomType::create([
        'branch_id' => $branch->id,
        'room_category_id' => $category->id,
        'type_code' => 'INVOICE-ROOM',
        'type_name' => 'Invoice Room',
        'slug' => 'invoice-room',
    ]);
    $this->booking = BookingHeader::create([
        'booking_no' => 'BKG-INVOICE-'.$this->tenant->id,
        'tenant_id' => $this->tenant->id,
        'branch_id' => $branch->id,
        'room_type_id' => $roomType->id,
        'check_in_date' => today()->subMonth(),
        'check_out_date' => today(),
        'status' => 'Completed',
    ]);
});

function createPaidInvoiceForTenant(BookingHeader $booking, string $status = 'Paid'): PaymentHeader
{
    return PaymentHeader::create([
        'payment_no' => 'PAY-INVOICE-'.$booking->tenant_id,
        'booking_header_id' => $booking->id,
        'invoice_date' => today(),
        'due_date' => today(),
        'subtotal' => 100000,
        'admin_fee' => 5000,
        'grand_total' => 105000,
        'status' => $status,
        'paid_at' => $status === 'Paid' ? now() : null,
    ]);
}

it('downloads a generated invoice attachment for its owner without a stored file', function () {
    $invoice = createPaidInvoiceForTenant($this->booking);

    $this->actingAs($this->tenant)
        ->get(route('invoices.download', $invoice))
        ->assertOk()
        ->assertDownload("invoice-{$invoice->id}.html")
        ->assertHeader('Content-Type', 'text/html; charset=UTF-8');
});

it('does not expose another tenants invoice', function () {
    $invoice = createPaidInvoiceForTenant($this->booking);
    $otherTenant = User::factory()->create();
    UserProfile::create([
        'user_id' => $otherTenant->id,
        'identity_number' => 'ID-'.$otherTenant->id,
        'phone_number' => '081234567890',
    ]);

    $this->actingAs($otherTenant)
        ->get(route('invoices.download', $invoice))
        ->assertNotFound();
});

it('does not download an invoice that is not paid', function () {
    $invoice = createPaidInvoiceForTenant($this->booking, 'Unpaid');

    $this->actingAs($this->tenant)
        ->get(route('invoices.download', $invoice))
        ->assertNotFound();
});

it('returns not found for an invalid invoice id', function () {
    $this->actingAs($this->tenant)
        ->get('/invoices/999999/download')
        ->assertNotFound();
});

it('requires authentication to download an invoice', function () {
    $invoice = createPaidInvoiceForTenant($this->booking);

    $this->get(route('invoices.download', $invoice))
        ->assertRedirect(route('login'));
});

it('downloads only the authenticated tenants payment history', function () {
    $invoice = createPaidInvoiceForTenant($this->booking);
    $response = $this->actingAs($this->tenant)->get(route('payment-history.download'));

    $response->assertOk()
        ->assertDownload('riwayat-pembayaran-'.now()->format('Ymd').'.csv')
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

    expect($response->streamedContent())->toContain($invoice->payment_no);

    $otherTenant = User::factory()->create();
    UserProfile::create([
        'user_id' => $otherTenant->id,
        'identity_number' => 'ID-'.$otherTenant->id,
        'phone_number' => '081234567890',
    ]);
    $otherResponse = $this->actingAs($otherTenant)->get(route('payment-history.download'));

    expect($otherResponse->streamedContent())->not->toContain($invoice->payment_no);
});
