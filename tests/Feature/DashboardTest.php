<?php

use App\Models\Role;
use App\Models\User;

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
