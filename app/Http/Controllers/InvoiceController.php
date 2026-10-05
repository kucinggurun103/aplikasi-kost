<?php

namespace App\Http\Controllers;

use App\Models\PaymentHeader;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InvoiceController extends Controller
{
    public function download(Request $request, PaymentHeader $paymentHeader): StreamedResponse
    {
        abort_unless(
            $paymentHeader->deleted_at === null
                && $paymentHeader->status === 'Paid'
                && $paymentHeader->booking()->where('tenant_id', $request->user()->id)->exists(),
            404,
        );

        $paymentHeader->load(['booking.tenant', 'booking.branch', 'booking.roomType', 'booking.roomUnit']);
        $document = view('invoices.download', compact('paymentHeader'))->render();

        return response()->streamDownload(
            static function () use ($document): void {
                echo $document;
            },
            "invoice-{$paymentHeader->id}.html",
            ['Content-Type' => 'text/html; charset=UTF-8'],
        );
    }
}