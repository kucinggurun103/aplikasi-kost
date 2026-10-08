<?php

use App\Models\Branch;
use App\Models\Role;
use App\Models\RoomCategory;
use App\Models\RoomType;
use App\Models\RoomUnit;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['code' => 'admin'], ['name' => 'Admin']);
    $this->admin = User::factory()->create();
    $this->admin->roles()->attach($this->adminRole->id);

    $this->branch = Branch::create([
        'code' => 'HYBRID HA 18',
        'name' => 'Hybrid HA 18 Branch',
        'address' => 'Jl. Test No 18',
        'phone' => '08123456789',
        'is_active' => true,
    ]);

    $this->category = RoomCategory::create([
        'name' => 'Economy',
        'description' => 'Economy room category',
    ]);
});

test('it can create room type with long type code and generates room units safely', function () {
    $longTypeCode = 'HYBRID HA 18-ECO-081026172018';

    $response = $this->actingAs($this->admin)->post('/admin/master/room-types', [
        'branch_id' => $this->branch->id,
        'room_category_id' => $this->category->id,
        'type_code' => $longTypeCode,
        'type_name' => 'VIP Room HA19',
        'gender_type' => 'Campur',
        'monthly_price' => 1500000,
        'booking_price' => 500000,
        'deposit_price' => 500000,
        'deposit_type' => 'Upfront',
        'amount_of_rooms' => 3,
        'start_number' => 1,
        'unit_prefix' => 'VIP HA19',
        'unit_format' => 'alphabet',
        'floor' => '2',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $roomType = RoomType::where('type_code', $longTypeCode)->first();
    expect($roomType)->not->toBeNull();

    $units = RoomUnit::where('room_type_id', $roomType->id)->get();
    expect($units)->toHaveCount(3);

    foreach ($units as $unit) {
        expect(strlen($unit->unit_code))->toBeLessThanOrEqual(30);
        expect($unit->floor)->toBe('Lantai 2');
    }
});

test('it can add room units to an existing room type with long type code', function () {
    $longTypeCode = 'HYBRID HA 18-ECO-081026172018';

    $roomType = RoomType::create([
        'branch_id' => $this->branch->id,
        'room_category_id' => $this->category->id,
        'type_code' => $longTypeCode,
        'type_name' => 'VIP Room HA19',
        'slug' => 'vip-room-ha19-test',
        'gender_type' => 'Campur',
        'monthly_price' => 1500000,
        'booking_price' => 500000,
        'deposit_price' => 500000,
        'deposit_type' => 'Upfront',
    ]);

    $response = $this->actingAs($this->admin)->post("/admin/master/room-units/{$roomType->id}", [
        'amount' => 2,
        'start_number' => 1,
        'unit_prefix' => 'Unit',
        'unit_format' => 'numeric',
        'floor' => '1',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $units = RoomUnit::where('room_type_id', $roomType->id)->get();
    expect($units)->toHaveCount(2);

    foreach ($units as $unit) {
        expect(strlen($unit->unit_code))->toBeLessThanOrEqual(30);
    }
});
