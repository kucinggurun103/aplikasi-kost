<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:30|unique:branches,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'google_maps_url' => 'nullable|string',
            'latitude' => 'nullable|string|max:30',
            'longitude' => 'nullable|string|max:30',
            'is_active' => 'boolean',
        ]);

        Branch::create($validated);

        return redirect()->back()->with('success', 'Cabang berhasil ditambahkan');
    }

    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:30|unique:branches,code,'.$branch->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'google_maps_url' => 'nullable|string',
            'latitude' => 'nullable|string|max:30',
            'longitude' => 'nullable|string|max:30',
            'is_active' => 'boolean',
        ]);

        $branch->update($validated);

        return redirect()->back()->with('success', 'Cabang berhasil diperbarui');
    }

    public function destroy(Branch $branch)
    {
        // Iterate to fire model events (if any) or explicitly delete relations
        foreach ($branch->roomTypes as $roomType) {
            $roomType->units()->delete();
            $roomType->images()->delete();
            $roomType->delete();
        }
        $branch->roomCategories()->delete();
        $branch->facilities()->delete();
        $branch->delete();

        return redirect()->back()->with('success', 'Cabang berhasil dihapus');
    }

    public function assignOperator(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $branch->users()->sync($validated['user_ids'] ?? []);

        return redirect()->back()->with('success', 'Operator cabang berhasil diatur');
    }
}
