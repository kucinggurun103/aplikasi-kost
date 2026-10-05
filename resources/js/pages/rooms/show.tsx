import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Wifi,
    Wind,
    Tv,
    Car,
    Package,
    Zap,
    Bath,
    Droplets,
    Coffee,
    ChevronRight,
    Star,
    MapPin,
    BedDouble,
    Layers,
    Building,
    Calendar,
    MessageSquare,
    ShieldCheck,
    Heart,
    Share2,
    Check,
    Refrigerator,
    Utensils,
    Sparkles,
    CheckCircle2,
    Shield,
    Dumbbell,
    Waves,
    Search,
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import {
    Navbar,
    Footer,
    Badge,
    Btn,
    Avatar,
} from '@/components/cozqta/primitives';

export default function RoomShow({
    room: propRoom,
    similarRooms: propSimilar,
}: {
    room?: any;
    similarRooms?: any[];
}) {
    const { url, props } = usePage();
    const room = propRoom || (props as any).room || ROOMS[0];
    const similarRooms = propSimilar || (props as any).similarRooms || [];

    const [activeImg, setActiveImg] = useState(0);
    const [copied, setCopied] = useState(false);

    const imgs =
        room.images && room.images.length > 0
            ? room.images
            : [
                  room.image ||
                      'https://placehold.co/800x420/e2e8f0/64748b?text=Belum+Ada+Foto',
              ];

    const iconMap: Record<string, any> = {
        Wifi,
        Tv,
        Wind,
        Coffee,
        Dumbbell,
        Car,
        Shield: ShieldCheck,
        ShieldCheck,
        Waves,
        Utensils,
        Droplet: Droplets,
        Droplets,
        Zap,
        Bath,
        BedDouble,
        Refrigerator,
        Box: Package,
        Package,
        Sparkles,
        MapPin,
        Search,
    };

    const getFacilityIcon = (facility: any) => {
        if (facility && facility.icon && iconMap[facility.icon]) {
            return iconMap[facility.icon];
        }
        const name =
            typeof facility === 'string' ? facility : facility?.name || '';
        const clean = name.toLowerCase().trim();
        if (clean.includes('wifi')) return Wifi;
        if (clean.includes('ac')) return Wind;
        if (clean.includes('tv')) return Tv;
        if (clean.includes('kulkas')) return Refrigerator;
        if (clean.includes('listrik')) return Zap;
        if (clean.includes('air')) return Droplets;
        if (clean.includes('aman') || clean.includes('security'))
            return ShieldCheck;
        if (clean.includes('mandi') || clean.includes('toilet')) return Bath;
        if (clean.includes('parkir')) return Car;
        if (clean.includes('dapur') || clean.includes('masak')) return Utensils;
        if (clean.includes('lemari')) return Package;
        if (clean.includes('kasur') || clean.includes('bed')) return BedDouble;
        return Sparkles;
    };

    const handleCopyShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleChat = () => {
        let phone = room.whatsapp;
        if (!phone) {
            alert('Nomor WhatsApp pengelola cabang ini tidak tersedia.');
            return;
        }
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
        }
        const message = `Halo pengelola ${room.building}, saya tertarik dengan kamar ${room.name}. Apakah masih tersedia?`;
        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            '_blank',
        );
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title={`${room.name} — CozQta`}>
                {room.description && (
                    <meta
                        head-key="description"
                        name="description"
                        content={room.description}
                    />
                )}
                {room.description && (
                    <meta
                        head-key="og:description"
                        property="og:description"
                        content={room.description}
                    />
                )}
            </Head>
            <Navbar />

            <main className="flex-1 pt-20 pb-16">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <nav className="flex items-center gap-2 text-sm text-slate-500">
                            <Link
                                href="/"
                                className="transition-colors hover:text-indigo-600"
                            >
                                Beranda
                            </Link>
                            <ChevronRight size={14} />
                            <Link
                                href="/rooms"
                                className="transition-colors hover:text-indigo-600"
                            >
                                Cari Kamar
                            </Link>
                            <ChevronRight size={14} />
                            <span className="max-w-[200px] truncate font-semibold text-slate-900 sm:max-w-xs">
                                {room.name}
                            </span>
                        </nav>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyShare}
                                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50"
                            >
                                {copied ? (
                                    <Check
                                        size={16}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <Share2 size={16} />
                                )}
                                <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                                <div className="relative">
                                    <img
                                        src={imgs[activeImg]}
                                        alt={room.name}
                                        className="h-80 w-full bg-slate-100 object-cover transition-all duration-300 sm:h-[420px]"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge
                                            variant={
                                                room.status === 'Available'
                                                    ? 'success'
                                                    : room.status === 'Reserved'
                                                      ? 'warning'
                                                      : room.status ===
                                                          'Occupied'
                                                        ? 'danger'
                                                        : 'default'
                                            }
                                        >
                                            {room.status === 'Available' && (
                                                <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                            )}
                                            {room.status === 'Available'
                                                ? 'Tersedia'
                                                : room.status === 'Reserved'
                                                  ? 'Di-booking'
                                                  : room.status === 'Occupied'
                                                    ? 'Terisi'
                                                    : room.status}
                                        </Badge>
                                        <Badge variant="outline">
                                            {room.type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex gap-3 overflow-x-auto border-t border-slate-100 bg-white p-4">
                                    {imgs.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl transition-all ${activeImg === i ? 'scale-95 shadow-xs ring-2 ring-indigo-600' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="h-full w-full bg-slate-100 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
                                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                            {room.name}
                                        </h1>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin
                                                size={16}
                                                className="flex-shrink-0 text-indigo-500"
                                            />
                                            <span>{room.address}</span>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-3xl font-extrabold text-indigo-600">
                                            {fmtShort(room.price)}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            per Bulan
                                        </p>
                                    </div>
                                </div>

                                <div className="my-6 grid grid-cols-3 gap-4 rounded-2xl border-y border-slate-100 bg-slate-50 px-4 py-5">
                                    {[
                                        {
                                            icon: BedDouble,
                                            label: 'Ukuran Kamar',
                                            val: `${room.size} m²`,
                                        },
                                        {
                                            icon: Layers,
                                            label: 'Posisi Lantai',
                                            val: `Lantai ${room.floor}`,
                                        },
                                        {
                                            icon: Building,
                                            label: 'Nama Gedung',
                                            val: room.building,
                                        },
                                    ].map((info) => (
                                        <div
                                            key={info.label}
                                            className="text-center"
                                        >
                                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <info.icon size={20} />
                                            </div>
                                            <p className="mb-0.5 text-xs text-slate-400">
                                                {info.label}
                                            </p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {info.val}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-8">
                                    <h3 className="mb-3 text-lg font-bold text-slate-900">
                                        Deskripsi Kost
                                    </h3>
                                    {room.description ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600">
                                            {room.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">
                                            Belum ada deskripsi.
                                        </p>
                                    )}
                                </div>

                                {(() => {
                                    const freeFacilities =
                                        room.facilities.filter(
                                            (f: any) =>
                                                (typeof f === 'string'
                                                    ? 0
                                                    : f.price) === 0,
                                        );
                                    const paidFacilities =
                                        room.facilities.filter(
                                            (f: any) =>
                                                (typeof f === 'string'
                                                    ? 0
                                                    : f.price) > 0,
                                        );

                                    return (
                                        <div className="space-y-8">
                                            {freeFacilities.length > 0 && (
                                                <div>
                                                    <h3 className="mb-4 text-lg font-bold text-slate-900">
                                                        Fasilitas Utama
                                                        (Termasuk)
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                        {freeFacilities.map(
                                                            (f: any) => {
                                                                const name =
                                                                    typeof f ===
                                                                    'string'
                                                                        ? f
                                                                        : f.name;
                                                                const IconComponent =
                                                                    getFacilityIcon(
                                                                        f,
                                                                    );
                                                                return (
                                                                    <div
                                                                        key={
                                                                            name
                                                                        }
                                                                        className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100/70"
                                                                    >
                                                                        <div className="flex-shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-2xs">
                                                                            <IconComponent
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <span className="truncate">
                                                                            {
                                                                                name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {paidFacilities.length > 0 && (
                                                <div>
                                                    <h3 className="mb-4 text-lg font-bold text-slate-900">
                                                        Fasilitas Tambahan
                                                        (Opsional)
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                        {paidFacilities.map(
                                                            (f: any) => {
                                                                const name =
                                                                    typeof f ===
                                                                    'string'
                                                                        ? f
                                                                        : f.name;
                                                                const price =
                                                                    typeof f ===
                                                                    'string'
                                                                        ? 0
                                                                        : f.price;
                                                                const IconComponent =
                                                                    getFacilityIcon(
                                                                        f,
                                                                    );
                                                                return (
                                                                    <div
                                                                        key={
                                                                            name
                                                                        }
                                                                        className="flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100/70"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex-shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-2xs">
                                                                                <IconComponent
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span className="truncate font-semibold text-slate-900">
                                                                                {
                                                                                    name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <span className="self-start rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
                                                                            +{' '}
                                                                            {fmtIDR(
                                                                                price,
                                                                            )}{' '}
                                                                            /
                                                                            bln
                                                                        </span>
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
                                <h3 className="mb-4 text-lg font-bold text-slate-900">
                                    Lokasi & Peta Sekitar
                                </h3>
                                <div className="group relative flex h-64 flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-slate-500">
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                                    <div className="relative z-10 max-w-sm rounded-2xl border border-slate-200/60 bg-white/90 p-6 text-center shadow-sm backdrop-blur-md">
                                        <MapPin
                                            size={36}
                                            className="mx-auto mb-2 animate-bounce text-indigo-600"
                                        />
                                        <p className="mb-1 text-base font-bold text-slate-900">
                                            Peta Lokasi Interaktif
                                        </p>
                                        <p className="mb-4 text-xs text-slate-500">
                                            {room.address}
                                        </p>
                                        <a
                                            href={`https://maps.google.com/?q=${encodeURIComponent(room.address)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700"
                                        >
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3.5 border-b border-slate-100 pb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Building size={24} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-900">
                                            {room.building}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Properti Cabang Terverifikasi
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Harga Sewa Per Bulan</span>
                                        <span className="font-bold text-slate-900">
                                            {fmtIDR(room.price)}
                                        </span>
                                    </div>
                                    {room.booking_price > 0 && (
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Biaya Booking / DP</span>
                                            <span className="font-bold text-slate-900">
                                                {fmtIDR(room.booking_price)}
                                            </span>
                                        </div>
                                    )}
                                    {room.deposit_type !== 'None' &&
                                        room.deposit_price > 0 && (
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>
                                                    Deposit (Refundable){' '}
                                                    {room.deposit_type ===
                                                    'AtEnd' ? (
                                                        <span className="ml-1 text-[10px] font-medium text-amber-500">
                                                            (Bayar Nanti)
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>
                                                <span className="font-bold text-slate-900">
                                                    {fmtIDR(room.deposit_price)}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                <div className="space-y-3">
                                    <Btn
                                        variant="primary"
                                        size="lg"
                                        href={`/bookings/room/${room.id}`}
                                        className="w-full justify-center shadow-md shadow-indigo-500/20"
                                    >
                                        <Calendar size={18} /> Pesan Kamar
                                        Sekarang
                                    </Btn>
                                    <Btn
                                        variant="outline"
                                        size="lg"
                                        onClick={handleChat}
                                        className="w-full justify-center border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                                    >
                                        <MessageSquare size={18} /> Chat via
                                        WhatsApp
                                    </Btn>
                                </div>

                                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 p-3.5">
                                    <Shield
                                        size={16}
                                        className="mt-0.5 flex-shrink-0 text-green-600"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-green-800">
                                            Jaminan Keamanan & Verifikasi
                                        </p>
                                        <p className="mt-0.5 text-[11px] leading-normal text-green-700">
                                            Properti ini telah melewati proses
                                            verifikasi fisik, kelayakan,
                                            keamanan, dan kepemilikan oleh tim
                                            surveyor lapangan CozQta.
                                        </p>
                                    </div>
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
