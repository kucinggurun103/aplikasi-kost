<?php

namespace App\Console\Commands;

use App\Models\BookingHeader;
use App\Models\PaymentHeader;
use App\Models\RoomUnit;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'app:cancel-expired-bookings';

    protected $description = 'Cancels bookings that have not been checked in within 7 days of their check-in date';

    public function handle()
    {
        $expirationDate = Carbon::now()->subDays(7)->toDateString();

        $expiredBookings = BookingHeader::whereIn('status', ['Pending', 'Confirmed'])
            ->whereDate('check_in_date', '<=', $expirationDate)
            ->get();

        $count = 0;
        foreach ($expiredBookings as $booking) {
            $booking->update(['status' => 'Cancelled']);

            if ($booking->room_unit_id) {
                RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Available']);
            }

            // Optionally update payment status
            PaymentHeader::where('booking_header_id', $booking->id)
                ->whereIn('status', ['Unpaid', 'Pending'])
                ->update(['status' => 'Cancelled']);

            $count++;
        }

        $this->info("Successfully cancelled {$count} expired bookings.");
    }
}
