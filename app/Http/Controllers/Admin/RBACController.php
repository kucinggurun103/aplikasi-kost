<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class RBACController extends Controller
{
    // Roles
    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:50|unique:roles,code',
            'description' => 'nullable|string',
            'access_all_branches' => 'boolean',
        ]);

        Role::create($validated);

        return back()->with('success', 'Role berhasil dibuat.');
    }

    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => ['required', 'string', 'max:50', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string',
            'access_all_branches' => 'boolean',
        ]);

        $role->update($validated);

        return back()->with('success', 'Role berhasil diubah.');
    }

    public function destroyRole(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }

    // Users
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (! empty($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return back()->with('success', 'User berhasil dibuat.');
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return back()->with('success', 'User berhasil diubah.');
    }

    public function destroyUser(User $user)
    {
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password user berhasil direset.');
    }
}
