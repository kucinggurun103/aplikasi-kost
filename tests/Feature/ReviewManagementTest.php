<?php

use App\Models\BookingHeader;
use App\Models\Branch;
use App\Models\Review;
use App\Models\Role;
use App\Models\RoomCategory;
use App\Models\RoomType;
use App\Models\User;
use App\Models\UserProfile;

beforeEach(function () {
    $this->branch = Branch::create([
        'code' => 'TEST-BRANCH',
        'name' => 'Cabang Test',
    ]);

    $this->tenant = User::factory()->create();
    UserProfile::create([
        'user_id' => $this->tenant->id,
        'identity_number' => 'ID-'.$this->tenant->id,
        'phone_number' => '081234567890',
    ]);

    $category = RoomCategory::create(['name' => 'Kategori Test']);
    $roomType = RoomType::create([
        'branch_id' => $this->branch->id,
        'room_category_id' => $category->id,
        'type_code' => 'TEST-ROOM',
        'type_name' => 'Kamar Test',
        'slug' => 'kamar-test',
    ]);

    BookingHeader::create([
        'booking_no' => 'BKG-REVIEW-'.$this->tenant->id,
        'tenant_id' => $this->tenant->id,
        'branch_id' => $this->branch->id,
        'room_type_id' => $roomType->id,
        'check_in_date' => today()->subMonth(),
        'check_out_date' => today(),
        'status' => 'Completed',
    ]);

    $this->admin = User::factory()->create();
    $adminRole = Role::create(['name' => 'Administrator', 'code' => 'admin']);
    $this->admin->roles()->attach($adminRole);
});

it('creates reviews with every supported rating', function (int $rating) {
    $this->actingAs($this->tenant)
        ->from(route('dashboard'))
        ->post(route('reviews.store.tenant'), [
            'branch_id' => $this->branch->id,
            'rating' => $rating,
            'review_text' => 'Review rating '.$rating,
        ])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasNoErrors();

    $review = Review::query()->where('user_id', $this->tenant->id)->firstOrFail();

    expect($review->rating)->toBe((float) $rating)
        ->and($review->reviewer_name)->toBe($this->tenant->name);
})->with([1, 2, 3, 4, 5]);

it('updates a tenant own review and redirects back to the dashboard', function () {
    $review = Review::create([
        'branch_id' => $this->branch->id,
        'user_id' => $this->tenant->id,
        'reviewer_name' => $this->tenant->name,
        'rating' => 2,
        'review_text' => 'Old review',
    ]);

    $this->actingAs($this->tenant)
        ->from(route('dashboard'))
        ->put(route('reviews.update.tenant', $review), [
            'rating' => 5,
            'review_text' => 'Updated review',
        ])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasNoErrors();

    expect($review->refresh()->rating)->toBe(5.0)
        ->and($review->review_text)->toBe('Updated review');
});

it('does not allow a tenant to update or delete another tenants review', function (string $method) {
    $owner = User::factory()->create();
    $review = Review::create([
        'branch_id' => $this->branch->id,
        'user_id' => $owner->id,
        'reviewer_name' => $owner->name,
        'rating' => 4,
        'review_text' => 'Owner review',
    ]);

    $response = $this->actingAs($this->tenant)->{$method}(
        route($method === 'put' ? 'reviews.update.tenant' : 'reviews.destroy.tenant', $review),
        $method === 'put' ? ['rating' => 3, 'review_text' => 'Attempted change'] : [],
    );

    $response->assertForbidden();
    expect($review->refresh()->review_text)->toBe('Owner review');
})->with(['put', 'delete']);

it('deletes a tenant own review and returns to the review page', function () {
    $review = Review::create([
        'branch_id' => $this->branch->id,
        'user_id' => $this->tenant->id,
        'reviewer_name' => $this->tenant->name,
        'rating' => 4,
        'review_text' => 'Review to delete',
    ]);

    $this->actingAs($this->tenant)
        ->from(route('dashboard').'?tab=give_review')
        ->delete(route('reviews.destroy.tenant', $review))
        ->assertRedirect(route('dashboard').'?tab=give_review');

    expect(Review::find($review->id))->toBeNull();
});

it('allows admins to create, update, and delete branch reviews', function () {
    $payload = [
        'branch_id' => $this->branch->id,
        'reviewer_name' => 'Admin Review',
        'rating' => 5,
        'review_text' => 'Created by admin',
        'is_published' => true,
    ];

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->post('/admin/master/reviews', $payload)
        ->assertRedirect(route('dashboard'));

    $review = Review::query()->where('reviewer_name', 'Admin Review')->firstOrFail();

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->put("/admin/master/reviews/{$review->id}", [...$payload, 'review_text' => 'Updated by admin'])
        ->assertRedirect(route('dashboard'));

    expect($review->refresh()->review_text)->toBe('Updated by admin');

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->delete("/admin/master/reviews/{$review->id}")
        ->assertRedirect(route('dashboard'));

    expect(Review::find($review->id))->toBeNull();
});

it('restricts operators to reviews for assigned branches', function () {
    $operator = User::factory()->create();
    $operatorRole = Role::create(['name' => 'Operator', 'code' => 'operator']);
    $operator->roles()->attach($operatorRole);

    $this->actingAs($operator)
        ->post('/admin/master/reviews', [
            'branch_id' => $this->branch->id,
            'reviewer_name' => 'Operator Review',
            'rating' => 4,
            'review_text' => 'Review for unassigned branch',
        ])
        ->assertForbidden();
});

it('allows an operator to manage reviews for an assigned branch', function () {
    $operator = User::factory()->create();
    $operatorRole = Role::create(['name' => 'Operator', 'code' => 'operator']);
    $operator->roles()->attach($operatorRole);
    $operator->branches()->attach($this->branch);

    $this->actingAs($operator)
        ->post('/admin/master/reviews', [
            'branch_id' => $this->branch->id,
            'reviewer_name' => 'Operator Review',
            'rating' => 4,
            'review_text' => 'Review for assigned branch',
        ])
        ->assertRedirect();

    expect(Review::where('reviewer_name', 'Operator Review')->exists())->toBeTrue();
});