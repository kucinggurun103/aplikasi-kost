import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    Check,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Calendar,
    User,
    Phone,
    FileText,
    BedDouble,
    Shield,
    AlertCircle,
    ArrowRight,
    DollarSign,
    Clock,
    Sparkles,
    Building,
    CheckCircle2,
    Tag,
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import {
    Navbar,
    Footer,
    Btn,
    Badge,
    Avatar,
} from '@/components/cozqta/primitives';

export default function BookingCreate({
    room: propRoom,
    addons = [],
}: {
    room?: Room;
    addons?: any[];
}) {
    const { url, props } = usePage();
    const auth = (props as any).auth;
    const globalSettings = (props as any).global_settings;
    const webSettings = globalSettings?.web_settings;
    const discountRules = globalSettings?.discount_rules || [];

    const [step, setStep] = useState(1);

    const [room, setRoom] = useState<Room>(propRoom || ROOMS[0]);

    useEffect(() => {
        if (propRoom) {
            setRoom(propRoom);
        }
    }, [propRoom]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateString = tomorrow.toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        name: auth?.user?.name || '',
        phone: auth?.user?.phone || '',
        checkInDate: minDateString,
        notes: '',
    });

    useEffect(() => {
        if (auth?.user) {
            setFormData((prev) => ({
                ...prev,
                name: auth.user.name || prev.name,
                phone: auth.user.phone || prev.phone,
            }));
        }
    }, [auth?.user]);

    const [duration, setDuration] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState<any[]>([]);

    const toggleAddon = (addon: any) => {
        setSelectedAddons((prev) => {
            const exists = prev.find((a) => a.id === addon.id);
            if (exists) return prev.filter((a) => a.id !== addon.id);
            return [...prev, addon];
        });
    };

    const steps = ['Data Penghuni', 'Sewa & Add-on', 'Konfirmasi Pesanan'];

    const basePrice = room.price * duration;

    let discountRate = 0;
    for (const rule of discountRules) {
        if (duration == rule.minimum_months) {
            discountRate = parseFloat(rule.discount_percentage) / 100;
            break; // Match exact duration
        }
    }

    const discountAmount = basePrice * discountRate;

    // Hitung total harga addon bulanan
    const monthlyAddonPrice = selectedAddons.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0,
    );
    const totalAddonPrice = monthlyAddonPrice * duration;

    const adminFee = webSettings?.admin_fee
        ? parseFloat(webSettings.admin_fee)
        : 25000;
    const bookingFee = room.booking_price || 0;
    const depositFee =
        room.deposit_type === 'None' ? 0 : room.deposit_price || 0;

    const firstMonthRent = room.price * 1 + monthlyAddonPrice;
    const laterPayment =
        firstMonthRent + depositFee - (duration === 1 ? discountAmount : 0); // simplifikasi

    const totalPrice =
        basePrice + totalAddonPrice - discountAmount + adminFee + depositFee;

    const initialPayment =
        bookingFee > 0
            ? bookingFee + adminFee
            : firstMonthRent - discountAmount + adminFee + depositFee;
    const remainingTotal = totalPrice - initialPayment;

    const handleProceedToPayment = () => {
        router.post('/bookings/create', {
            room_id: room.id,
            duration: duration,
            checkInDate: formData.checkInDate,
            notes: formData.notes,
            addons: selectedAddons.map((a) => a.id),
            insurance: false,
        });
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title="Pesan Kamar Kost — CozQta" />
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
                            Form Pemesanan
                        </span>
                    </div>

                    <div className="mb-8">
                        <div className="relative mx-auto mb-10 flex max-w-2xl items-center justify-between px-4">
                            <div className="absolute top-5 right-10 left-10 -z-10 h-1 rounded-full bg-slate-200" />
                            <div
                                className="absolute top-5 left-10 -z-10 h-1 rounded-full bg-indigo-600 transition-all duration-300"
                                style={{
                                    width: `${((step - 1) / (steps.length - 1)) * 80}%`,
                                }}
                            />

                            {steps.map((s, i) => (
                                <div
                                    key={s}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold shadow-xs transition-all ${
                                            i + 1 < step
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : i + 1 === step
                                                  ? 'scale-110 border-indigo-600 bg-white text-indigo-600'
                                                  : 'border-slate-200 bg-white text-slate-400'
                                        }`}
                                    >
                                        {i + 1 < step ? (
                                            <Check
                                                size={18}
                                                className="stroke-[3]"
                                            />
                                        ) : (
                                            i + 1
                                        )}
                                    </div>
                                    <span
                                        className={`max-w-[100px] text-center text-xs font-semibold ${
                                            i + 1 === step
                                                ? 'font-bold text-indigo-600'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
                                {step === 1 && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h2 className="mb-1 text-xl font-bold text-slate-900">
                                                Langkah 1: Identitas Calon
                                                Penghuni
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Pastikan data kontak aktif agar
                                                pemilik kost mudah menghubungi
                                                Anda.
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                                            <Shield
                                                size={18}
                                                className="mt-0.5 flex-shrink-0 text-indigo-600"
                                            />
                                            <p className="text-xs leading-relaxed text-indigo-900">
                                                Data identitas Anda dilindungi
                                                dengan enkripsi tingkat tinggi
                                                dan hanya akan dibagikan kepada
                                                pemilik kost setelah pemesanan
                                                dikonfirmasi.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                    Nama Lengkap (Sesuai
                                                    KTP/KTN){' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        size={15}
                                                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder="Nama Lengkap (Sesuai KTP/KTN)"
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                    Nomor WhatsApp / HP Aktif{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="relative">
                                                    <Phone
                                                        size={15}
                                                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                                                    />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                phone: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder="Nomor WhatsApp / HP Aktif"
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                    Tanggal Pemesanan (Booking){' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                                                    <AlertCircle
                                                        size={16}
                                                        className="mt-0.5 flex-shrink-0 text-amber-500"
                                                    />
                                                    <p className="text-xs leading-relaxed text-amber-800">
                                                        <strong>
                                                            Perhatian:
                                                        </strong>{' '}
                                                        Check-in fisik ke kamar
                                                        baru dapat dilakukan
                                                        minimal 1 hari setelah
                                                        Tanggal Pemesanan yang
                                                        Anda tentukan di bawah
                                                        ini.
                                                    </p>
                                                </div>
                                                <div className="relative">
                                                    <Calendar
                                                        size={15}
                                                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                                                    />
                                                    <input
                                                        type="date"
                                                        min={minDateString}
                                                        value={
                                                            formData.checkInDate
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                checkInDate:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                                    Catatan Tambahan untuk
                                                    Pemilik (Opsional)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.notes}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            notes: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="Catatan Tambahan untuk Pemilik (Opsional)"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end border-t border-slate-100 pt-4">
                                            <Btn
                                                variant="primary"
                                                size="lg"
                                                onClick={() => {
                                                    if (!auth?.user) {
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Harus Login',
                                                            text: 'Anda harus login sebagai penghuni untuk melakukan pemesanan.',
                                                            confirmButtonText:
                                                                'Login Sekarang',
                                                            showCancelButton: true,
                                                            cancelButtonText:
                                                                'Batal',
                                                        }).then((result) => {
                                                            if (
                                                                result.isConfirmed
                                                            ) {
                                                                router.visit(
                                                                    '/login',
                                                                );
                                                            }
                                                        });
                                                        return;
                                                    }

                                                    const userRoles =
                                                        auth.user.roles || [];
                                                    if (
                                                        !userRoles.includes(
                                                            'tenant',
                                                        ) &&
                                                        !userRoles.includes(
                                                            'penghuni',
                                                        )
                                                    ) {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Akses Ditolak',
                                                            text: 'Hanya akun dengan hak akses Penghuni yang dapat melakukan pemesanan kamar.',
                                                            confirmButtonText:
                                                                'Tutup',
                                                        });
                                                        return;
                                                    }

                                                    if (
                                                        !formData.name ||
                                                        !formData.phone ||
                                                        !formData.checkInDate
                                                    ) {
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Data Belum Lengkap',
                                                            text: 'Mohon lengkapi data wajib (Nama, No HP, Tanggal Masuk) terlebih dahulu.',
                                                        });
                                                        return;
                                                    }
                                                    if (
                                                        formData.checkInDate <
                                                        minDateString
                                                    ) {
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Tanggal Tidak Valid',
                                                            text: 'Tanggal check-in minimal adalah besok.',
                                                        });
                                                        return;
                                                    }

                                                    Swal.fire({
                                                        icon: 'info',
                                                        title: 'Informasi Check-in',
                                                        text: 'Kamar akan dipersiapkan sehari setelah ditentukan tanggal check in Anda jika pembayaran berhasil terkonfirmasi.',
                                                        confirmButtonText:
                                                            'Mengerti',
                                                    }).then(() => {
                                                        setStep(2);
                                                    });
                                                }}
                                                className="px-8 shadow-sm"
                                            >
                                                Lanjutkan ke Durasi Sewa{' '}
                                                <ArrowRight size={18} />
                                            </Btn>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h2 className="mb-1 text-xl font-bold text-slate-900">
                                                Langkah 2: Pilih Durasi Sewa
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Semakin lama durasi sewa,
                                                semakin hemat biaya yang Anda
                                                keluarkan dengan diskon spesial.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {[
                                                { m: 1, label: '1 Bulan' },
                                                { m: 3, label: '3 Bulan' },
                                                { m: 6, label: '6 Bulan' },
                                                { m: 12, label: '1 Tahun' },
                                            ].map((item) => {
                                                let itemDiscountRate = 0;
                                                for (const rule of discountRules) {
                                                    if (
                                                        item.m ==
                                                        rule.minimum_months
                                                    ) {
                                                        itemDiscountRate =
                                                            parseFloat(
                                                                rule.discount_percentage,
                                                            ) / 100;
                                                        break;
                                                    }
                                                }
                                                const badge =
                                                    itemDiscountRate > 0
                                                        ? `Hemat ${itemDiscountRate * 100}%` +
                                                          (itemDiscountRate >=
                                                          0.15
                                                              ? ' 🔥'
                                                              : '')
                                                        : null;
                                                const itemBasePrice =
                                                    room.price * item.m;
                                                const itemDiscounted =
                                                    itemBasePrice *
                                                    (1 - itemDiscountRate);
                                                return (
                                                    <button
                                                        key={item.m}
                                                        onClick={() =>
                                                            setDuration(item.m)
                                                        }
                                                        className={`relative flex h-32 cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 text-center transition-all ${
                                                            duration === item.m
                                                                ? 'scale-102 border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10'
                                                                : 'border-slate-200 bg-white hover:border-indigo-300'
                                                        }`}
                                                    >
                                                        {badge && (
                                                            <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                                                                {badge}
                                                            </span>
                                                        )}
                                                        <div className="mt-1">
                                                            <p className="text-2xl font-extrabold text-slate-900">
                                                                {item.m}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                Bulan
                                                            </p>
                                                        </div>
                                                        <p className="mt-2 border-t border-slate-100 pt-2 text-xs font-bold text-indigo-600">
                                                            {fmtShort(
                                                                itemDiscounted /
                                                                    item.m,
                                                            )}
                                                            /bln
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {room.facilities &&
                                            room.facilities.length > 0 && (
                                                <div className="pt-2 pb-2">
                                                    <h3 className="mb-3 text-sm font-semibold text-slate-800">
                                                        Fasilitas Utama
                                                        (Termasuk)
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {room.facilities
                                                            .filter(
                                                                (fac: any) =>
                                                                    typeof fac ===
                                                                    'object'
                                                                        ? !fac.price ||
                                                                          fac.price ===
                                                                              0
                                                                        : true,
                                                            )
                                                            .map(
                                                                (
                                                                    fac: any,
                                                                    idx: number,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex items-center rounded-xl border border-slate-100 bg-slate-50 p-3"
                                                                    >
                                                                        <span className="text-sm font-medium text-slate-700">
                                                                            {typeof fac ===
                                                                            'object'
                                                                                ? fac.name
                                                                                : fac}
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                </div>
                                            )}

                                        {addons && addons.length > 0 && (
                                            <div className="pt-2">
                                                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                                                    Fasilitas Tambahan
                                                    (Opsional)
                                                </h3>
                                                <div className="space-y-2">
                                                    {addons.map(
                                                        (addon: any) => {
                                                            const isSelected =
                                                                selectedAddons.some(
                                                                    (a) =>
                                                                        a.id ===
                                                                        addon.id,
                                                                );
                                                            return (
                                                                <label
                                                                    key={
                                                                        addon.id
                                                                    }
                                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                                                >
                                                                    <div className="mt-0.5">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                isSelected
                                                                            }
                                                                            onChange={() =>
                                                                                toggleAddon(
                                                                                    addon,
                                                                                )
                                                                            }
                                                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start justify-between">
                                                                            <p className="text-sm font-semibold text-slate-900">
                                                                                {
                                                                                    addon.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-sm font-bold text-indigo-600">
                                                                                +
                                                                                {fmtIDR(
                                                                                    addon.price,
                                                                                )}{' '}
                                                                                <span className="text-xs font-normal text-slate-500">
                                                                                    /bln
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        {addon.description && (
                                                                            <p className="mt-1 text-xs text-slate-500">
                                                                                {
                                                                                    addon.description
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">
                                                    Harga Sewa Normal (
                                                    {duration} x{' '}
                                                    {fmtShort(room.price)})
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {fmtIDR(basePrice)}
                                                </span>
                                            </div>

                                            {totalAddonPrice > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">
                                                        Fasilitas Tambahan (
                                                        {duration} bln x{' '}
                                                        {selectedAddons.length}{' '}
                                                        item)
                                                    </span>
                                                    <span className="font-semibold text-slate-900">
                                                        +
                                                        {fmtIDR(
                                                            totalAddonPrice,
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {discountAmount > 0 && (
                                                <div className="flex items-center justify-between text-sm font-medium text-green-600">
                                                    <span className="flex items-center gap-1.5">
                                                        <Tag size={15} /> Diskon
                                                        Durasi Sewa (
                                                        {discountRate * 100}%)
                                                    </span>
                                                    <span>
                                                        -
                                                        {fmtIDR(discountAmount)}
                                                    </span>
                                                </div>
                                            )}

                                            {depositFee > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">
                                                        Deposit Jaminan{' '}
                                                        {room.deposit_type ===
                                                        'AtEnd'
                                                            ? '(Bayar Nanti)'
                                                            : '(Dibayar Awal)'}
                                                    </span>
                                                    <span className="font-semibold text-slate-900">
                                                        {fmtIDR(depositFee)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">
                                                    Biaya Layanan & Administrasi
                                                    CozQta
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {fmtIDR(adminFee)}
                                                </span>
                                            </div>

                                            <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                                                <span className="text-base font-bold text-slate-900">
                                                    Total Tagihan Awal
                                                </span>
                                                <span className="text-2xl font-extrabold text-indigo-600">
                                                    {fmtIDR(totalPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                            <Btn
                                                variant="outline"
                                                size="lg"
                                                onClick={() => setStep(1)}
                                            >
                                                <ChevronLeft size={18} />{' '}
                                                Kembali
                                            </Btn>
                                            <Btn
                                                variant="primary"
                                                size="lg"
                                                onClick={() => setStep(3)}
                                                className="px-8 shadow-sm"
                                            >
                                                Lanjut Konfirmasi{' '}
                                                <ArrowRight size={18} />
                                            </Btn>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h2 className="mb-1 text-xl font-bold text-slate-900">
                                                Langkah 3: Konfirmasi Pesanan
                                                Anda
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Periksa kembali seluruh rincian
                                                kamar, jadwal, dan identitas
                                                penghuni sebelum lanjut ke
                                                pembayaran.
                                            </p>
                                        </div>

                                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                            <h3 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">
                                                Rincian Calon Penghuni
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Nama Lengkap
                                                    </p>
                                                    <p className="font-bold text-slate-800">
                                                        {formData.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Nomor WhatsApp / HP
                                                    </p>
                                                    <p className="font-bold text-slate-800">
                                                        {formData.phone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Tanggal Pemesanan
                                                    </p>
                                                    <p className="font-bold text-indigo-600">
                                                        {formData.checkInDate}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Masa Sewa
                                                    </p>
                                                    <p className="font-bold text-slate-800">
                                                        {duration} Bulan
                                                        (Berakhir{' '}
                                                        {
                                                            new Date(
                                                                new Date(
                                                                    formData.checkInDate,
                                                                ).setMonth(
                                                                    new Date(
                                                                        formData.checkInDate,
                                                                    ).getMonth() +
                                                                        duration,
                                                                ),
                                                            )
                                                                .toISOString()
                                                                .split('T')[0]
                                                        }
                                                        )
                                                    </p>
                                                </div>
                                            </div>
                                            {formData.notes && (
                                                <div className="border-t border-slate-200/60 pt-2">
                                                    <p className="text-xs text-slate-400">
                                                        Catatan Khusus
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-600 italic">
                                                        &ldquo;{formData.notes}
                                                        &rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                            <AlertCircle
                                                size={18}
                                                className="mt-0.5 flex-shrink-0 text-amber-600"
                                            />
                                            <p className="text-xs leading-relaxed text-amber-900">
                                                Dengan menekan tombol{' '}
                                                <strong>
                                                    &ldquo;Bayar Sekarang&rdquo;
                                                </strong>
                                                , Anda menyetujui{' '}
                                                <a
                                                    href="/"
                                                    className="font-bold underline"
                                                >
                                                    Syarat & Ketentuan CozQta
                                                </a>{' '}
                                                serta peraturan tata tertib dari
                                                pemilik kost.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div className="flex gap-4">
                                                <Btn
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={() =>
                                                        setStep(step - 1)
                                                    }
                                                >
                                                    <ChevronLeft size={18} />{' '}
                                                    Ubah Durasi
                                                </Btn>
                                                <Btn
                                                    variant="primary"
                                                    size="lg"
                                                    onClick={
                                                        handleProceedToPayment
                                                    }
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700"
                                                >
                                                    Bayar Tagihan Awal (
                                                    {fmtShort(initialPayment)}){' '}
                                                    <ArrowRight size={18} />
                                                </Btn>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-base font-bold text-slate-900">
                                    Ringkasan Kamar
                                </h3>
                                <div className="mb-5 flex gap-3.5 border-b border-slate-100 pb-5">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-100 object-cover"
                                    />
                                    <div>
                                        <Badge variant="outline">
                                            {room.type}
                                        </Badge>
                                        <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
                                            {room.name}
                                        </h4>
                                        <p className="mt-0.5 line-clamp-1 flex items-center gap-1 text-xs text-slate-400">
                                            <MapPin
                                                size={12}
                                                className="flex-shrink-0"
                                            />{' '}
                                            {room.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-xs text-slate-600">
                                    {/* Rincian Total Keseluruhan */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>
                                                Harga Kamar ({duration} bln)
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {fmtIDR(basePrice)}
                                            </span>
                                        </div>
                                        {totalAddonPrice > 0 && (
                                            <div className="flex justify-between">
                                                <span>
                                                    Add-on ({duration} bln)
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {fmtIDR(totalAddonPrice)}
                                                </span>
                                            </div>
                                        )}
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between font-medium text-green-600">
                                                <span>Diskon Promo</span>
                                                <span>
                                                    -{fmtIDR(discountAmount)}
                                                </span>
                                            </div>
                                        )}
                                        {depositFee > 0 && (
                                            <div className="flex justify-between">
                                                <span>
                                                    Deposit Jaminan{' '}
                                                    {room.deposit_type ===
                                                    'AtEnd'
                                                        ? '(Nanti)'
                                                        : ''}
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {fmtIDR(depositFee)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Biaya Layanan Admin</span>
                                            <span className="font-semibold text-slate-900">
                                                {fmtIDR(adminFee)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-3">
                                        <div className="mb-1 flex items-baseline justify-between">
                                            <span className="text-sm font-bold text-slate-900">
                                                Total Keseluruhan
                                            </span>
                                            <span className="text-sm font-bold text-slate-900">
                                                {fmtIDR(totalPrice)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400">
                                            Total akumulasi biaya selama masa
                                            sewa.
                                        </p>
                                    </div>

                                    {/* Apa yang harus dibayar SEKARANG */}
                                    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                                        <p className="mb-2 text-sm font-bold text-indigo-900">
                                            Yang Harus Dibayar Sekarang
                                        </p>
                                        {bookingFee > 0 ? (
                                            <>
                                                <div className="mb-1 flex justify-between">
                                                    <span>
                                                        DP / Booking Fee
                                                    </span>
                                                    <span className="font-semibold text-indigo-900">
                                                        {fmtIDR(bookingFee)}
                                                    </span>
                                                </div>
                                                <div className="mb-3 flex justify-between">
                                                    <span>
                                                        Biaya Layanan Admin
                                                    </span>
                                                    <span className="font-semibold text-indigo-900">
                                                        {fmtIDR(adminFee)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mb-3 flex justify-between">
                                                <span>
                                                    Sewa Bulan 1 + Deposit +
                                                    Admin
                                                </span>
                                                <span className="font-semibold text-indigo-900">
                                                    {fmtIDR(initialPayment)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline justify-between border-t border-indigo-200/60 pt-2">
                                            <span className="font-bold text-indigo-900">
                                                Total Saat Ini
                                            </span>
                                            <span className="text-lg font-extrabold text-indigo-700">
                                                {fmtIDR(initialPayment)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sisa yang dibayar NANTI */}
                                    {remainingTotal > 0 && (
                                        <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                                            <div className="mb-2 flex items-start gap-2">
                                                <AlertCircle
                                                    size={14}
                                                    className="mt-0.5 flex-shrink-0 text-amber-600"
                                                />
                                                <p className="text-[11px] leading-tight text-amber-800">
                                                    {bookingFee > 0
                                                        ? 'Sisa tagihan (Sewa Bulan 1 + Deposit) dibayarkan nanti setelah Admin menyetujui DP dan saat Anda ke lokasi.'
                                                        : 'Sisa tagihan untuk bulan-bulan berikutnya dibayarkan sesuai jatuh tempo.'}
                                                </p>
                                            </div>
                                            <div className="flex items-baseline justify-between border-t border-amber-200/60 pt-2">
                                                <span className="font-bold text-amber-900">
                                                    Sisa Tagihan Nanti
                                                </span>
                                                <span className="text-sm font-bold text-amber-700">
                                                    {fmtIDR(remainingTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
