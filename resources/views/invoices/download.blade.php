<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice {{ $paymentHeader->payment_no }}</title>
    <style>
        body { color: #172033; font: 16px Arial, sans-serif; margin: 40px auto; max-width: 760px; padding: 0 24px; }
        header, .row, footer { display: flex; justify-content: space-between; gap: 24px; }
        header { border-bottom: 2px solid #172033; margin-bottom: 32px; padding-bottom: 16px; }
        h1 { font-size: 24px; margin: 0; }
        h2 { font-size: 16px; margin: 0 0 8px; }
        p { margin: 6px 0; }
        .muted { color: #64748b; }
        .row { border-bottom: 1px solid #e2e8f0; padding: 12px 0; }
        .total { font-size: 20px; font-weight: bold; }
        footer { border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 16px; }
        @media print { body { margin: 0 auto; } }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>Invoice</h1>
            <p>{{ $paymentHeader->payment_no }}</p>
            <p class="muted">Dibuat {{ $paymentHeader->invoice_date?->format('d M Y') }}</p>
        </div>
        <div>
            <h2>{{ $paymentHeader->booking?->branch?->name ?? config('app.name') }}</h2>
            <p>{{ $paymentHeader->booking?->branch?->address }}</p>
        </div>
    </header>

    <section>
        <h2>Ditagihkan kepada</h2>
        <p>{{ $paymentHeader->booking?->tenant?->name }}</p>
        <p class="muted">Booking {{ $paymentHeader->booking?->booking_no }}</p>
        <p class="muted">{{ $paymentHeader->booking?->room_type?->type_name }} {{ $paymentHeader->booking?->room_unit?->unit_number }}</p>
    </section>

    <section style="margin-top: 32px">
        <div class="row"><span>Subtotal</span><span>Rp {{ number_format((float) $paymentHeader->subtotal, 0, ',', '.') }}</span></div>
        <div class="row"><span>Biaya administrasi</span><span>Rp {{ number_format((float) $paymentHeader->admin_fee, 0, ',', '.') }}</span></div>
        <div class="row"><span>Pajak</span><span>Rp {{ number_format((float) $paymentHeader->tax, 0, ',', '.') }}</span></div>
        <div class="row total"><span>Total</span><span>Rp {{ number_format((float) $paymentHeader->grand_total, 0, ',', '.') }}</span></div>
    </section>

    <footer>
        <span>Status: {{ $paymentHeader->status }}</span>
        <span>Tanggal pembayaran: {{ $paymentHeader->paid_at?->format('d M Y H:i') ?? '-' }}</span>
    </footer>
</body>
</html>