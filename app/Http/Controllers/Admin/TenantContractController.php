<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomUnit;
use App\Models\TenantContract;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TenantContractController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user->hasRole('admin') || $user->hasRole('operator'), 403);

        $branchIds = $user->hasRole('admin') ? [] : $user->branches()->pluck('branches.id');

        $contracts = TenantContract::with(['bookingHeader', 'tenant', 'branch', 'roomType', 'roomUnit'])
            ->when(
                ! $user->hasRole('admin'),
                fn ($query) => $query->whereIn('branch_id', $branchIds),
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/contracts/index', [
            'contracts' => $contracts,
        ]);
    }

    public function terminate(Request $request, TenantContract $contract)
    {
        $this->authorizeContractAccess($request->user(), $contract);

        $request->validate([
            'notes' => 'nullable|string',
        ]);

        if ($contract->status === 'Terminated') {
            return back()->with('error', 'Kontrak sudah diterminasi sebelumnya.');
        }

        $alreadyTerminated = false;

        DB::transaction(function () use ($contract, $request, &$alreadyTerminated): void {
            $contract = TenantContract::whereKey($contract->id)->lockForUpdate()->firstOrFail();
            if ($contract->status === 'Terminated') {
            $alreadyTerminated = true;

                return;
            }

            $contract->update([
                'status' => 'Terminated',
                'notes' => $request->notes ? ($contract->notes."\nTerminasi: ".$request->notes) : $contract->notes,
            ]);

            if ($contract->room_unit_id) {
                RoomUnit::whereKey($contract->room_unit_id)->update(['status' => 'Available']);
            }
        });

        if ($alreadyTerminated) {
            return back()->with('error', 'Kontrak sudah diterminasi sebelumnya.');
        }

        return back()->with('success', 'Kontrak berhasil diterminasi dan kamar kembali tersedia.');
    }

    private function authorizeContractAccess(User $user, TenantContract $contract): void
    {
        abort_unless(
            $user->hasRole('admin') || ($user->hasRole('operator') && $user->branches()->whereKey($contract->branch_id)->exists()),
            403,
        );
    }
}
