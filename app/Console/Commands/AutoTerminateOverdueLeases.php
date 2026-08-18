<?php

namespace App\Console\Commands;

use App\Models\BookingHeader;
use App\Models\RoomUnit;
use App\Models\TenantContract;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoTerminateOverdueLeases extends Command
{
    protected $signature = 'app:auto-terminate-overdue-leases';

    protected $description = 'Automatically terminates leases that have passed their check-out date by 14 days without renewal';

    public function handle()
    {
        $expirationDate = Carbon::now()->subDays(14)->toDateString();

        $overdueBookings = BookingHeader::where('status', 'Checked In')
            ->whereDate('check_out_date', '<=', $expirationDate)
            ->get();

        $count = 0;
        foreach ($overdueBookings as $booking) {
            $booking->update([
                'status' => 'Completed', // Or 'Cancelled' depending on the exact wording, Completed marks the end of lease.
                'notes' => $booking->notes."\n[Sistem] Di-terminate otomatis karena lewat batas waktu 14 hari.",
            ]);

            if ($booking->room_unit_id) {
                RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Available']);
            }

            // Also terminate the contract if exists
            $contract = TenantContract::where('booking_header_id', $booking->id)->first();
            if ($contract && $contract->status !== 'Terminated') {
                $contract->update([
                    'status' => 'Terminated',
                    'notes' => $contract->notes."\n[Sistem] Di-terminate otomatis karena lewat batas waktu 14 hari.",
                ]);
            }

            $count++;
        }

        $this->info("Successfully terminated {$count} overdue leases.");
    }
}
