<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomUnit;
use App\Models\TenantContract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantContractController extends Controller
{
    public function index()
    {
        $contracts = TenantContract::with(['bookingHeader', 'tenant', 'branch', 'roomType', 'roomUnit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/contracts/index', [
            'contracts' => $contracts,
        ]);
    }

    public function terminate(Request $request, TenantContract $contract)
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);

        if ($contract->status === 'Terminated') {
            return back()->with('error', 'Kontrak sudah diterminasi sebelumnya.');
        }

        // Update contract status
        $contract->update([
            'status' => 'Terminated',
            'notes' => $request->notes ? ($contract->notes."\nTerminasi: ".$request->notes) : $contract->notes,
        ]);

        // Free up the room unit
        if ($contract->room_unit_id) {
            RoomUnit::where('id', $contract->room_unit_id)->update(['status' => 'Available']);
        }

        return back()->with('success', 'Kontrak berhasil diterminasi dan kamar kembali tersedia.');
    }
}
