<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomMaintenanceController extends Controller
{
    public function index()
    {
        // Get all units grouped by branch for the grid view
        $units = RoomUnit::with(['roomType.branch', 'roomType.category'])
            ->get()
            ->sortBy(function ($unit) {
                return $unit->roomType->branch->name ?? '';
            })
            ->values();

        return Inertia::render('admin/maintenance/index', [
            'units' => $units,
        ]);
    }

    public function updateStatus(Request $request, RoomUnit $unit)
    {
        $request->validate([
            'status' => 'required|in:Available,Maintenance',
            'notes' => 'nullable|string',
        ]);

        $unit->update([
            'status' => $request->status,
            'notes' => $request->status === 'Maintenance' ? $request->notes : null,
        ]);

        return back()->with('success', 'Status unit kamar berhasil diperbarui.');
    }

    public function complete(Request $request, RoomUnit $unit)
    {
        if ($unit->status !== 'Maintenance') {
            return back()->with('error', 'Unit kamar tidak sedang dalam maintenance.');
        }

        $unit->update([
            'status' => 'Available',
            'notes' => null,
        ]);

        return back()->with('success', 'Maintenance selesai. Kamar kembali tersedia.');
    }
}
