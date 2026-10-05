<?php

namespace App\Http\Controllers;

use App\Models\PaymentHeader;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentHistoryController extends Controller
{
    public function download(Request $request): StreamedResponse
    {
        $payments = PaymentHeader::query()
            ->with('booking')
            ->whereHas('booking', fn ($query) => $query->where('tenant_id', $request->user()->id))
            ->whereIn('status', ['Paid', 'Failed'])
            ->orderBy('id')
            ->lazy();

        return response()->streamDownload(
            static function () use ($payments): void {
                $output = fopen('php://output', 'w');
                fwrite($output, "\xEF\xBB\xBF");
                fputcsv($output, ['Nomor Invoice', 'Tanggal', 'Nomor Booking', 'Status', 'Metode Pembayaran', 'Total'], ',', '"', '\\');

                foreach ($payments as $payment) {
                    fputcsv($output, [
                        $payment->payment_no,
                        $payment->created_at?->format('Y-m-d'),
                        $payment->booking?->booking_no,
                        $payment->status,
                        $payment->payment_method,
                        $payment->grand_total,
                    ], ',', '"', '\\');
                }

                fclose($output);
            },
            'riwayat-pembayaran-'.now()->format('Ymd').'.csv',
            ['Content-Type' => 'text/csv; charset=UTF-8'],
        );
    }
}
