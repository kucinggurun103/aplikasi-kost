import {
    FileText,
    BedDouble,
    Calendar,
    Receipt,
    CreditCard,
    Star,
    File as FileIcon,
    Download,
    AlertCircle,
    CheckCircle2,
    X,
    Copy,
    Check,
    UploadCloud,
} from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import PaymentHistoryController from '@/actions/App/Http/Controllers/PaymentHistoryController';
import { Btn } from '@/components/cozqta/primitives';

export const StatusBadgeLocal = ({ status }: { status: string }) => {
    let color = 'bg-slate-100 text-slate-700';
    if (
        ['paid', 'completed', 'active', 'checked in'].includes(
            status.toLowerCase(),
        )
    )
        color = 'bg-emerald-100 text-emerald-700';
    if (['pending'].includes(status.toLowerCase()))
        color = 'bg-amber-100 text-amber-700';
    if (['cancelled', 'failed'].includes(status.toLowerCase()))
        color = 'bg-red-100 text-red-700';
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
        >
            {status}
        </span>
    );
};

export const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(number);
};

export const ActiveContract = ({ contract }: { contract: any }) => {
    if (!contract)
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    Tidak Ada Kontrak Aktif
                </h3>
                <p className="text-slate-500">
                    Anda belum memiliki kontrak sewa yang sedang berjalan.
                </p>
            </div>
        );

    return (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
                Kontrak Sewa Aktif
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <p className="mb-1 text-sm text-slate-500">Nomor Kontrak</p>
                    <p className="font-semibold text-slate-900">
                        {contract.contract_number}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-sm text-slate-500">Cabang</p>
                    <p className="font-semibold text-slate-900">
                        {contract.booking_header?.room_type?.branch?.name ||
                            '-'}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-sm text-slate-500">Kamar</p>
                    <p className="font-semibold text-slate-900">
                        {contract.booking_header?.room_unit?.unit_number || '-'}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-sm text-slate-500">Tanggal Mulai</p>
                    <p className="font-semibold text-slate-900">
                        {contract.start_date
                            ? new Date(contract.start_date).toLocaleDateString(
                                  'id-ID',
                                  {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  },
                              )
                            : '-'}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-sm text-slate-500">
                        Tanggal Selesai
                    </p>
                    <p className="font-semibold text-slate-900">
                        {contract.end_date
                            ? new Date(contract.end_date).toLocaleDateString(
                                  'id-ID',
                                  {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  },
                              )
                            : '-'}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-sm text-slate-500">Status</p>
                    <StatusBadgeLocal status={contract.status} />
                </div>
            </div>
            {contract.contract_file_path && (
                <div className="border-t border-slate-100 pt-4">
                    <a
                        href={`/storage/${contract.contract_file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <FileIcon className="h-4 w-4" />
                        Unduh Dokumen Kontrak PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export const RoomDetails = ({ contract }: { contract: any }) => {
    if (!contract || !contract.booking_header?.room_type)
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    Kamar Belum Tersedia
                </h3>
                <p className="text-slate-500">
                    Informasi unit kamar akan muncul setelah Anda memiliki
                    penyewaan yang aktif.
                </p>
            </div>
        );

    const roomType = contract.booking_header.room_type;
    const roomUnit = contract.booking_header.room_unit;

    return (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
                Detail Unit Kamar
            </h3>
            <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-1 space-y-4">
                    <div>
                        <p className="mb-1 text-sm text-slate-500">Cabang</p>
                        <p className="text-lg font-bold text-slate-900">
                            {roomType.branch?.name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {roomType.branch?.address}
                        </p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm text-slate-500">
                            Tipe & Nomor Kamar
                        </p>
                        <p className="font-bold text-slate-900">
                            {roomType.type_name} -{' '}
                            {roomUnit?.unit_number || 'Belum Dialokasi'}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-slate-500">
                            Fasilitas Kamar
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {roomType.facilities?.map((fac: any) => (
                                <span
                                    key={fac.id}
                                    className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                                >
                                    {fac.name}
                                </span>
                            ))}
                            {(!roomType.facilities ||
                                roomType.facilities.length === 0) && (
                                <span className="text-sm text-slate-400">
                                    Belum ada data fasilitas
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {roomType.rules && (
                <div className="border-t border-slate-100 pt-4">
                    <p className="mb-2 text-sm font-bold text-slate-700">
                        Peraturan Kamar
                    </p>
                    <div
                        className="prose prose-sm max-w-none text-sm text-slate-600"
                        dangerouslySetInnerHTML={{ __html: roomType.rules }}
                    />
                </div>
            )}
        </div>
    );
};

export const BookingHistory = ({ bookings }: { bookings: any[] }) => {
    return (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
                Riwayat Booking
            </h3>
            {bookings.length === 0 ? (
                <p className="py-8 text-center text-slate-500">
                    Belum ada riwayat booking.
                </p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div
                            key={b.id}
                            className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 transition-colors hover:border-indigo-100 sm:flex-row sm:items-center"
                        >
                            <div>
                                <p className="font-bold text-slate-900">
                                    {b.room_unit?.unit_number
                                        ? `Kamar ${b.room_unit.unit_number} - `
                                        : ''}
                                    {b.room_type?.name} di{' '}
                                    {b.room_type?.branch?.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Check In:{' '}
                                    {b.check_in_date
                                        ? new Date(
                                              b.check_in_date,
                                          ).toLocaleDateString('id-ID')
                                        : '-'}{' '}
                                    | ID: BKG-{b.id}
                                </p>
                            </div>
                            <div className="text-right">
                                <StatusBadgeLocal status={b.status} />
                                <p className="mt-2 text-sm font-semibold text-indigo-600">
                                    {formatRupiah(b.grand_total)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const PendingInvoices = ({ invoices }: { invoices: any[] }) => {
    const { props } = usePage();
    const paymentGateways = (props as any).stats?.payment_gateways || [];

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    // Derived state for the filtered gateways for the selected invoice
    const filteredGateways = React.useMemo(() => {
        if (!selectedInvoice) return [];
        const branchId = selectedInvoice.booking?.room_type?.branch_id;
        return paymentGateways.filter(
            (g: any) => !g.branch_id || g.branch_id === branchId,
        );
    }, [selectedInvoice, paymentGateways]);

    const [selectedMethod, setSelectedMethod] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_id: '',
        method_id: 0,
        proof_file: null as File | null,
    });

    const openModal = (inv: any) => {
        setSelectedInvoice(inv);
        const branchId = inv.booking?.room_type?.branch_id;
        const available = paymentGateways.filter(
            (g: any) => !g.branch_id || g.branch_id === branchId,
        );
        const initialMethod = available.length > 0 ? available[0].id : 0;

        setSelectedMethod(initialMethod);
        setData({
            payment_id: inv.id,
            method_id: initialMethod,
            proof_file: null,
        });
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        reset();
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const isManual = selectedGateway?.provider?.toLowerCase() === 'manual';
        const url = isManual
            ? '/payments/upload-proof'
            : '/payments/simulate-gateway';

        post(url, {
            onSuccess: () => closeModal(),
        });
    };

    const selectedGateway =
        filteredGateways.find((g: any) => g.id === selectedMethod) ||
        filteredGateways[0];

    const getInvoiceDescription = (inv: any) => {
        if (!inv.payment_no) return `INV-${inv.id}`;
        const parts = inv.payment_no.split('-');

        let paymentCount = 1;
        if (parts.length >= 4) {
            paymentCount = parseInt(parts[parts.length - 1], 10) || 1;
        }

        const hasDP = (inv.booking?.room_type?.booking_price || 0) > 0;
        const hasDeposit = (inv.booking?.deposit || 0) > 0;

        if (hasDP) {
            if (paymentCount === 1) return `Tagihan DP (Down Payment)`;
            if (paymentCount === 2)
                return `Tagihan Sewa Bulan 1 ${hasDeposit ? '+ Deposit' : ''}`;
            return `Tagihan Sewa Bulan ${paymentCount - 1}`;
        } else {
            if (paymentCount === 1)
                return `Tagihan Sewa Bulan 1 ${hasDeposit ? '+ Deposit' : ''}`;
            return `Tagihan Sewa Bulan ${paymentCount}`;
        }
    };

    return (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
                Tagihan Bulan Ini
            </h3>
            {invoices.length === 0 ? (
                <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
                    <p className="text-slate-500">
                        Hebat! Anda tidak memiliki tagihan tertunggak.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {invoices.map((inv) => (
                        <div
                            key={inv.id}
                            className={`flex flex-col items-start justify-between gap-4 rounded-xl border-2 p-4 sm:flex-row sm:items-center ${inv.status === 'Pending' ? 'border-blue-100 bg-blue-50/30' : 'border-amber-100 bg-amber-50/30'}`}
                        >
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span
                                        className={`rounded px-2 py-0.5 text-xs font-bold ${inv.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}
                                    >
                                        {inv.status === 'Pending'
                                            ? 'MENUNGGU VERIFIKASI'
                                            : 'BELUM DIBAYAR'}
                                    </span>
                                    <p className="font-bold text-slate-900">
                                        INV-{inv.id}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {getInvoiceDescription(inv)}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {inv.booking?.room_type?.branch?.name} -{' '}
                                    {inv.booking?.room_unit?.unit_number
                                        ? `Kamar ${inv.booking.room_unit.unit_number}`
                                        : inv.booking?.room_type?.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Dibuat:{' '}
                                    {inv.created_at
                                        ? new Date(
                                              inv.created_at,
                                          ).toLocaleDateString('id-ID')
                                        : '-'}
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                                <p
                                    className={`text-lg font-bold ${inv.status === 'Pending' ? 'text-blue-600' : 'text-amber-600'}`}
                                >
                                    {formatRupiah(inv.grand_total)}
                                </p>
                                {inv.status === 'Pending' ? (
                                    <span className="w-full rounded-lg bg-blue-100 px-4 py-2 text-center text-sm font-semibold text-blue-600 sm:w-auto">
                                        Menunggu ACC Admin
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => openModal(inv)}
                                        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700 sm:w-auto"
                                    >
                                        Bayar Sekarang
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedInvoice && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <h3 className="font-bold text-slate-900">
                                Pembayaran Tagihan INV-{selectedInvoice.id}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="rounded-full border border-slate-200 bg-white p-1 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                                <div className="mb-3 space-y-2 border-b border-indigo-100 pb-3 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>
                                            {getInvoiceDescription(
                                                selectedInvoice,
                                            )}
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {formatRupiah(
                                                selectedInvoice.subtotal,
                                            )}
                                        </span>
                                    </div>
                                    {selectedInvoice.admin_fee > 0 && (
                                        <div className="flex justify-between text-slate-600">
                                            <span>Biaya Layanan Admin</span>
                                            <span className="font-semibold text-slate-900">
                                                {formatRupiah(
                                                    selectedInvoice.admin_fee,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="mb-1 text-xs font-semibold text-indigo-600">
                                        Total Dibayar
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatRupiah(
                                            selectedInvoice.grand_total,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={submitPayment}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Pilih Bank Tujuan / Metode Pembayaran
                                    </label>
                                    <div className="flex max-h-48 flex-col gap-3 overflow-y-auto pr-2">
                                        {filteredGateways.length === 0 ? (
                                            <div className="col-span-full rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
                                                Belum ada metode pembayaran yang
                                                tersedia untuk cabang ini.
                                            </div>
                                        ) : (
                                            filteredGateways.map(
                                                (gateway: any) => (
                                                    <button
                                                        type="button"
                                                        key={gateway.id}
                                                        onClick={() => {
                                                            setSelectedMethod(
                                                                gateway.id,
                                                            );
                                                            setData(
                                                                'method_id',
                                                                gateway.id,
                                                            );
                                                            if (
                                                                gateway.provider?.toLowerCase() !==
                                                                'manual'
                                                            ) {
                                                                setData(
                                                                    'proof_file',
                                                                    null,
                                                                );
                                                            }
                                                        }}
                                                        className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                                                            data.method_id ===
                                                            gateway.id
                                                                ? 'border-indigo-600 bg-indigo-50/50'
                                                                : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-slate-900">
                                                                {gateway.name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {gateway.provider?.toLowerCase() ===
                                                                'manual'
                                                                    ? `A.n. ${gateway.account_name}`
                                                                    : `Provider: ${gateway.provider}`}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>

                                {selectedGateway?.provider?.toLowerCase() ===
                                'manual' ? (
                                    <>
                                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                                                <div>
                                                    <p className="mb-1 text-xs text-slate-500">
                                                        Nomor Rekening
                                                    </p>
                                                    <p className="font-mono text-lg font-bold text-slate-900">
                                                        {
                                                            selectedGateway.account_number
                                                        }
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            selectedGateway.account_number,
                                                        );
                                                        setCopied(true);
                                                        setTimeout(
                                                            () =>
                                                                setCopied(
                                                                    false,
                                                                ),
                                                            2000,
                                                        );
                                                    }}
                                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                                >
                                                    {copied ? (
                                                        <Check
                                                            size={14}
                                                            className="text-emerald-600"
                                                        />
                                                    ) : (
                                                        <Copy size={14} />
                                                    )}
                                                    {copied
                                                        ? 'Tersalin'
                                                        : 'Salin'}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                                Upload Bukti Transfer
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        setData(
                                                            'proof_file',
                                                            e.target
                                                                .files?.[0] ||
                                                                null,
                                                        )
                                                    }
                                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                                />
                                            </div>
                                            {errors.proof_file && (
                                                <p className="mt-2 text-xs text-red-500">
                                                    {errors.proof_file}
                                                </p>
                                            )}
                                            <p className="mt-2 text-[11px] text-slate-500">
                                                Format: JPG, PNG maksimal 2MB.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                                        <p className="text-center text-sm font-medium text-indigo-700">
                                            Anda akan diarahkan ke halaman{' '}
                                            <b>{selectedGateway?.name}</b> untuk
                                            menyelesaikan pembayaran. (Mode
                                            Simulasi: Pembayaran akan langsung
                                            dianggap berhasil).
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-4">
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (selectedGateway?.provider ===
                                                'Manual' &&
                                                !data.proof_file)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Bayar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const PaymentHistory = ({ payments }: { payments: any[] }) => {
    return (
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    Riwayat Bayar & Invoice
                </h3>
                <a
                    href={PaymentHistoryController.download.url()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    title="Unduh riwayat pembayaran"
                >
                    <Download size={16} />
                    <span>Unduh Riwayat</span>
                </a>
            </div>
            {payments.length === 0 ? (
                <p className="py-8 text-center text-slate-500">
                    Belum ada riwayat pembayaran.
                </p>
            ) : (
                <div className="space-y-4">
                    {payments.map((p) => (
                        <div
                            key={p.id}
                            className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                        >
                            <div>
                                <p className="font-bold text-slate-900">
                                    INV-{p.id}{' '}
                                    <span className="font-normal text-slate-400">
                                        ({p.payment_method || 'Manual'})
                                    </span>
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {p.created_at
                                        ? new Date(
                                              p.created_at,
                                          ).toLocaleDateString('id-ID')
                                        : '-'}{' '}
                                    | Booking ID: BKG-{p.booking_id}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <StatusBadgeLocal status={p.status} />
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatRupiah(p.grand_total)}
                                    </p>
                                </div>
                                {p.status === 'Paid' && (
                                    <a
                                        href={InvoiceController.download.url(
                                            p.id,
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                        title="Download Invoice"
                                    >
                                        <Download size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
