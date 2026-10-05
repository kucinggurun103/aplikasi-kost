<?php

use App\Models\BookingHeader;
use App\Models\Branch;
use App\Models\PaymentHeader;
use App\Models\Role;
use App\Models\RoomCategory;
use App\Models\RoomType;
use App\Models\RoomUnit;
use App\Models\TenantContract;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->branch = Branch::create(['code' => 'EXT-BRANCH', 'name' => 'Extension Branch']);
    $category = RoomCategory::create(['name' => 'Extension Category']);
    $roomType = RoomType::create([
        'branch_id' => $this->branch->id,
        'room_category_id' => $category->id,
        'type_code' => 'EXT-ROOM',
        'type_name' => 'Extension Room',
        'slug' => 'extension-room',
        'monthly_price' => 100000,
    ]);
    $roomUnit = RoomUnit::create([
        'room_type_id' => $roomType->id,
        'unit_code' => 'EXT-UNIT',
        'unit_number' => '101',
    ]);

    $this->booking = BookingHeader::create([
        'booking_no' => 'BKG-EXT-1',
        'tenant_id' => User::factory()->create()->id,
        'branch_id' => $this->branch->id,
        'room_type_id' => $roomType->id,
        'room_unit_id' => $roomUnit->id,
        'check_in_date' => today()->subMonth(),
        'check_out_date' => today()->addDays(10),
        'monthly_price' => 100000,
        'status' => 'Checked In',
    ]);

    $this->contract = TenantContract::create([
        'contract_number' => 'CTR-EXT-1',
        'booking_header_id' => $this->booking->id,
        'user_id' => $this->booking->tenant_id,
        'branch_id' => $this->branch->id,
        'room_type_id' => $roomType->id,
        'room_unit_id' => $roomUnit->id,
        'start_date' => today()->subMonth(),
        'end_date' => today()->addDays(10),
        'monthly_price' => 100000,
        'status' => 'Active',
    ]);

    $this->operator = User::factory()->create();
    $operatorRole = Role::create(['name' => 'Operator', 'code' => 'operator']);
    $this->operator->roles()->attach($operatorRole);
    $this->operator->branches()->attach($this->branch);
});

it('allows an assigned operator to extend an active contract atomically', function () {
    $oldEndDate = (string) $this->contract->end_date;

    $this->actingAs($this->operator)
        ->from(route('dashboard'))
        ->post("/admin/transactions/bookings/{$this->booking->id}/extend", [
            'rent_type' => 'Monthly',
            'duration_month' => 1,
            'duration_days' => null,
            'custom_price' => null,
        ])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasNoErrors();

    expect($this->booking->refresh()->duration_month)->toBe(2)
        ->and((string) $this->contract->refresh()->end_date)->not->toBe($oldEndDate)
        ->and(PaymentHeader::where('booking_header_id', $this->booking->id)->count())->toBe(1);
});

it('does not allow an operator to extend a contract outside assigned branches', function () {
    $otherBranch = Branch::create(['code' => 'OTHER-EXT', 'name' => 'Other Branch']);
    $otherOperator = User::factory()->create();
    $operatorRole = Role::query()->where('code', 'operator')->firstOrFail();
    $otherOperator->roles()->attach($operatorRole);
    $otherOperator->branches()->attach($otherBranch);

    $this->actingAs($otherOperator)
        ->post("/admin/transactions/bookings/{$this->booking->id}/extend", [
            'rent_type' => 'Monthly',
            'duration_month' => 1,
        ])
        ->assertForbidden();

    expect(PaymentHeader::where('booking_header_id', $this->booking->id)->count())->toBe(0);
});

it('limits direct contract routes to authorized roles and branches', function () {
    $this->withoutVite();
    $otherUser = User::factory()->create();
    UserProfile::create([
        'user_id' => $otherUser->id,
        'identity_number' => 'ID-'.$otherUser->id,
        'phone_number' => '081234567890',
    ]);
    $otherBranch = Branch::create(['code' => 'CONTRACT-OTHER', 'name' => 'Contract Other']);
    $otherOperator = User::factory()->create();
    $operatorRole = Role::query()->where('code', 'operator')->firstOrFail();
    $otherOperator->roles()->attach($operatorRole);
    $otherOperator->branches()->attach($otherBranch);

    $this->actingAs($this->operator)
        ->get('/admin/transactions/contracts')
        ->assertOk();

    $this->actingAs($otherUser)
        ->get('/admin/transactions/contracts')
        ->assertForbidden();

    $this->actingAs($otherOperator)
        ->post("/admin/transactions/contracts/{$this->contract->id}/terminate", ['notes' => 'Unauthorized'])
        ->assertForbidden();
});

it('rolls back contract and booking changes when invoice creation fails', function () {
    $oldEndDate = (string) $this->contract->end_date;
    $oldBookingDate = (string) $this->booking->check_out_date;
    Event::listen('eloquent.creating: '.PaymentHeader::class, function (): void {
        throw new RuntimeException('Invoice could not be created.');
    });

    $this->actingAs($this->operator)
        ->post("/admin/transactions/bookings/{$this->booking->id}/extend", [
            'rent_type' => 'Monthly',
            'duration_month' => 1,
        ])
        ->assertInternalServerError();

    expect((string) $this->booking->refresh()->check_out_date)->toBe($oldBookingDate)
        ->and((string) $this->contract->refresh()->end_date)->toBe($oldEndDate)
        ->and(PaymentHeader::where('booking_header_id', $this->booking->id)->count())->toBe(0);
});