import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    QrCode,
    Building,
    CreditCard,
    Zap,
    Tag,
    Receipt,
    CheckCircle2,
    Clock,
    Copy,
    Check,
    ArrowRight,
    Shield,
    ChevronRight,
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import { Navbar, Footer, Btn, Badge } from '@/components/cozqta/primitives';

export default function PaymentShow({
    payment_gateways = [],
    payment = null,
    booking = null,
    room = null,
}: {
    payment_gateways?: any[];
    payment?: any;
    booking?: any;
    room?: any;
}) {
    const { url } = usePage();
    const [method, setMethod] = useState(
        payment_gateways.length > 0 ? payment_gateways[0].id : null,
    );
    const [status, setStatus] = useState<'pending' | 'paid' | 'failed'>(
        payment?.status?.toLowerCase() === 'paid' ? 'paid' : 'pending',
    );
    const [countdown, setCountdown] = useState(900);
    const [copied, setCopied] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);

    const bookingId = booking?.booking_no || 'TRX-882910';
    const total = payment?.grand_total || 2575000;
    const duration = booking?.duration_month || 1;

    useEffect(() => {
        if (status !== 'pending') return;
        const t = setInterval(
            () => setCountdown((c) => (c > 0 ? c - 1 : 0)),
            1000,
        );
        return () => clearInterval(t);
    }, [status]);

    const mins = Math.floor(countdown / 60)
        .toString()
        .padStart(2, '0');
    const secs = (countdown % 60).toString().padStart(2, '0');

    // Map backend payment_gateways to frontend format
    const getIconForProvider = (provider: string) => {
        const p = (provider || '').toLowerCase();
        if (p.includes('qris')) return QrCode;
        if (p.includes('transfer') || p.includes('manual')) return Receipt;
        if (p.includes('credit') || p.includes('card')) return CreditCard;
        if (p.includes('ewallet') || p.includes('gopay') || p.includes('ovo'))
            return Tag;
        return Building;
    };

    const methods = payment_gateways.map((pg) => ({
        id: pg.id,
        label: pg.name,
        icon: getIconForProvider(pg.provider),
        desc:
            pg.provider?.toLowerCase() === 'manual'
                ? `A.n. ${pg.account_name}`
                : `Provider: ${pg.provider.toUpperCase()}`,
        badge: pg.is_default ? 'Terpopuler' : null,
        instruction: pg.instruction,
        original: pg,
    }));

    const selectedMethodObj =
        methods.find((m) => m.id === method) || methods[0];

    const handleCopyVa = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText('8801928301928301');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSimulatePayment = () => {
        const isManualOrQris =
            selectedMethodObj?.original?.provider?.toLowerCase() === 'manual' ||
            selectedMethodObj?.original?.provider?.toLowerCase() === 'qris';

        if (isManualOrQris && proofFile) {
            const formData = new FormData();
            formData.append('payment_id', payment?.id);
            formData.append('method_id', method);
            formData.append('proof_file', proofFile);

            router.post('/payments/upload-proof', formData, {
                onSuccess: () => {
                    setStatus('paid');
                },
            });
        } else if (!isManualOrQris) {
            const formData = new FormData();
            formData.append('payment_id', payment?.id);
            formData.append('method_id', method);

            router.post('/payments/simulate-gateway', formData, {
                onSuccess: () => {
                    setStatus('paid');
                },
            });
        } else {
            setStatus('paid');
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title={`Pembayaran ${bookingId} — CozQta`} />
            <Navbar activePage="rooms" />

            <main className="flex-1 pt-20 pb-16">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-indigo-600">
                            Beranda
                        </Link>
                        <ChevronRight size={14} />
                        <Link
                            href={`/rooms/${room.id}`}
                            className="hover:text-indigo-600"
                        >
                            {room.name}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-slate-900">
                            Pembayaran #{bookingId}
                        </span>
                    </div>

                    {status === 'paid' ? (
                        <div className="animate-fade-in mx-auto my-6 max-w-2xl rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-lg sm:p-12">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-md shadow-green-500/10">
                                <CheckCircle2
                                    size={44}
                                    className="animate-bounce text-green-600"
                                />
                            </div>
                            <Badge variant="success">
                                Pembayaran Terverifikasi
                            </Badge>
                            <h1 className="mt-3 mb-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                                Pemesanan Kost Berhasil!
                            </h1>
                            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-500">
                                Selamat! Pembayaran Anda sebesar{' '}
                                <strong className="text-slate-900">
                                    {fmtIDR(total)}
                                </strong>{' '}
                                untuk{' '}
                                <strong className="text-indigo-600">
                                    {room.name}
                                </strong>{' '}
                                telah kami terima. E-ticket dan kode akses kost
                                telah dikirim ke dashboard Anda.
                            </p>

                            <div className="mx-auto mb-8 max-w-md space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        ID Booking
                                    </span>
                                    <span className="font-mono font-bold text-slate-800">
                                        {bookingId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Properti
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {room.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Masa Sewa
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {duration} Bulan
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Metode Bayar
                                    </span>
                                    <span className="font-bold text-indigo-600 uppercase">
                                        {method}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-bold">
                                    <span>Total Dibayar</span>
                                    <span className="text-green-600">
                                        {fmtIDR(total)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Btn
                                    variant="primary"
                                    size="lg"
                                    href="/dashboard"
                                    className="w-full px-8 shadow-md sm:w-auto"
                                >
                                    Lihat Tiket di Dashboard{' '}
                                    <ArrowRight size={18} />
                                </Btn>
                                <Btn
                                    variant="outline"
                                    size="lg"
                                    href="/"
                                    className="w-full px-6 sm:w-auto"
                                >
                                    Kembali ke Beranda
                                </Btn>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
                                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
                                        <div>
                                            <h1 className="text-xl font-bold text-slate-900">
                                                Pilih Metode Pembayaran
                                            </h1>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Semua transaksi dijamin aman dan
                                                terenkripsi SSL 256-bit.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                            <Clock
                                                size={14}
                                                className="animate-pulse"
                                            />
                                            <span>
                                                {mins}:{secs}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-8 space-y-3">
                                        {methods.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMethod(m.id)}
                                                className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                                                    method === m.id
                                                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${method === m.id ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'}`}
                                                    >
                                                        <m.icon size={22} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-900">
                                                                {m.label}
                                                            </span>
                                                            {m.badge && (
                                                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                                                    {m.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {m.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${method === m.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}
                                                >
                                                    {method === m.id && (
                                                        <Check
                                                            size={14}
                                                            className="stroke-[3]"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <QrCode
                                                size={18}
                                                className="text-indigo-600"
                                            />{' '}
                                            Instruksi Pembayaran (
                                            {selectedMethodObj?.label})
                                        </h3>

                                        <div className="prose prose-sm max-w-none rounded-xl border border-slate-200 bg-white p-5 text-slate-600">
                                            {selectedMethodObj?.original
                                                ?.account_number && (
                                                <div className="not-prose mb-4 w-full rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                                                    <p className="mb-1 text-xs font-semibold text-indigo-500">
                                                        Nomor Rekening Tujuan
                                                    </p>
                                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                        <p className="font-mono text-xl font-bold break-all text-indigo-700 sm:text-2xl">
                                                            {
                                                                selectedMethodObj
                                                                    .original
                                                                    .account_number
                                                            }
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    selectedMethodObj
                                                                        .original
                                                                        .account_number,
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
                                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 font-sans text-sm whitespace-nowrap text-indigo-600 transition-colors hover:bg-indigo-100 sm:w-auto sm:gap-1 sm:px-3 sm:py-1 sm:text-xs"
                                                        >
                                                            {copied ? (
                                                                <Check
                                                                    size={16}
                                                                    className="sm:h-[14px] sm:w-[14px]"
                                                                />
                                                            ) : (
                                                                <Copy
                                                                    size={16}
                                                                    className="sm:h-[14px] sm:w-[14px]"
                                                                />
                                                            )}
                                                            {copied
                                                                ? 'Tersalin'
                                                                : 'Salin Rekening'}
                                                        </button>
                                                    </div>
                                                    {selectedMethodObj.original
                                                        .account_name && (
                                                        <p className="mt-3 text-sm font-semibold text-indigo-900 sm:mt-2">
                                                            A/N:{' '}
                                                            {
                                                                selectedMethodObj
                                                                    .original
                                                                    .account_name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {selectedMethodObj?.instruction ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedMethodObj.instruction.replace(
                                                            /\n/g,
                                                            '<br />',
                                                        ),
                                                    }}
                                                />
                                            ) : (
                                                <p>
                                                    Silakan lakukan pembayaran
                                                    sesuai dengan detail di
                                                    atas.
                                                </p>
                                            )}
                                        </div>

                                        {(() => {
                                            const isManualOrQris =
                                                selectedMethodObj?.original?.provider?.toLowerCase() ===
                                                    'manual' ||
                                                selectedMethodObj?.original?.provider?.toLowerCase() ===
                                                    'qris';
                                            return (
                                                <>
                                                    {isManualOrQris && (
                                                        <div className="mt-4 mb-2 rounded-xl border border-slate-200 bg-white p-4">
                                                            <p className="mb-2 text-sm font-semibold text-slate-800">
                                                                Upload Bukti
                                                                Pembayaran
                                                            </p>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    setProofFile(
                                                                        e.target
                                                                            .files?.[0] ||
                                                                            null,
                                                                    )
                                                                }
                                                                className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                                            />
                                                            <p className="mt-2 text-[11px] text-slate-400">
                                                                Format: JPG, PNG
                                                                maksimal 2MB.
                                                                Bukti transfer
                                                                wajib diunggah
                                                                agar pembayaran
                                                                dapat
                                                                diverifikasi.
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="pt-2">
                                                        <Btn
                                                            variant="primary"
                                                            size="lg"
                                                            disabled={
                                                                isManualOrQris &&
                                                                !proofFile
                                                            }
                                                            onClick={
                                                                handleSimulatePayment
                                                            }
                                                            className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                                                        >
                                                            {isManualOrQris ? (
                                                                <>
                                                                    Kirim Bukti
                                                                    Pembayaran{' '}
                                                                    <CheckCircle2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Cek Status
                                                                    Pembayaran{' '}
                                                                    <CheckCircle2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </Btn>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-base font-bold text-slate-900">
                                        Ringkasan Tagihan
                                    </h3>

                                    <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className="h-16 w-16 flex-shrink-0 rounded-xl bg-slate-100 object-cover"
                                        />
                                        <div>
                                            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                                {room.type}
                                            </span>
                                            <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
                                                {room.name}
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                {room.building}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-xs text-slate-600">
                                        <div className="flex justify-between">
                                            <span>ID Transaksi</span>
                                            <span className="font-mono font-bold text-slate-800">
                                                {bookingId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Durasi Pemesanan</span>
                                            <span className="font-semibold text-slate-800">
                                                {duration} Bulan
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                                            <span>Total Bayar</span>
                                            <span className="text-lg text-indigo-600">
                                                {fmtIDR(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
                                        <Shield
                                            size={16}
                                            className="flex-shrink-0 text-indigo-600"
                                        />
                                        <span className="text-[11px] leading-normal font-medium text-indigo-900">
                                            Garansi 100% uang kembali jika
                                            properti tidak sesuai deskripsi.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
