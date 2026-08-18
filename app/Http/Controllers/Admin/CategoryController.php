<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        // Validate or auto-assign branch for operators
        if (! $request->user()->hasRole('admin')) {
            $allowedBranches = $request->user()->branches()->pluck('branches.id')->toArray();
            if (empty($request->branch_id) || ! in_array($request->branch_id, $allowedBranches)) {
                $operatorBranch = $request->user()->branches()->first();
                if ($operatorBranch) {
                    $request->merge(['branch_id' => $operatorBranch->id]);
                }
            }
        }
        $branchId = $request->branch_id;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'description' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        RoomCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori kamar berhasil ditambahkan');
    }

    public function update(Request $request, RoomCategory $category)
    {
        // Validate or auto-assign branch for operators
        if (! $request->user()->hasRole('admin')) {
            $allowedBranches = $request->user()->branches()->pluck('branches.id')->toArray();
            if (empty($request->branch_id) || ! in_array($request->branch_id, $allowedBranches)) {
                $operatorBranch = $request->user()->branches()->first();
                if ($operatorBranch) {
                    $request->merge(['branch_id' => $operatorBranch->id]);
                }
            }
        }
        $branchId = $request->branch_id;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'description' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori kamar berhasil diperbarui');
    }

    public function destroy(RoomCategory $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Kategori kamar berhasil dihapus');
    }
}
