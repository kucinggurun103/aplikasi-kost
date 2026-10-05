import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Plus,
    CreditCard,
    Banknote,
    QrCode,
    Trash2,
    Edit2,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

export default function AdminPaymentConfig({
    gateways,
    branches = [],
}: {
    gateways: any[];
    branches?: any[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterBranch, setFilterBranch] = useState<string>('all');

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            branch_id: '',
            name: '',
            provider: 'midtrans',
            environment: 'sandbox',
            client_key: '',
            server_key: '',
            api_key: '',
            merchant_id: '',
            account_number: '',
            account_name: '',
            qr_image: null as File | null,
            is_active: true,
        });

    const displayedGateways = React.useMemo(() => {
        if (filterBranch === 'all') return gateways;

        const branchId = Number(filterBranch);
        const branchGateways = gateways.filter(
            (g: any) => g.branch_id === branchId,
        );
        const globalGateways = gateways.filter((g: any) => !g.branch_id);

        // Logika prioritas: Jika cabang memiliki metode pembayarannya sendiri, gunakan milik cabang.
        // Jika tidak ada, maka fallback (default) ke metode pembayaran global.
        if (branchGateways.length > 0) {
            return branchGateways;
        }

        return globalGateways;
    }, [gateways, filterBranch]);

    const openModal = (gateway: any = null) => {
        clearErrors();
        if (gateway) {
            setEditingId(gateway.id);
            setData({
                branch_id: gateway.branch_id || '',
                name: gateway.name,
                provider: gateway.provider,
                environment: gateway.environment || 'sandbox',
                client_key: gateway.client_key || '',
                server_key: gateway.server_key || '',
                api_key: gateway.api_key || '',
                merchant_id: gateway.merchant_id || '',
                account_number: gateway.account_number || '',
                account_name: gateway.account_name || '',
                qr_image: null,
                is_active: gateway.is_active,
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditingId(null);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            post(`/admin/settings/payment-gateways/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(`/admin/settings/payment-gateways`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteGateway = (id: number) => {
        if (confirm('Hapus metode pembayaran ini?')) {
            router.delete(`/admin/settings/payment-gateways/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Konfigurasi Payment Gateway & Transfer
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Atur metode pembayaran yang bisa digunakan oleh penyewa
                        (Midtrans, Manual Transfer, QRIS).
                    </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <div className="w-56">
                        <SearchableSelect
                            value={filterBranch}
                            onChange={(val) => setFilterBranch(val)}
                            options={[
                                { label: 'Semua Konfigurasi', value: 'all' },
                                ...branches?.map((b: any) => ({
                                    label: b.name,
                                    value: String(b.id),
                                })),
                            ]}
                        />
                    </div>
                    <Btn variant="primary" onClick={() => openModal()}>
                        <Plus size={16} className="mr-1.5" /> Tambah Metode
                    </Btn>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {displayedGateways?.map((gateway: any) => (
                    <div
                        key={gateway.id}
                        className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div
                            className={`absolute top-0 left-0 h-full w-1 ${gateway.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                        ></div>

                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-xl p-2.5 ${gateway.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    {gateway.provider === 'midtrans' ||
                                    gateway.provider === 'duitku' ? (
                                        <CreditCard size={20} />
                                    ) : gateway.provider === 'qris' ? (
                                        <QrCode size={20} />
                                    ) : (
                                        <Banknote size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="leading-tight font-bold text-slate-900">
                                        {gateway.name}
                                    </h3>
                                    <Badge
                                        variant={
                                            gateway.is_active
                                                ? 'success'
                                                : 'outline'
                                        }
                                        className="mt-1 text-[10px]"
                                    >
                                        {gateway.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => openModal(gateway)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => deleteGateway(gateway.id)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Cabang</span>
                                <span className="text-xs font-semibold text-slate-800">
                                    {gateway.branch ? (
                                        gateway.branch.name
                                    ) : (
                                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-600">
                                            Semua Cabang
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Provider</span>
                                <span className="text-xs font-semibold text-slate-800 uppercase">
                                    {gateway.provider}{' '}
                                    {gateway.provider === 'midtrans' ||
                                    gateway.provider === 'duitku'
                                        ? `(${gateway.environment || 'sandbox'})`
                                        : ''}
                                </span>
                            </div>

                            {gateway.provider === 'manual' && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            No. Rekening
                                        </span>
                                        <span className="font-medium text-slate-800">
                                            {gateway.account_number || '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            A/N
                                        </span>
                                        <span className="font-medium text-slate-800">
                                            {gateway.account_name || '-'}
                                        </span>
                                    </div>
                                </>
                            )}

                            {gateway.provider === 'qris' && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">
                                        QR Code
                                    </span>
                                    {gateway.qr_image_path ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                            <CheckCircle2 size={12} /> Terupload
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                                            <XCircle size={12} /> Belum ada
                                        </span>
                                    )}
                                </div>
                            )}

                            {(gateway.provider === 'midtrans' ||
                                gateway.provider === 'duitku') && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">
                                        Merchant ID
                                    </span>
                                    <span className="max-w-[120px] truncate text-xs font-medium text-slate-800">
                                        {gateway.merchant_id || '-'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {(!gateways || gateways.length === 0) && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-100 bg-white py-12 text-center text-slate-500">
                        Belum ada metode pembayaran yang dikonfigurasi.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? 'Edit Metode Pembayaran'
                                    : 'Tambah Metode Pembayaran'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitForm}
                            className="space-y-4 overflow-y-auto p-5"
                        >
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Cabang (Opsional)
                                </label>
                                <SearchableSelect
                                    value={data.branch_id}
                                    onChange={(val) =>
                                        setData('branch_id', val)
                                    }
                                    options={[
                                        {
                                            label: 'Semua Cabang (Global)',
                                            value: '',
                                        },
                                        ...branches?.map((b: any) => ({
                                            label: b.name,
                                            value: String(b.id),
                                        })),
                                    ]}
                                    placeholder="Pilih Cabang..."
                                />
                                <p className="mt-1 text-[10px] text-slate-500">
                                    Pilih "Semua Cabang" jika metode ini berlaku
                                    untuk seluruh properti.
                                </p>
                                {errors.branch_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Nama Metode (Tampil di Pengguna)
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nama Metode Pembayaran"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Jenis Provider
                                </label>
                                <SearchableSelect
                                    value={data.provider}
                                    onChange={(val) => setData('provider', val)}
                                    options={[
                                        {
                                            label: 'Midtrans (Payment Gateway)',
                                            value: 'midtrans',
                                        },
                                        {
                                            label: 'Duitku (Payment Gateway)',
                                            value: 'duitku',
                                        },
                                        {
                                            label: 'Manual Transfer (Bank)',
                                            value: 'manual',
                                        },
                                        {
                                            label: 'QRIS Statik (Upload Gambar)',
                                            value: 'qris',
                                        },
                                    ]}
                                />
                            </div>

                            {(data.provider === 'midtrans' ||
                                data.provider === 'duitku') && (
                                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                                            API Credentials
                                        </h4>
                                        <div className="w-40">
                                            <SearchableSelect
                                                value={data.environment}
                                                onChange={(val) =>
                                                    setData('environment', val)
                                                }
                                                options={[
                                                    {
                                                        label: 'Sandbox (Testing)',
                                                        value: 'sandbox',
                                                    },
                                                    {
                                                        label: 'Production (Live)',
                                                        value: 'production',
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {data.provider === 'midtrans' && (
                                        <>
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    Merchant ID
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                                    value={data.merchant_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            'merchant_id',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    Client Key
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                                    value={data.client_key}
                                                    onChange={(e) =>
                                                        setData(
                                                            'client_key',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    Server Key (Rahasia)
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Server Key / Secret Key"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                                    value={data.server_key}
                                                    onChange={(e) =>
                                                        setData(
                                                            'server_key',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    {data.provider === 'duitku' && (
                                        <>
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    Merchant Code
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                                    value={data.merchant_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            'merchant_id',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    API Key (Rahasia)
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Client Key / API Key"
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                                    value={data.api_key}
                                                    onChange={(e) =>
                                                        setData(
                                                            'api_key',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {data.provider === 'manual' && (
                                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                                        Informasi Rekening
                                    </h4>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Nomor Rekening
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nomor Rekening / Tujuan"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            value={data.account_number}
                                            onChange={(e) =>
                                                setData(
                                                    'account_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Atas Nama (A/N)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Atas Nama (A/N)"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            value={data.account_name}
                                            onChange={(e) =>
                                                setData(
                                                    'account_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {data.provider === 'qris' && (
                                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                                        Gambar QRIS
                                    </h4>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Upload QR Code Baru
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) =>
                                                setData(
                                                    'qr_image',
                                                    e.target.files
                                                        ? e.target.files[0]
                                                        : null,
                                                )
                                            }
                                        />
                                        {errors.qr_image && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.qr_image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Aktifkan metode pembayaran ini
                                </label>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Btn
                                    variant="outline"
                                    type="button"
                                    onClick={closeModal}
                                >
                                    Batal
                                </Btn>
                                <Btn
                                    variant="primary"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Simpan Konfigurasi
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
