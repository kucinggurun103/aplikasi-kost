import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Wallet, Search, CheckCircle2 } from 'lucide-react';
import { fmtIDR } from '@/components/cozqta/data';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminDeposits({ deposits }: { deposits: any[] }) {
    const [activeTab, setActiveTab] = useState<'Held' | 'Refunded'>('Held');

    const refundDeposit = (bookingId: number) => {
        if (
            confirm(
                'Konfirmasi bahwa deposit ini telah dikembalikan (Refund) ke penyewa?',
            )
        ) {
            router.post(
                `/admin/transactions/bookings/${bookingId}/refund-deposit`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // Status defaults to Held if null or empty
    const getStatus = (dep: any) =>
        dep.deposit_status === 'Refunded' ? 'Refunded' : 'Held';

    const heldDeposits =
        deposits?.filter((dep) => getStatus(dep) === 'Held') || [];
    const refundedDeposits =
        deposits?.filter((dep) => getStatus(dep) === 'Refunded') || [];

    const displayedDeposits =
        activeTab === 'Held' ? heldDeposits : refundedDeposits;

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Manajemen Deposit
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Pantau uang deposit penghuni yang ditahan dan
                            riwayat refund.
                        </p>
                    </div>
                </div>
                <div className="relative hidden w-full max-w-xs md:block">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari penyewa atau kamar..."
                        className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('Held')}
                    className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${
                        activeTab === 'Held'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Deposit Ditahan ({heldDeposits.length})
                </button>
                <button
                    onClick={() => setActiveTab('Refunded')}
                    className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${
                        activeTab === 'Refunded'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Riwayat Refund ({refundedDeposits.length})
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
                                    ID Booking
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Penyewa
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Kamar / Cabang
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Jumlah Deposit
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Status Booking
                                </th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayedDeposits.length > 0 ? (
                                displayedDeposits.map(
                                    (dep: any, index: number) => (
                                        <tr
                                            key={dep.id}
                                            className="transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-indigo-600">
                                                    {dep.booking_no}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {dep.created_at
                                                        ? new Date(
                                                              dep.created_at,
                                                          ).toLocaleDateString()
                                                        : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">
                                                    {dep.tenant?.name ||
                                                        'Unknown'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {dep.tenant?.phone ||
                                                        dep.tenant?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">
                                                    {dep.room_unit
                                                        ?.unit_number || '-'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {dep.branch?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold whitespace-nowrap text-slate-900">
                                                {fmtIDR(dep.deposit)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                                    {dep.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {activeTab === 'Held' ? (
                                                    <button
                                                        onClick={() =>
                                                            refundDeposit(
                                                                dep.id,
                                                            )
                                                        }
                                                        className="ml-auto flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
                                                    >
                                                        <CheckCircle2
                                                            size={14}
                                                        />{' '}
                                                        Tandai Refund
                                                    </button>
                                                ) : (
                                                    <span className="mt-1 block text-right text-xs font-semibold text-slate-500">
                                                        Di-refund pada:{' '}
                                                        {dep.deposit_refunded_at
                                                            ? new Date(
                                                                  dep.deposit_refunded_at,
                                                              ).toLocaleDateString()
                                                            : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Wallet
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
                                        Tidak ada data deposit di kategori ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
