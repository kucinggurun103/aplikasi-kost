import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { FileText, BedDouble, Calendar, Receipt, CreditCard, Star, File as FileIcon, Download, AlertCircle, CheckCircle2, X, Copy, Check, UploadCloud } from 'lucide-react';
import { Btn } from '@/components/cozqta/primitives';


export const StatusBadgeLocal = ({ status }: { status: string }) => {
    let color = 'bg-slate-100 text-slate-700';
    if (['paid', 'completed', 'active', 'checked in'].includes(status.toLowerCase())) color = 'bg-emerald-100 text-emerald-700';
    if (['pending'].includes(status.toLowerCase())) color = 'bg-amber-100 text-amber-700';
    if (['cancelled', 'failed'].includes(status.toLowerCase())) color = 'bg-red-100 text-red-700';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
};

export const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

export const ActiveContract = ({ contract }: { contract: any }) => {
    if (!contract) return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak Ada Kontrak Aktif</h3>
            <p className="text-slate-500">Anda belum memiliki kontrak sewa yang sedang berjalan.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 text-lg">Kontrak Sewa Aktif</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Nomor Kontrak</p>
                    <p className="font-semibold text-slate-900">{contract.contract_number}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Cabang</p>
                    <p className="font-semibold text-slate-900">{contract.booking_header?.room_type?.branch?.name || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Kamar</p>
                    <p className="font-semibold text-slate-900">{contract.booking_header?.room_unit?.unit_number || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Tanggal Mulai</p>
                    <p className="font-semibold text-slate-900">{contract.start_date ? new Date(contract.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Tanggal Selesai</p>
                    <p className="font-semibold text-slate-900">{contract.end_date ? new Date(contract.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <StatusBadgeLocal status={contract.status} />
                </div>
            </div>
            {contract.contract_file_path && (
                <div className="pt-4 border-t border-slate-100">
                    <a href={`/storage/${contract.contract_file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                        <FileIcon className="w-4 h-4" />
                        Unduh Dokumen Kontrak PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export const RoomDetails = ({ contract }: { contract: any }) => {
    if (!contract || !contract.booking_header?.room_type) return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Kamar Belum Tersedia</h3>
            <p className="text-slate-500">Informasi unit kamar akan muncul setelah Anda memiliki penyewaan yang aktif.</p>
        </div>
    );

    const roomType = contract.booking_header.room_type;
    const roomUnit = contract.booking_header.room_unit;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 text-lg">Detail Unit Kamar</h3>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Cabang</p>
                        <p className="font-bold text-slate-900 text-lg">{roomType.branch?.name}</p>
                        <p className="text-sm text-slate-500">{roomType.branch?.address}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Tipe & Nomor Kamar</p>
                        <p className="font-bold text-slate-900">{roomType.type_name} - {roomUnit?.unit_number || 'Belum Dialokasi'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-2">Fasilitas Kamar</p>
                        <div className="flex flex-wrap gap-2">
                            {roomType.facilities?.map((fac: any) => (
                                <span key={fac.id} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                                    {fac.name}
                                </span>
                            ))}
                            {(!roomType.facilities || roomType.facilities.length === 0) && (
                                <span className="text-sm text-slate-400">Belum ada data fasilitas</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {roomType.rules && (
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-2">Peraturan Kamar</p>
                    <div className="text-sm text-slate-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: roomType.rules }} />
                </div>
            )}
        </div>
    );
};

export const BookingHistory = ({ bookings }: { bookings: any[] }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 text-lg">Riwayat Booking</h3>
            {bookings.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Belum ada riwayat booking.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => (
                        <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-xl gap-4 hover:border-indigo-100 transition-colors">
                            <div>
                                <p className="font-bold text-slate-900">{b.room_unit?.unit_number ? `Kamar ${b.room_unit.unit_number} - ` : ''}{b.room_type?.name} di {b.room_type?.branch?.name}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Check In: {b.check_in_date ? new Date(b.check_in_date).toLocaleDateString('id-ID') : '-'} |
                                    ID: BKG-{b.id}
                                </p>
                            </div>
                            <div className="text-right">
                                <StatusBadgeLocal status={b.status} />
                                <p className="text-sm font-semibold text-indigo-600 mt-2">{formatRupiah(b.grand_total)}</p>
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
        return paymentGateways.filter((g: any) => !g.branch_id || g.branch_id === branchId);
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
        const available = paymentGateways.filter((g: any) => !g.branch_id || g.branch_id === branchId);
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
        const url = isManual ? '/payments/upload-proof' : '/payments/simulate-gateway';
        
        post(url, {
            onSuccess: () => closeModal(),
        });
    };

    const selectedGateway = filteredGateways.find((g: any) => g.id === selectedMethod) || filteredGateways[0];

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
            if (paymentCount === 2) return `Tagihan Sewa Bulan 1 ${hasDeposit ? '+ Deposit' : ''}`;
            return `Tagihan Sewa Bulan ${paymentCount - 1}`;
        } else {
            if (paymentCount === 1) return `Tagihan Sewa Bulan 1 ${hasDeposit ? '+ Deposit' : ''}`;
            return `Tagihan Sewa Bulan ${paymentCount}`;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 text-lg">Tagihan Bulan Ini</h3>
            {invoices.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <p className="text-slate-500">Hebat! Anda tidak memiliki tagihan tertunggak.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {invoices.map(inv => (
                        <div key={inv.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 rounded-xl gap-4 ${inv.status === 'Pending' ? 'border-blue-100 bg-blue-50/30' : 'border-amber-100 bg-amber-50/30'}`}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${inv.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {inv.status === 'Pending' ? 'MENUNGGU VERIFIKASI' : 'BELUM DIBAYAR'}
                                    </span>
                                    <p className="font-bold text-slate-900">INV-{inv.id}</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-800">{getInvoiceDescription(inv)}</p>
                                <p className="text-xs text-slate-600">{inv.booking?.room_type?.branch?.name} - {inv.booking?.room_unit?.unit_number ? `Kamar ${inv.booking.room_unit.unit_number}` : inv.booking?.room_type?.name}</p>
                                <p className="text-xs text-slate-500 mt-1">Dibuat: {inv.created_at ? new Date(inv.created_at).toLocaleDateString('id-ID') : '-'}</p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                                <p className={`text-lg font-bold ${inv.status === 'Pending' ? 'text-blue-600' : 'text-amber-600'}`}>{formatRupiah(inv.grand_total)}</p>
                                {inv.status === 'Pending' ? (
                                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg text-center w-full sm:w-auto">
                                        Menunggu ACC Admin
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => openModal(inv)}
                                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto text-sm"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900">Pembayaran Tagihan INV-{selectedInvoice.id}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border border-slate-200">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="bg-indigo-50/50 rounded-xl p-4 mb-6 border border-indigo-100">
                                <div className="space-y-2 mb-3 pb-3 border-b border-indigo-100 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>{getInvoiceDescription(selectedInvoice)}</span>
                                        <span className="font-semibold text-slate-900">{formatRupiah(selectedInvoice.subtotal)}</span>
                                    </div>
                                    {selectedInvoice.admin_fee > 0 && (
                                        <div className="flex justify-between text-slate-600">
                                            <span>Biaya Layanan Admin</span>
                                            <span className="font-semibold text-slate-900">{formatRupiah(selectedInvoice.admin_fee)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-indigo-600 font-semibold mb-1">Total Dibayar</p>
                                    <p className="text-2xl font-bold text-slate-900">{formatRupiah(selectedInvoice.grand_total)}</p>
                                </div>
                            </div>

                            <form onSubmit={submitPayment} className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Pilih Bank Tujuan / Metode Pembayaran</label>
                                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
                                        {filteredGateways.length === 0 ? (
                                            <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                                                Belum ada metode pembayaran yang tersedia untuk cabang ini.
                                            </div>
                                        ) : filteredGateways.map((gateway: any) => (
                                            <button
                                                type="button"
                                                key={gateway.id}
                                                onClick={() => {
                                                    setSelectedMethod(gateway.id);
                                                    setData('method_id', gateway.id);
                                                    if (gateway.provider?.toLowerCase() !== 'manual') {
                                                        setData('proof_file', null);
                                                    }
                                                }}
                                                className={`p-3 border-2 rounded-xl text-left transition-colors flex items-start gap-3 ${
                                                    data.method_id === gateway.id 
                                                    ? 'border-indigo-600 bg-indigo-50/50' 
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-900">{gateway.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{gateway.provider?.toLowerCase() === 'manual' ? `A.n. ${gateway.account_name}` : `Provider: ${gateway.provider}`}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedGateway?.provider?.toLowerCase() === 'manual' ? (
                                    <>
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Nomor Rekening</p>
                                                    <p className="font-mono font-bold text-lg text-slate-900">{selectedGateway.account_number}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedGateway.account_number);
                                                        setCopied(true);
                                                        setTimeout(() => setCopied(false), 2000);
                                                    }}
                                                    className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 flex items-center gap-2 text-xs font-semibold"
                                                >
                                                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                                    {copied ? 'Tersalin' : 'Salin'}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Upload Bukti Transfer</label>
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => setData('proof_file', e.target.files?.[0] || null)}
                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl p-1 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                />
                                            </div>
                                            {errors.proof_file && <p className="text-xs text-red-500 mt-2">{errors.proof_file}</p>}
                                            <p className="text-[11px] text-slate-500 mt-2">Format: JPG, PNG maksimal 2MB.</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                                        <p className="text-sm text-indigo-700 font-medium text-center">
                                            Anda akan diarahkan ke halaman <b>{selectedGateway?.name}</b> untuk menyelesaikan pembayaran.
                                            (Mode Simulasi: Pembayaran akan langsung dianggap berhasil).
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={processing || (selectedGateway?.provider === 'Manual' && !data.proof_file)}
                                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-semibold text-slate-900 text-lg">Riwayat Bayar & Invoice</h3>
            {payments.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Belum ada riwayat pembayaran.</p>
            ) : (
                <div className="space-y-4">
                    {payments.map(p => (
                        <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-xl gap-4">
                            <div>
                                <p className="font-bold text-slate-900">INV-{p.id} <span className="text-slate-400 font-normal">({p.payment_method || 'Manual'})</span></p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'} | Booking ID: BKG-{p.booking_id}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <StatusBadgeLocal status={p.status} />
                                    <p className="text-sm font-semibold text-slate-900 mt-1">{formatRupiah(p.grand_total)}</p>
                                </div>
                                {p.status === 'Paid' && (
                                    <a href={`/invoices/${p.id}/download`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download Invoice">
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
