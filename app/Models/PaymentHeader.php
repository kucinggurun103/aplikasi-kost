<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentHeader extends Model
{
    protected $guarded = [];

    public function booking()
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }

    public static function generateMonthlyInvoices(BookingHeader $booking)
    {
        $adminFee = \App\Models\WebSetting::first()->admin_fee ?? 25000;
        $insuranceFee = 50000; // As per web.php logic, but wait, did they choose insurance?
        
        // We should recalculate from the booking data.
        $monthlyPrice = $booking->monthly_price;
        $depositFee = $booking->deposit;
        
        // Addons total per month
        $addonTotalPerMonth = 0;
        foreach ($booking->addons as $addon) {
            $addonTotalPerMonth += $addon->price;
        }
        
        $monthRent = $monthlyPrice + $addonTotalPerMonth;
        
        // Check if they paid insurance by checking if subtotal has it?
        // Wait, $booking->subtotal includes insurance + addons (total).
        // Let's deduce insurance fee
        $expectedSubtotalWithoutInsurance = ($monthlyPrice * $booking->duration_month) + ($addonTotalPerMonth * $booking->duration_month);
        $hasInsurance = $booking->subtotal > $expectedSubtotalWithoutInsurance;
        $insuranceAmount = $hasInsurance ? 50000 : 0;
        
        $paymentCount = self::where('booking_header_id', $booking->id)->count();

        for ($i = 1; $i <= $booking->duration_month; $i++) {
            $paymentCount++;
            $isFirstMonth = ($i === 1);
            $monthSubtotal = $monthRent;
            $monthAdmin = 0;
            
            if ($isFirstMonth) {
                $dpAmount = $booking->roomType->booking_price ?? 0;
                $monthSubtotal -= $dpAmount;
                $monthSubtotal += $insuranceAmount + $depositFee;
                $monthSubtotal -= $booking->discount;
                $monthAdmin = $adminFee;
            }
            
            $dueDate = $isFirstMonth ? \Carbon\Carbon::parse($booking->check_in_date) : \Carbon\Carbon::parse($booking->check_in_date)->addMonths($i - 1);
            $invoiceDate = $isFirstMonth ? now() : $dueDate->copy()->subDays(7);
            
            if ($isFirstMonth) {
                $dueDate = now()->addDays(1);
            }
            
            self::create([
                'payment_no' => 'PAY-'.time().'-'.$booking->id.'-'.$paymentCount,
                'booking_header_id' => $booking->id,
                'invoice_date' => $invoiceDate,
                'due_date' => $dueDate,
                'subtotal' => $monthSubtotal,
                'admin_fee' => $monthAdmin,
                'grand_total' => $monthSubtotal + $monthAdmin,
                'payment_method' => 'Transfer',
                'status' => 'Unpaid',
            ]);
        }
    }
}
