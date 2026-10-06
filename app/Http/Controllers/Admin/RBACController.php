<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RBACController extends Controller
{
    // Roles
    public function storeRole(Request $request): mixed
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:50|unique:roles,code',
            'description' => 'nullable|string',
            'access_all_branches' => 'boolean',
        ]);

        Role::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role berhasil dibuat.']);

        return back();
    }

    public function updateRole(Request $request, Role $role): mixed
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => ['required', 'string', 'max:50', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string',
            'access_all_branches' => 'boolean',
        ]);

        $role->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role berhasil diubah.']);

        return back();
    }

    public function destroyRole(Request $request, Role $role): mixed
    {
        $this->authorizeAdmin($request);

        if (User::whereHas('roles', fn ($query) => $query->whereKey($role->id))->exists()) {
            Inertia::flash('toast', ['type' => 'warning', 'message' => 'Role tidak dapat dihapus karena masih digunakan user.']);

            return back();
        }

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role berhasil dihapus.']);

        return back();
    }

    // Users
    public function storeUser(Request $request): mixed
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        DB::transaction(function () use ($validated): void {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            if (! empty($validated['roles'])) {
                $user->roles()->sync($validated['roles']);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil dibuat.']);

        return back();
    }

    public function updateUser(Request $request, User $user): mixed
    {
        $this->authorizeAdmin($request);

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

        DB::transaction(function () use ($user, $data, $validated): void {
            $user->update($data);

            if (isset($validated['roles'])) {
                $user->roles()->sync($validated['roles']);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil diubah.']);

        return back();
    }

    public function destroyUser(Request $request, User $user): mixed
    {
        $this->authorizeAdmin($request);
        abort_if($request->user()->is($user), 403);

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User berhasil dihapus.']);

        return back();
    }

    public function resetPassword(Request $request, User $user): mixed
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password user berhasil direset.']);

        return back();
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->hasRole('admin'), 403);
    }
}
