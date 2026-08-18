<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingAddon;
use App\Models\BookingHeader;
use App\Models\Facility;
use App\Models\PaymentHeader;
use App\Models\RoomType;
use App\Models\RoomUnit;
use App\Models\TenantContract;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = BookingHeader::with(['tenant', 'branch', 'roomType', 'roomUnit', 'bookingLines']);

        if ($status) {
            $query->where('status', $status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    public function assignUnit(Request $request, BookingHeader $booking)
    {
        $request->validate([
            'room_unit_id' => 'required|exists:room_units,id',
        ]);

        $unit = RoomUnit::findOrFail($request->room_unit_id);

        // Make sure unit belongs to the same room type
        if ($unit->room_type_id !== $booking->room_type_id) {
            return back()->with('error', 'Unit tidak sesuai dengan tipe kamar yang dipesan.');
        }

        if ($unit->status !== 'Available') {
            return back()->with('error', 'Unit sedang tidak tersedia.');
        }

        $booking->update([
            'room_unit_id' => $unit->id,
        ]);

        return back()->with('success', 'Berhasil mengalokasikan unit kamar untuk booking ini.');
    }

    public function updateStatus(Request $request, BookingHeader $booking)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Checked In,Completed,Cancelled',
        ]);

        $oldStatus = $booking->status;
        $newStatus = $request->status;

        $booking->update(['status' => $newStatus]);

        // If status becomes Confirmed or Checked In, mark unit as Occupied
        if (($newStatus === 'Confirmed' || $newStatus === 'Checked In') && $oldStatus !== 'Confirmed' && $oldStatus !== 'Checked In') {
            if ($booking->room_unit_id) {
                RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Occupied']);
            }
        }

        // If status becomes Cancelled, free up the unit
        if ($newStatus === 'Cancelled') {
            if ($booking->room_unit_id) {
                RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Available']);
            }
        }

        // Auto-generate Tenant Contract when Checked In and Paid
        if ($newStatus === 'Checked In' && $booking->payment_status === 'Paid') {
            // Check if contract already exists
            $exists = TenantContract::where('booking_header_id', $booking->id)->exists();
            if (! $exists) {
                TenantContract::create([
                    'contract_number' => 'CTR-'.time().'-'.rand(100, 999),
                    'booking_header_id' => $booking->id,
                    'user_id' => $booking->tenant_id,
                    'branch_id' => $booking->branch_id,
                    'room_type_id' => $booking->room_type_id,
                    'room_unit_id' => $booking->room_unit_id,
                    'start_date' => $booking->check_in_date,
                    'end_date' => $booking->check_out_date,
                    'monthly_price' => $booking->monthly_price,
                    'deposit_amount' => $booking->deposit,
                    'status' => 'Active',
                    'notes' => 'Generated automatically from booking.',
                ]);
            }
        }

        if ($newStatus === 'Confirmed' || $newStatus === 'Checked In') {
            NotificationService::send('BOOKING_CONFIRMED', $booking->tenant, [
                'name' => $booking->tenant->name,
                'room_name' => $booking->roomUnit->unit_number ?? 'Menunggu Unit',
                'total_amount' => number_format($booking->grand_total, 0, ',', '.'),
                'status' => $newStatus,
            ]);
        }

        return back()->with('success', 'Status booking berhasil diperbarui.');
    }

    public function manualBooking(Request $request)
    {
        $request->validate([
            'tenant_id' => 'required|exists:users,id',
            'room_type_id' => 'required|exists:room_types,id',
            'check_in_date' => 'required|date',
            'rent_type' => 'required|in:Monthly,Daily',
            'duration_month' => 'required_if:rent_type,Monthly|integer|min:1|nullable',
            'duration_days' => 'required_if:rent_type,Daily|integer|min:1|nullable',
            'custom_price' => 'required_if:rent_type,Daily|numeric|min:0|nullable',
            'addon_ids' => 'nullable|array',
            'addon_ids.*' => 'exists:facilities,id',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $roomType = RoomType::findOrFail($request->room_type_id);
        $checkIn = Carbon::parse($request->check_in_date);

        $monthlyPrice = $roomType->monthly_price ?? 0;
        $deposit = $roomType->deposit_amount ?? 0;

        $rentType = $request->rent_type;

        if ($rentType === 'Daily') {
            $durationDays = (int) $request->duration_days;
            $durationMonth = 0;
            $checkOut = $checkIn->copy()->addDays($durationDays);
            $subtotal = $request->custom_price;
        } else {
            $durationMonth = (int) $request->duration_month;
            $durationDays = 0;
            $checkOut = $checkIn->copy()->addMonths($durationMonth);
            $subtotal = $monthlyPrice * $durationMonth;
        }

        // Calculate Addons
        $addonMonthlyTotal = 0;
        $addons = [];
        if ($request->has('addon_ids') && is_array($request->addon_ids)) {
            $addons = Facility::whereIn('id', $request->addon_ids)
                ->where('price', '>', 0)
                ->get();
            $addonMonthlyTotal = $addons->sum('price');
        }

        $subtotal += ($addonMonthlyTotal * max(1, $durationMonth));
        $grandTotal = $subtotal + $deposit;

        $booking = BookingHeader::create([
            'booking_no' => 'BKG-'.time().'-'.rand(100, 999),
            'tenant_id' => $request->tenant_id,
            'branch_id' => $roomType->branch_id,
            'room_type_id' => $roomType->id,
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'rent_type' => $rentType,
            'duration_month' => $durationMonth,
            'duration_days' => $durationDays,
            'monthly_price' => $monthlyPrice,
            'custom_price' => $request->custom_price,
            'subtotal' => $subtotal,
            'deposit' => $deposit,
            'grand_total' => $grandTotal,
            'status' => 'Pending', // Pending until deposit/first payment is confirmed
            'payment_status' => 'Pending',
            'notes' => 'Manual booking by Admin',
        ]);

        foreach ($addons as $addon) {
            BookingAddon::create([
                'booking_header_id' => $booking->id,
                'facility_id' => $addon->id,
                'price' => $addon->price,
            ]);
        }

        // Generate Invoices Upfront
        $bookingFee = $roomType->booking_price ?? 0;
        $paymentCount = 0;
        
        if ($bookingFee > 0) {
            $paymentCount++;
            PaymentHeader::create([
                'payment_no' => 'PAY-'.time().'-'.$booking->id.'-'.$paymentCount,
                'booking_header_id' => $booking->id,
                'invoice_date' => now(),
                'due_date' => now()->addDays(1),
                'subtotal' => $bookingFee,
                'admin_fee' => 0,
                'grand_total' => $bookingFee,
                'payment_method' => 'Manual',
                'status' => 'Pending',
            ]);
        } else {
            for ($i = 1; $i <= $durationMonth; $i++) {
                $paymentCount++;
                $monthRent = $monthlyPrice + $addonMonthlyTotal;
                
                $isFirstMonth = ($i === 1);
                $monthSubtotal = $monthRent;
                
                if ($isFirstMonth) {
                    $monthSubtotal += $deposit;
                }
                
                $dueDate = $isFirstMonth ? $checkIn : $checkIn->copy()->addMonths($i - 1);
                $invoiceDate = $isFirstMonth ? now() : $dueDate->copy()->subDays(7);
                
                if ($isFirstMonth && $bookingFee == 0) {
                    $dueDate = now()->addDays(1);
                }
                
                PaymentHeader::create([
                    'payment_no' => 'PAY-'.time().'-'.$booking->id.'-'.$paymentCount,
                    'booking_header_id' => $booking->id,
                    'invoice_date' => $invoiceDate,
                    'due_date' => $dueDate,
                    'subtotal' => $monthSubtotal,
                    'admin_fee' => 0,
                    'grand_total' => $monthSubtotal,
                    'payment_method' => 'Manual',
                    'status' => 'Unpaid',
                ]);
            }
        }

        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payments', 'public');
            $firstPayment = PaymentHeader::where('booking_header_id', $booking->id)->orderBy('id')->first();
            
            if ($firstPayment) {
                $firstPayment->update([
                    'proof_of_payment' => $path,
                    'status' => 'Paid',
                    'paid_at' => now(),
                ]);

                if ($bookingFee > 0 && $firstPayment->subtotal == $bookingFee) {
                    $booking->update([
                        'payment_status' => 'Partially Paid',
                        'status' => 'Confirmed', 
                    ]);
                    PaymentHeader::generateMonthlyInvoices($booking);
                } else {
                    $booking->update([
                        'payment_status' => ($firstPayment->grand_total >= $booking->grand_total) ? 'Paid' : 'Partially Paid',
                        'status' => 'Checked In',
                    ]);
                    
                    if ($booking->room_unit_id) {
                        RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Occupied']);
                    }
                    
                    TenantContract::create([
                        'contract_number' => 'CTR-'.time().'-'.rand(100, 999),
                        'booking_header_id' => $booking->id,
                        'user_id' => $booking->tenant_id,
                        'branch_id' => $booking->branch_id,
                        'room_type_id' => $booking->room_type_id,
                        'room_unit_id' => $booking->room_unit_id,
                        'start_date' => $booking->check_in_date,
                        'end_date' => $booking->check_out_date,
                        'monthly_price' => $booking->monthly_price,
                        'deposit_amount' => $booking->deposit,
                        'status' => 'Active',
                        'notes' => 'Generated automatically from payment.',
                    ]);
                }
            }
        }

        return back()->with('success', 'Booking manual berhasil dibuat.');
    }

    public function manualPay(Request $request, BookingHeader $booking)
    {
        $request->validate([
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'payment_id' => 'required|exists:payment_headers,id',
        ]);

        $payment = PaymentHeader::where('booking_header_id', $booking->id)
                                ->where('id', $request->payment_id)
                                ->first();

        if (! $payment) {
            return back()->with('error', 'Data tagihan tidak ditemukan.');
        }

        $path = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payments', 'public');
            $payment->update(['proof_of_payment' => $path]);
        }

        $payment->update([
            'status' => 'Paid',
            'paid_at' => now(),
        ]);

        // Hitung total terbayar untuk update status booking
        $totalPaid = PaymentHeader::where('booking_header_id', $booking->id)
            ->where('status', 'Paid')
            ->sum('grand_total');

        $dpAmount = $booking->roomType->booking_price ?? 0;
        $isDPPayment = ($dpAmount > 0 && $payment->subtotal == $dpAmount);

        if ($isDPPayment) {
            $booking->update([
                'payment_status' => 'Partially Paid',
                'status' => 'Confirmed', 
            ]);

            // Generate monthly invoices after DP is paid
            $existingCount = PaymentHeader::where('booking_header_id', $booking->id)->count();
            if ($existingCount == 1) {
                PaymentHeader::generateMonthlyInvoices($booking);
            }
        } else {
            $isFirstRentPayment = !\App\Models\TenantContract::where('booking_header_id', $booking->id)->exists();

            $booking->update([
                'payment_status' => ($totalPaid >= $booking->grand_total) ? 'Paid' : 'Partially Paid',
                'status' => 'Checked In',
            ]);
            
            if ($booking->room_unit_id) {
                \App\Models\RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Occupied']);
            }

            if ($isFirstRentPayment) {
                \App\Models\TenantContract::create([
                    'contract_number' => 'CTR-'.time().'-'.rand(100, 999),
                    'booking_header_id' => $booking->id,
                    'user_id' => $booking->tenant_id,
                    'branch_id' => $booking->branch_id,
                    'room_type_id' => $booking->room_type_id,
                    'room_unit_id' => $booking->room_unit_id,
                    'start_date' => $booking->check_in_date,
                    'end_date' => $booking->check_out_date,
                    'monthly_price' => $booking->monthly_price,
                    'deposit_amount' => $booking->deposit,
                    'status' => 'Active',
                    'notes' => 'Generated automatically from payment.',
                ]);
            }
        }

        NotificationService::send('PAYMENT_SUCCESS', $booking->tenant, [
            'name' => $booking->tenant->name,
            'room_name' => $booking->roomUnit->unit_number ?? 'N/A',
            'total_amount' => number_format($payment ? $payment->grand_total : 0, 0, ',', '.'),
        ]);

        return back()->with('success', 'Pembayaran manual berhasil dikonfirmasi.');
    }

    public function refundDeposit(Request $request, BookingHeader $booking)
    {
        if ($booking->deposit > 0 && $booking->deposit_status !== 'Refunded') {
            $booking->update([
                'deposit_status' => 'Refunded',
                'deposit_refunded_at' => now(),
            ]);

            // Optional: send notification
            NotificationService::send('DEPOSIT_REFUNDED', $booking->tenant, [
                'name' => $booking->tenant->name,
                'room_name' => $booking->roomUnit->unit_number ?? 'N/A',
                'amount' => number_format($booking->deposit, 0, ',', '.'),
            ]);

            return back()->with('success', 'Deposit berhasil di-refund.');
        }

        return back()->with('error', 'Deposit tidak valid atau sudah di-refund.');
    }

    public function extendBooking(Request $request, BookingHeader $booking)
    {
        $request->validate([
            'rent_type' => 'required|in:Monthly,Daily',
            'duration_month' => 'required_if:rent_type,Monthly|integer|min:1|nullable',
            'duration_days' => 'required_if:rent_type,Daily|integer|min:1|nullable',
            'custom_price' => 'required_if:rent_type,Daily|numeric|min:0|nullable',
        ]);

        $oldCheckOut = Carbon::parse($booking->check_out_date);

        if ($request->rent_type === 'Daily') {
            $durationDays = $request->duration_days;
            $newCheckOut = $oldCheckOut->copy()->addDays($durationDays);
            $amount = $request->custom_price;

            $booking->update([
                'check_out_date' => $newCheckOut,
                'duration_days' => $booking->duration_days + $durationDays,
                'subtotal' => $booking->subtotal + $amount,
                'grand_total' => $booking->grand_total + $amount,
            ]);
        } else {
            $durationMonth = $request->duration_month;
            $newCheckOut = $oldCheckOut->copy()->addMonths($durationMonth);
            $amount = $booking->monthly_price * $durationMonth;

            $booking->update([
                'check_out_date' => $newCheckOut,
                'duration_month' => $booking->duration_month + $durationMonth,
                'subtotal' => $booking->subtotal + $amount,
                'grand_total' => $booking->grand_total + $amount,
            ]);
        }

        // Generate bill for the extension
        PaymentHeader::create([
            'payment_no' => 'PAY-EXT-'.time().'-'.rand(100, 999),
            'booking_header_id' => $booking->id,
            'invoice_date' => now(),
            'due_date' => now()->addDays(1),
            'subtotal' => $amount,
            'grand_total' => $amount,
            'payment_method' => 'Manual',
            'status' => 'Unpaid',
        ]);

        // Also update contract if exists
        $contract = TenantContract::where('booking_header_id', $booking->id)->first();
        if ($contract) {
            $contract->update([
                'end_date' => $newCheckOut,
                'notes' => $contract->notes."\n[Perpanjangan] S/d ".$newCheckOut->format('d M Y'),
            ]);
        }

        return back()->with('success', 'Masa sewa berhasil diperpanjang. Tagihan baru telah dibuat.');
    }

    public function terminateBooking(Request $request, BookingHeader $booking)
    {
        $request->validate([
            'notes' => 'nullable|string',
            'type' => 'required|in:EarlyCheckout,Eviction',
        ]);

        $status = $request->type === 'Eviction' ? 'Cancelled' : 'Completed';
        $prefix = $request->type === 'Eviction' ? 'Pelanggaran / Putus Kontrak' : 'Check-out Lebih Awal';

        $booking->update([
            'status' => $status,
            'notes' => $booking->notes."\n[{$prefix}] ".$request->notes,
        ]);

        if ($booking->room_unit_id) {
            RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Available']);
        }

        $contract = TenantContract::where('booking_header_id', $booking->id)->first();
        if ($contract) {
            $contract->update([
                'status' => 'Terminated',
                'notes' => $contract->notes."\n[{$prefix}] ".$request->notes,
            ]);
        }

        return back()->with('success', 'Booking berhasil dihentikan. Kamar kini berstatus Available.');
    }

    public function updateInvoiceDueDate(Request $request, PaymentHeader $paymentHeader)
    {
        $request->validate([
            'due_date' => 'required|date',
        ]);

        $paymentHeader->update([
            'due_date' => $request->due_date,
        ]);

        return back()->with('success', 'Tanggal jatuh tempo tagihan berhasil diubah.');
    }
}
