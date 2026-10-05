import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Receipt, Search, CheckCircle2, X } from 'lucide-react';
import { Btn, Badge } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

import Swal from 'sweetalert2';

export default function AdminInvoices({ invoices }: { invoices: any[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'DP' | 'Sewa' | 'Riwayat'>('DP');

    const approvePayment = async (bookingId: number, paymentId: number) => {
        const result = await Swal.fire({
            title: 'Konfirmasi',
            text: 'Konfirmasi bahwa tagihan ini telah dibayar Lunas?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Konfirmasi Lunas',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            router.post(
                `/admin/transactions/bookings/${bookingId}/manual-pay`,
                { payment_id: paymentId },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Tagihan telah diverifikasi sebagai Lunas.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                },
            );
        }
    };

    const getInvoiceCategory = (inv: any) => {
        const parts = inv.payment_no ? inv.payment_no.split('-') : [];
        let paymentCount = 1;
        if (parts.length >= 4) {
            paymentCount = parseInt(parts[parts.length - 1], 10) || 1;
        }
        const hasDP = (inv.booking?.room_type?.booking_price || 0) > 0;

        if (hasDP && paymentCount === 1) return 'DP';
        return 'Sewa';
    };

    const dpInvoices =
        invoices?.filter(
            (inv) =>
                inv.status === 'Pending' && getInvoiceCategory(inv) === 'DP',
        ) || [];
    const sewaInvoices =
        invoices?.filter(
            (inv) =>
                inv.status === 'Pending' && getInvoiceCategory(inv) === 'Sewa',
        ) || [];
    const riwayatInvoices =
        invoices?.filter((inv) => inv.status !== 'Pending') || [];

    const displayedInvoices =
        activeTab === 'DP'
            ? dpInvoices
            : activeTab === 'Sewa'
              ? sewaInvoices
              : riwayatInvoices;

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Tagihan & Invoice Pending
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Pantau dan verifikasi pembayaran tagihan dari
                            penyewa.
                        </p>
                    </div>
                </div>
                <div className="relative hidden w-full max-w-xs md:block">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari invoice atau penyewa..."
                        className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('DP')}
                    className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${
                        activeTab === 'DP'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Antrian Verifikasi DP ({dpInvoices.length})
                </button>
                <button
                    onClick={() => setActiveTab('Sewa')}
                    className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${
                        activeTab === 'Sewa'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Antrian Verifikasi Sewa / Deposit ({sewaInvoices.length})
                </button>
                <button
                    onClick={() => setActiveTab('Riwayat')}
                    className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${
                        activeTab === 'Riwayat'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Riwayat Pembayaran & Perpanjangan ({riwayatInvoices.length})
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 font-medium text-slate-600">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    No
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    No. Tagihan
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Penyewa
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Rincian Sewa
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Total Tagihan
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Metode
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Bukti Transfer
                                </th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayedInvoices.length > 0 ? (
                                displayedInvoices.map(
                                    (invoice: any, index: number) => (
                                        <tr
                                            key={invoice.id}
                                            className="transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-indigo-600">
                                                    {invoice.payment_no}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {invoice.created_at
                                                        ? new Date(
                                                              invoice.created_at,
                                                          ).toLocaleDateString()
                                                        : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">
                                                    {invoice.booking?.tenant
                                                        ?.name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {invoice.booking?.tenant
                                                        ?.phone ||
                                                        invoice.booking?.tenant
                                                            ?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">
                                                    {invoice.booking?.room_type
                                                        ?.type_name || '-'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {invoice.booking?.branch
                                                        ?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold whitespace-nowrap text-slate-900">
                                                {fmtIDR(invoice.grand_total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                                    {invoice.payment_method ||
                                                        'Menunggu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {invoice.proof_of_payment ? (
                                                    <button
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                `/storage/${invoice.proof_of_payment}`,
                                                            )
                                                        }
                                                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                                                    >
                                                        Lihat Bukti
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        Belum ada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {activeTab === 'Riwayat' ? (
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-bold ${
                                                            invoice.status ===
                                                            'Paid'
                                                                ? 'bg-green-100 text-green-700'
                                                                : invoice.status ===
                                                                    'Failed'
                                                                  ? 'bg-red-100 text-red-700'
                                                                  : 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {invoice.status ===
                                                        'Paid'
                                                            ? 'Lunas'
                                                            : invoice.status ===
                                                                'Failed'
                                                              ? 'Gagal'
                                                              : invoice.status}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            approvePayment(
                                                                invoice.booking_header_id,
                                                                invoice.id,
                                                            )
                                                        }
                                                        className="ml-auto flex items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-colors hover:bg-green-100"
                                                    >
                                                        <CheckCircle2
                                                            size={14}
                                                        />{' '}
                                                        Konfirmasi Lunas
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Receipt
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
                                        Tidak ada antrian tagihan pending di
                                        kategori ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedImage && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4">
                            <h3 className="font-bold text-slate-900">
                                Bukti Transfer
                            </h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-50 p-4">
                            <img
                                src={selectedImage}
                                alt="Bukti Transfer"
                                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
