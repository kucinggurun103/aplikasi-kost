<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::create(['name' => 'Administrator', 'code' => 'admin']);
    $user = User::factory()->create();
    $user->roles()->attach($role);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('tenant users can visit the dashboard without crashing', function () {
    $tenant = User::factory()->create();
    $this->actingAs($tenant);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('tenant dashboard handles reviews safely even if user_id column is absent', function () {
    $tenant = User::factory()->create();
    $this->actingAs($tenant);

    // Drop column in test to simulate production database before migration
    if (Schema::hasColumn('reviews', 'user_id')) {
        Schema::table('reviews', function ($table) {
            $table->dropConstrainedForeignId('user_id');
        });
    }

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});
