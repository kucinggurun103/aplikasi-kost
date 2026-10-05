import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Search, Plus, Upload, X, Edit2, Calendar } from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

import Swal from 'sweetalert2';

export default function AdminBookings({
    bookings,
    branches,
    roomTypes,
    users,
}: {
    bookings: any[];
    branches: any[];
    roomTypes: any[];
    users: any[];
}) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Modals state
    const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
    const [isManualPayOpen, setIsManualPayOpen] = useState(false);
    const [payBookingId, setPayBookingId] = useState<number | null>(null);
    const [payPaymentId, setPayPaymentId] = useState<number | null>(null);
    const [chkDp, setChkDp] = useState(false);
    const [chkDeposit, setChkDeposit] = useState(false);
    const [chkCf, setChkCf] = useState(false);

    // Invoices Modal
    const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<any>(null);

    // Image Preview Modal
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Manual Booking Branch Filter
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');

    const {
        data: bookingData,
        setData: setBookingData,
        post: postBooking,
        processing: bookingProcessing,
        errors: bookingErrors,
        reset: resetBooking,
    } = useForm({
        tenant_id: '',
        room_type_id: '',
        check_in_date: '',
        rent_type: 'Monthly',
        duration_month: '1',
        duration_days: '1',
        custom_price: '',
        payment_proof: null as File | null,
    });

    // Calculate checkout date based on form state
    const getCheckoutDate = () => {
        if (!bookingData.check_in_date) return '-';
        const checkIn = new Date(bookingData.check_in_date || Date.now());
        if (bookingData.rent_type === 'Monthly') {
            checkIn.setMonth(
                checkIn.getMonth() +
                    parseInt(bookingData.duration_month || '1'),
            );
        } else {
            checkIn.setDate(
                checkIn.getDate() + parseInt(bookingData.duration_days || '1'),
            );
        }
        return checkIn.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Manual Pay Form
    const {
        data: payData,
        setData: setPayData,
        post: postPay,
        processing: payProcessing,
        errors: payErrors,
        reset: resetPay,
    } = useForm({
        payment_proof: null as File | null,
        payment_id: '' as string | number,
    });

    const updateStatus = async (bookingId: number, status: string) => {
        const result = await Swal.fire({
            title: 'Konfirmasi',
            text: `Ubah status booking menjadi ${status}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Ubah Status',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            router.put(
                `/admin/transactions/bookings/${bookingId}/status`,
                { status },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Status booking berhasil diubah.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                },
            );
        }
    };

    const submitManualBooking = (e: React.FormEvent) => {
        e.preventDefault();
        postBooking('/admin/transactions/bookings/manual', {
            preserveScroll: true,
            onSuccess: () => {
                setIsManualBookingOpen(false);
                resetBooking();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Booking manual berhasil dibuat.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    const submitManualPay = (e: React.FormEvent) => {
        e.preventDefault();
        postPay(`/admin/transactions/bookings/${payBookingId}/manual-pay`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsManualPayOpen(false);
                resetPay();
                setPayBookingId(null);
                setPayPaymentId(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Pembayaran manual berhasil diproses.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    const openInvoicesModal = (booking: any) => {
        setCurrentBooking(booking);
        setIsInvoicesModalOpen(true);
    };

    const openManualPayForInvoice = (bookingId: number, paymentId: number) => {
        setPayBookingId(bookingId);
        setPayPaymentId(paymentId);
        setPayData('payment_id', paymentId);
        setChkDp(false);
        setChkDeposit(false);
        setChkCf(false);
        setIsManualPayOpen(true);
    };

    // (Removed openManualPay)

    const getStatusBadge = (status: string, paymentStatus: string) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="warning">Menunggu Konfirmasi</Badge>;
            case 'Confirmed':
                return paymentStatus !== 'Paid' ? (
                    <Badge variant="success">
                        Di-Acc (Menunggu Pembayaran)
                    </Badge>
                ) : (
                    <Badge variant="success">Terkonfirmasi (Lunas)</Badge>
                );
            case 'Checked In':
                return <Badge variant="success">Aktif (Check-in)</Badge>;
            case 'Completed':
                return <Badge variant="outline">Selesai</Badge>;
            case 'Cancelled':
                return <Badge variant="danger">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const tenantUsers =
        users?.filter((u: any) => {
            const roles = u.roles || [];
            if (
                roles.some(
                    (r: any) => r.code === 'penghuni' || r.name === 'Penghuni',
                )
            )
                return true;
            if (
                !roles.some(
                    (r: any) => r.code === 'admin' || r.code === 'operator',
                )
            )
                return true;
            return false;
        }) || [];

    return (
        <div className="animate-fade-in relative mx-auto w-full max-w-7xl space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="relative max-w-xs flex-1">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari pemesanan..."
                        className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => setIsManualBookingOpen(true)}
                >
                    <Plus size={14} /> Booking Manual
                </Btn>
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
                                    Tanggal Check-in
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Total Harga
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Status Pembayaran
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
                            {bookings?.length > 0 ? (
                                bookings.map((booking: any, index: number) => (
                                    <tr
                                        key={booking.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-indigo-600">
                                                {booking.booking_no}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {booking.created_at
                                                    ? new Date(
                                                          booking.created_at,
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">
                                                {booking.tenant?.name ||
                                                    'Unknown'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {booking.tenant?.phone ||
                                                    booking.tenant?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">
                                                {booking.room_type?.type_name ||
                                                    'Tipe Kamar'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {booking.branch?.name || '-'}
                                            </div>
                                            {booking.room_unit ? (
                                                <div className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                                                    Unit:{' '}
                                                    {
                                                        booking.room_unit
                                                            .unit_number
                                                    }
                                                </div>
                                            ) : (
                                                <div className="mt-1 text-xs text-orange-500">
                                                    Unit belum dialokasi
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">
                                                {booking.check_in_date
                                                    ? new Date(
                                                          booking.check_in_date,
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {booking.rent_type === 'Daily'
                                                    ? `${booking.duration_days} Hari`
                                                    : `${booking.duration_month} Bulan`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900">
                                            {fmtIDR(booking.grand_total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {booking.payment_status ===
                                            'Paid' ? (
                                                <Badge variant="success">
                                                    Lunas
                                                </Badge>
                                            ) : booking.payment_status ===
                                              'Unpaid' ? (
                                                <Badge variant="danger">
                                                    Belum Dibayar
                                                </Badge>
                                            ) : booking.payment_status ===
                                              'Pending' ? (
                                                <Badge variant="warning">
                                                    Mengecek Pembayaran
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning">
                                                    {booking.payment_status}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(
                                                booking.status,
                                                booking.payment_status,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openInvoicesModal(
                                                            booking,
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                                >
                                                    Lihat Tagihan
                                                </button>

                                                {booking.status ===
                                                    'Confirmed' &&
                                                    booking.payment_status ===
                                                        'Paid' && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    booking.id,
                                                                    'Checked In',
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-100"
                                                        >
                                                            Check In
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Calendar
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Booking Modal */}
            {isManualBookingOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Buat Booking Manual
                            </h2>
                            <button
                                onClick={() => setIsManualBookingOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={submitManualBooking}
                            className="space-y-4 overflow-y-auto p-5"
                        >
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Pilih Penghuni (User)
                                </label>
                                <SearchableSelect
                                    value={bookingData.tenant_id}
                                    onChange={(val) =>
                                        setBookingData('tenant_id', val)
                                    }
                                    options={[
                                        {
                                            label: '-- Pilih Penghuni --',
                                            value: '',
                                        },
                                        ...tenantUsers.map((u: any) => ({
                                            label: `${u.name} (${u.email})`,
                                            value: String(u.id),
                                        })),
                                    ]}
                                />
                                {bookingErrors.tenant_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {bookingErrors.tenant_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Pilih Cabang
                                </label>
                                <SearchableSelect
                                    value={selectedBranchId}
                                    onChange={(val) => {
                                        setSelectedBranchId(val);
                                        setBookingData('room_type_id', ''); // reset room type when branch changes
                                    }}
                                    options={[
                                        {
                                            label: '-- Pilih Cabang --',
                                            value: '',
                                        },
                                        ...branches?.map((b: any) => ({
                                            label: b.name,
                                            value: String(b.id),
                                        })),
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Tipe Kamar
                                </label>
                                <SearchableSelect
                                    value={bookingData.room_type_id}
                                    onChange={(val) =>
                                        setBookingData('room_type_id', val)
                                    }
                                    options={[
                                        {
                                            label: '-- Pilih Tipe Kamar --',
                                            value: '',
                                        },
                                        ...roomTypes
                                            ?.filter(
                                                (rt: any) =>
                                                    !selectedBranchId ||
                                                    String(rt.branch_id) ===
                                                        selectedBranchId,
                                            )
                                            .map((rt: any) => ({
                                                label: `${rt.type_name} - ${rt.branch?.name}`,
                                                value: String(rt.id),
                                            })),
                                    ]}
                                />
                                {bookingErrors.room_type_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {bookingErrors.room_type_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Tipe Sewa
                                    </label>
                                    <SearchableSelect
                                        value={bookingData.rent_type}
                                        onChange={(val) =>
                                            setBookingData('rent_type', val)
                                        }
                                        options={[
                                            {
                                                label: 'Bulanan',
                                                value: 'Monthly',
                                            },
                                            { label: 'Harian', value: 'Daily' },
                                        ]}
                                    />
                                    {bookingErrors.rent_type && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {bookingErrors.rent_type}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Tanggal Check-in
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={bookingData.check_in_date}
                                        onChange={(e) =>
                                            setBookingData(
                                                'check_in_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {bookingErrors.check_in_date && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {bookingErrors.check_in_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {bookingData.rent_type === 'Monthly' ? (
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                            Durasi (Bulan)
                                        </label>
                                        <SearchableSelect
                                            value={bookingData.duration_month}
                                            onChange={(val) =>
                                                setBookingData(
                                                    'duration_month',
                                                    val,
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
                                        {bookingErrors.duration_month && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {bookingErrors.duration_month}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                Durasi (Hari)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={
                                                    bookingData.duration_days
                                                }
                                                onChange={(e) =>
                                                    setBookingData(
                                                        'duration_days',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {bookingErrors.duration_days && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {
                                                        bookingErrors.duration_days
                                                    }
                                                </p>
                                            )}
                                        </div>
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
                                                    placeholder="Misal: 300.000"
                                                    value={
                                                        bookingData.custom_price
                                                            ? new Intl.NumberFormat(
                                                                  'id-ID',
                                                              ).format(
                                                                  Number(
                                                                      bookingData.custom_price,
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
                                                        setBookingData(
                                                            'custom_price',
                                                            val,
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>
                                            {bookingErrors.custom_price && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {bookingErrors.custom_price}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Estimasi Tanggal Check-out:
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                        {getCheckoutDate()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Btn
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                        setIsManualBookingOpen(false)
                                    }
                                >
                                    Batal
                                </Btn>
                                <Btn
                                    variant="primary"
                                    type="submit"
                                    disabled={bookingProcessing}
                                >
                                    Simpan Booking
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manual Pay Modal */}
            {isManualPayOpen && (
                <div className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Konfirmasi Pembayaran Manual
                            </h2>
                            <button
                                onClick={() => setIsManualPayOpen(false)}
                                className="text-slate-400 transition-colors hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={submitManualPay}
                            className="space-y-4 p-5"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Bukti Pembayaran (Opsional)
                                </label>
                                <div className="group relative mt-1 flex cursor-pointer justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 pt-5 pb-6 transition-colors hover:border-indigo-500">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                        <div className="flex justify-center text-sm text-slate-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500"
                                            >
                                                <span>Upload file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="sr-only"
                                                    onChange={(e) =>
                                                        setPayData(
                                                            'payment_proof',
                                                            e.target
                                                                .files?.[0] ||
                                                                null,
                                                        )
                                                    }
                                                />
                                            </label>
                                            <p className="pl-1">
                                                atau drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            PNG, JPG, PDF up to 2MB
                                        </p>
                                        {payData.payment_proof && (
                                            <p className="mt-2 text-sm font-medium text-indigo-600">
                                                {payData.payment_proof.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {payErrors.payment_proof && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {payErrors.payment_proof}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="mb-2 text-xs font-bold text-slate-700">
                                    Verifikasi Admin
                                </p>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={chkDp}
                                        onChange={(e) =>
                                            setChkDp(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                        Saya telah memverifikasi tagihan sewa /
                                        DP (Checked DP)
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={chkDeposit}
                                        onChange={(e) =>
                                            setChkDeposit(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                        Saya telah memverifikasi nominal deposit
                                        (Checked Deposit)
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={chkCf}
                                        onChange={(e) =>
                                            setChkCf(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                        Uang telah masuk ke mutasi rekening (CF
                                        Pembayaran)
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsManualPayOpen(false)}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <Btn
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        payProcessing ||
                                        !chkDp ||
                                        !chkDeposit ||
                                        !chkCf
                                    }
                                >
                                    {payProcessing
                                        ? 'Menyimpan...'
                                        : 'Konfirmasi Pembayaran'}
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invoices Modal */}
            {isInvoicesModalOpen && currentBooking && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Rincian Tagihan (Invoices)
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Booking: {currentBooking.booking_no}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsInvoicesModalOpen(false)}
                                className="text-slate-400 transition-colors hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5">
                            <div className="overflow-hidden overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold text-slate-700">
                                                No
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-700">
                                                No. Tagihan
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-700">
                                                Tenggat Waktu
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-700">
                                                Nominal
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-slate-700">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentBooking.payment_headers &&
                                        currentBooking.payment_headers.length >
                                            0 ? (
                                            currentBooking.payment_headers.map(
                                                (inv: any, index: number) => (
                                                    <tr key={inv.id}>
                                                        <td className="px-4 py-3 text-slate-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-slate-900">
                                                            {inv.payment_no}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <span>
                                                                    {inv.due_date
                                                                        ? new Date(
                                                                              inv.due_date,
                                                                          ).toLocaleDateString()
                                                                        : '-'}
                                                                </span>
                                                                {inv.status !==
                                                                    'Paid' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const newDate =
                                                                                prompt(
                                                                                    'Ubah Tanggal Jatuh Tempo (YYYY-MM-DD):',
                                                                                    inv.due_date.split(
                                                                                        'T',
                                                                                    )[0],
                                                                                );
                                                                            if (
                                                                                newDate
                                                                            ) {
                                                                                router.put(
                                                                                    `/admin/transactions/bookings/invoice/${inv.id}/due-date`,
                                                                                    {
                                                                                        due_date:
                                                                                            newDate,
                                                                                    },
                                                                                    {
                                                                                        preserveScroll: true,
                                                                                    },
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="text-slate-400 transition-colors hover:text-indigo-600"
                                                                        title="Ubah Jatuh Tempo"
                                                                    >
                                                                        <Edit2
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-indigo-600">
                                                            {fmtIDR(
                                                                inv.grand_total,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {inv.status ===
                                                            'Paid' ? (
                                                                <Badge variant="success">
                                                                    Lunas
                                                                </Badge>
                                                            ) : inv.status ===
                                                              'Pending' ? (
                                                                <Badge variant="warning">
                                                                    Verifikasi
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="danger">
                                                                    Belum Lunas
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {inv.status !==
                                                                'Paid' && (
                                                                <button
                                                                    onClick={() =>
                                                                        openManualPayForInvoice(
                                                                            currentBooking.id,
                                                                            inv.id,
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100"
                                                                >
                                                                    Bayar Manual
                                                                </button>
                                                            )}
                                                            {inv.status ===
                                                                'Paid' &&
                                                                inv.proof_of_payment && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setPreviewImage(
                                                                                `/storage/${inv.proof_of_payment}`,
                                                                            )
                                                                        }
                                                                        className="mt-1 ml-2 inline-block cursor-pointer text-xs text-indigo-600 hover:underline"
                                                                    >
                                                                        Lihat
                                                                        Bukti
                                                                    </button>
                                                                )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-8 text-center text-slate-500"
                                                >
                                                    Tidak ada tagihan ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 rounded-full bg-slate-800/50 p-2 text-white transition-colors hover:text-slate-300"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <img
                            src={previewImage}
                            alt="Bukti Pembayaran"
                            className="h-auto max-h-[85vh] w-auto max-w-full rounded-lg bg-white object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
