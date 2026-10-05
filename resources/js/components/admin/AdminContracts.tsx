import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FileText, AlertTriangle, Search, X } from 'lucide-react';
import { Badge, Btn, SearchableSelect } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

export default function AdminContracts({ contracts }: { contracts: any[] }) {
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [extendBookingId, setExtendBookingId] = useState<number | null>(null);

    const {
        data: extendData,
        setData: setExtendData,
        post: postExtend,
        processing: extendProcessing,
        errors: extendErrors,
        reset: resetExtend,
    } = useForm({
        rent_type: 'Monthly',
        duration_month: '1',
        duration_days: '1',
        custom_price: '',
    });

    const submitExtend = (e: React.FormEvent) => {
        e.preventDefault();
        postExtend(`/admin/transactions/bookings/${extendBookingId}/extend`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsExtendOpen(false);
                resetExtend();
                setExtendBookingId(null);
            },
        });
    };

    const terminateContract = (contractId: number) => {
        const notes = prompt('Masukkan alasan terminasi (opsional):');
        if (notes !== null) {
            router.post(
                `/admin/transactions/contracts/${contractId}/terminate`,
                { notes },
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const isExpiringSoon = (endDate: string) => {
        const end = new Date(endDate || Date.now());
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    };

    const isExpired = (endDate: string) => {
        const end = new Date(endDate || Date.now());
        const today = new Date();
        return end < today;
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-5">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="relative max-w-xs flex-1">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari kontrak sewa..."
                        className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
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
                                    No Kontrak
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Penghuni
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Kamar
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Periode Sewa
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Sewa Per Bulan
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contracts?.length > 0 ? (
                                contracts.map(
                                    (contract: any, index: number) => {
                                        const expiring =
                                            contract.status === 'Active' &&
                                            isExpiringSoon(contract.end_date);
                                        const expired =
                                            contract.status === 'Active' &&
                                            isExpired(contract.end_date);

                                        return (
                                            <tr
                                                key={contract.id}
                                                className={`transition-colors hover:bg-slate-50/50 ${expiring ? 'bg-orange-50/30' : ''} ${expired ? 'bg-red-50/30' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-slate-900">
                                                        {
                                                            contract.contract_number
                                                        }
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Ref:{' '}
                                                        {
                                                            contract
                                                                .booking_header
                                                                ?.booking_no
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">
                                                        {contract.tenant
                                                            ?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {contract.tenant
                                                            ?.phone ||
                                                            contract.tenant
                                                                ?.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800">
                                                        {contract.room_type
                                                            ?.type_name ||
                                                            'Tipe Kamar'}
                                                    </div>
                                                    <div className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                                                        Unit:{' '}
                                                        {contract.room_unit
                                                            ?.unit_number ||
                                                            '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium">
                                                        {contract.start_date
                                                            ? new Date(
                                                                  contract.start_date,
                                                              ).toLocaleDateString()
                                                            : '-'}{' '}
                                                        -{' '}
                                                        {contract.end_date
                                                            ? new Date(
                                                                  contract.end_date,
                                                              ).toLocaleDateString()
                                                            : '-'}
                                                    </div>
                                                    {expiring && (
                                                        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-orange-600">
                                                            <AlertTriangle
                                                                size={12}
                                                            />{' '}
                                                            H-7 Berakhir
                                                        </div>
                                                    )}
                                                    {expired && (
                                                        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                                                            <AlertTriangle
                                                                size={12}
                                                            />{' '}
                                                            Sudah Lewat
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900">
                                                    {fmtIDR(
                                                        contract.monthly_price,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {contract.status ===
                                                    'Active' ? (
                                                        <Badge variant="success">
                                                            Aktif
                                                        </Badge>
                                                    ) : contract.status ===
                                                      'Terminated' ? (
                                                        <Badge variant="danger">
                                                            Terminasi
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            {contract.status}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    {contract.status ===
                                                        'Active' && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setExtendBookingId(
                                                                        contract.booking_header_id,
                                                                    );
                                                                    setIsExtendOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                                            >
                                                                Perpanjang
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    terminateContract(
                                                                        contract.id,
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                                                            >
                                                                Selesai /
                                                                Terminasi
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    },
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-8 text-center text-slate-500"
                                    >
                                        Belum ada data kontrak. aktif.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Extend Modal */}
            {isExtendOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Perpanjang Sewa
                            </h2>
                            <button
                                onClick={() => setIsExtendOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitExtend} className="space-y-4 p-5">
                            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                                Sistem akan otomatis membuat tagihan (invoice)
                                baru sejumlah durasi perpanjangan yang dipilih.
                                Tagihan dapat dibayar nanti secara manual.
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Tipe Perpanjangan
                                    </label>
                                    <SearchableSelect
                                        value={extendData.rent_type}
                                        onChange={(val) =>
                                            setExtendData(
                                                'rent_type',
                                                val as string,
                                            )
                                        }
                                        options={[
                                            {
                                                label: 'Bulanan',
                                                value: 'Monthly',
                                            },
                                            { label: 'Harian', value: 'Daily' },
                                        ]}
                                    />
                                    {extendErrors.rent_type && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {extendErrors.rent_type}
                                        </p>
                                    )}
                                </div>
                                {extendData.rent_type === 'Monthly' ? (
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            Durasi (Bulan)
                                        </label>
                                        <SearchableSelect
                                            value={extendData.duration_month}
                                            onChange={(val) =>
                                                setExtendData(
                                                    'duration_month',
                                                    val as string,
                                                )
                                            }
                                            options={[
                                                {
                                                    label: '1 Bulan',
                                                    value: '1',
                                                },
                                                {
                                                    label: '3 Bulan',
                                                    value: '3',
                                                },
                                                {
                                                    label: '6 Bulan',
                                                    value: '6',
                                                },
                                                {
                                                    label: '1 Tahun',
                                                    value: '12',
                                                },
                                            ]}
                                        />
                                        {extendErrors.duration_month && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {extendErrors.duration_month}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            Durasi (Hari)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={extendData.duration_days}
                                            onChange={(e) =>
                                                setExtendData(
                                                    'duration_days',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {extendErrors.duration_days && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {extendErrors.duration_days}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {extendData.rent_type === 'Daily' && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Harga Sewa Total (Manual)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Harga Sewa Total"
                                            value={
                                                extendData.custom_price
                                                    ? new Intl.NumberFormat(
                                                          'id-ID',
                                                      ).format(
                                                          Number(
                                                              extendData.custom_price,
                                                          ),
                                                      )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        '',
                                                    );
                                                setExtendData(
                                                    'custom_price',
                                                    val,
                                                );
                                            }}
                                            required
                                        />
                                    </div>
                                    {extendErrors.custom_price && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {extendErrors.custom_price}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Btn
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsExtendOpen(false)}
                                >
                                    Batal
                                </Btn>
                                <Btn
                                    variant="primary"
                                    type="submit"
                                    disabled={extendProcessing}
                                >
                                    Simpan Perpanjangan
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
