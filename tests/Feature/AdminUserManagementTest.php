<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserProfile;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $adminRole = Role::create(['name' => 'Administrator', 'code' => 'admin']);
    $this->admin->roles()->attach($adminRole);
});

it('creates, updates, and soft deletes users through the management flow', function () {
    $tenantRole = Role::create(['name' => 'Tenant', 'code' => 'tenant']);
    $operatorRole = Role::create(['name' => 'Operator', 'code' => 'operator']);

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->post('/admin/master/users', [
            'name' => 'Managed User',
            'email' => 'managed@example.test',
            'password' => 'password123',
            'roles' => [$tenantRole->id],
        ])
        ->assertRedirect(route('dashboard'));

    $user = User::where('email', 'managed@example.test')->firstOrFail();

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->put("/admin/master/users/{$user->id}", [
            'name' => 'Updated User',
            'email' => 'updated@example.test',
            'password' => '',
            'roles' => [$operatorRole->id],
        ])
        ->assertRedirect(route('dashboard'));

    expect($user->refresh()->name)->toBe('Updated User')
        ->and($user->roles()->whereKey($operatorRole->id)->exists())->toBeTrue();

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->delete("/admin/master/users/{$user->id}")
        ->assertRedirect(route('dashboard'));

    $this->assertSoftDeleted('users', ['id' => $user->id]);
});

it('returns validation feedback without creating a user', function () {
    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->post('/admin/master/users', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'roles' => [],
        ])
        ->assertSessionHasErrors(['name', 'email', 'password'])
        ->assertRedirect(route('dashboard'));

    expect(User::where('email', 'not-an-email')->exists())->toBeFalse();
});

it('rejects user management requests from non-admin users', function () {
    $user = User::factory()->create();
    UserProfile::create([
        'user_id' => $user->id,
        'identity_number' => 'ID-'.$user->id,
        'phone_number' => '081234567890',
    ]);

    $this->actingAs($user)
        ->post('/admin/master/users', [
            'name' => 'Unauthorized User',
            'email' => 'unauthorized@example.test',
            'password' => 'password123',
        ])
        ->assertForbidden();
});

it('does not delete a role that is still assigned to a user', function () {
    $tenantRole = Role::create(['name' => 'Tenant', 'code' => 'tenant']);
    $user = User::factory()->create();
    $user->roles()->attach($tenantRole);

    $this->actingAs($this->admin)
        ->from(route('dashboard'))
        ->delete("/admin/master/roles/{$tenantRole->id}")
        ->assertRedirect(route('dashboard'));

    expect(Role::find($tenantRole->id))->not->toBeNull();
});
