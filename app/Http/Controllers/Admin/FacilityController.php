<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
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

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $validated['name'] = strtoupper($validated['name']);
        $validated['price'] = $validated['price'] ?? 0;

        Facility::create($validated);

        return redirect()->back()->with('success', 'Fasilitas berhasil ditambahkan');
    }

    public function update(Request $request, Facility $facility)
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

        $validated = $request->request->all();
        // Since we might use PUT which receives the branch_id
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $validated['name'] = strtoupper($validated['name']);
        $validated['price'] = $validated['price'] ?? 0;

        $facility->update($validated);

        return redirect()->back()->with('success', 'Fasilitas berhasil diperbarui');
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();

        return redirect()->back()->with('success', 'Fasilitas berhasil dihapus');
    }
}
