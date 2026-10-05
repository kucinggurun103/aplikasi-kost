import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Building2,
    Star,
    ArrowRight,
    ChevronRight,
    Phone,
    Mail,
    Map,
    Compass,
    Shield,
    CheckCircle2,
    MessageSquare,
} from 'lucide-react';
import { ROOMS, Room } from '@/components/cozqta/data';
import {
    Navbar,
    Footer,
    RoomCard,
    Btn,
    Badge,
} from '@/components/cozqta/primitives';

export default function BranchShow() {
    const { url } = usePage();

    // Extract branch name from URL (e.g., /branches/Bandung -> Bandung)
    const pathParts = url.split('/');
    const rawBranchName =
        pathParts[pathParts.length - 1]?.split('?')[0] || 'Jakarta';
    const branchName = decodeURIComponent(rawBranchName);

    // Branch statistics and mock description based on city
    const branchDetails: Record<
        string,
        { desc: string; address: string; phone: string; rating: number }
    > = {
        Jakarta: {
            desc: 'Cabang utama CozQta terletak di pusat bisnis dan pemerintahan. Menyediakan akses mudah ke berbagai stasiun MRT, Halte TransJakarta, pusat perbelanjaan, serta gedung perkantoran elit di Sudirman, Thamrin, dan Kuningan.',
            address:
                'Hub CozQta Central Jakarta, Jl. Jend. Sudirman Kav. 21, Jakarta Pusat',
            phone: '+62 812-3456-7890',
            rating: 4.9,
        },
        Bandung: {
            desc: 'Cabang Paris van Java menghadirkan hunian sejuk dan estetik yang dekat dengan berbagai universitas ternama seperti ITB, Unpad, dan UPI. Sangat cocok bagi kalangan akademisi dan profesional muda.',
            address:
                'Hub CozQta Dago, Jl. Ir. H. Juanda No. 102, Coblong, Bandung',
            phone: '+62 812-3456-7891',
            rating: 4.8,
        },
        Surabaya: {
            desc: 'Cabang Kota Pahlawan berlokasi strategis di area industri, perkantoran, dan kampus ternama seperti ITS dan Unair. Menyediakan fasilitas premium untuk menunjang kenyamanan produktivitas Anda.',
            address:
                'Hub CozQta Gubeng, Jl. Raya Gubeng No. 44, Gubeng, Surabaya',
            phone: '+62 812-3456-7892',
            rating: 4.7,
        },
        Yogyakarta: {
            desc: 'Mengusung konsep hunian ramah pelajar dan berbudaya, cabang Yogyakarta dekat dengan UGM, UNY, dan Malioboro. Menawarkan lingkungan belajar yang kondusif dengan harga yang bersahabat.',
            address:
                'Hub CozQta Sleman, Jl. Kaliurang Km 5.5, Depok, Sleman, Yogyakarta',
            phone: '+62 812-3456-7893',
            rating: 4.8,
        },
        Malang: {
            desc: 'Nikmati suasana sejuk pegunungan di cabang Malang yang sangat dekat dengan Universitas Brawijaya dan UMM. Tempat hunian modern yang tenang dan nyaman untuk fokus belajar.',
            address:
                'Hub CozQta Lowokwaru, Jl. Soekarno Hatta No. 12, Lowokwaru, Malang',
            phone: '+62 812-3456-7894',
            rating: 4.7,
        },
    };

    const currentBranch = branchDetails[branchName] || {
        desc: `Cabang CozQta di ${branchName} menghadirkan pelayanan kos terbaik dengan standar kenyamanan, keamanan, dan fasilitas terlengkap untuk mahasiswa maupun pekerja kantoran.`,
        address: `Hub CozQta ${branchName}, Area Strategis Kota ${branchName}`,
        phone: '+62 812-3456-7899',
        rating: 4.7,
    };

    // Filter rooms that belong to this city/branch
    const filteredRooms = ROOMS.filter(
        (room) =>
            room.address.toLowerCase().includes(branchName.toLowerCase()) ||
            room.name.toLowerCase().includes(branchName.toLowerCase()),
    );

    // Fallback to general rooms if none matching the city
    const displayRooms =
        filteredRooms.length > 0 ? filteredRooms : ROOMS.slice(0, 3);

    // Dynamic Google Map Embed URL
    const mapEmbedUrl = `https://maps.google.com/maps?q=CozQta%20${encodeURIComponent(branchName)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title={`Cabang ${branchName} — CozQta`} />
            <Navbar />

            <main className="flex-1 pt-20 pb-16">
                {/* Banner Section */}
                <section className="relative overflow-hidden bg-indigo-900 py-12 text-white">
                    <div className="to-indigo-850 absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 opacity-90" />
                    <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-indigo-200/80 md:justify-start">
                            <Link
                                href="/"
                                className="transition-colors hover:text-white"
                            >
                                Beranda
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-white">Cabang</span>
                            <ChevronRight size={14} />
                            <span className="font-medium text-white">
                                {branchName}
                            </span>
                        </div>

                        <div className="text-center md:text-left">
                            <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/35 px-3 py-1 text-xs font-semibold">
                                <Building2 size={13} /> Cabang Resmi CozQta
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                CozQta Cabang {branchName}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-indigo-200/90 sm:text-base">
                                Temukan pilihan kamar kos terbaik dengan
                                standarisasi kenyamanan bintang lima di{' '}
                                {branchName}.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Left: Detail & Description */}
                        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
                            <div>
                                <h2 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
                                    Informasi Cabang
                                </h2>
                                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                                    {currentBranch.desc}
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-slate-100 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            Alamat Kantor Cabang
                                        </h4>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                                            {currentBranch.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            Hubungi CS Cabang
                                        </h4>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                                            {currentBranch.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                                        <Star
                                            size={18}
                                            className="fill-amber-400"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            Rating Kepuasan Penghuni
                                        </h4>
                                        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                            {currentBranch.rating} / 5.0{' '}
                                            <span className="text-xs font-normal text-slate-400">
                                                (Terverifikasi)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                                <a
                                    href={`https://wa.me/${currentBranch.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-600"
                                >
                                    <MessageSquare size={16} /> Hubungi WhatsApp
                                    CS
                                </a>
                                <Btn variant="outline" href="/rooms">
                                    <Compass size={16} /> Cari Kamar Lainnya
                                </Btn>
                            </div>
                        </div>

                        {/* Right: Map Embed */}
                        <div className="space-y-4 lg:col-span-5">
                            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <Map
                                            size={16}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm font-bold text-slate-800">
                                            Peta Lokasi Cabang
                                        </span>
                                    </div>
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                </div>

                                {/* Responsive Map Container */}
                                <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-100 sm:h-[350px]">
                                    <iframe
                                        src={mapEmbedUrl}
                                        className="absolute inset-0 h-full w-full border-0"
                                        allowFullScreen={false}
                                        loading="lazy"
                                        title={`Peta Lokasi CozQta Cabang ${branchName}`}
                                    />
                                </div>
                            </div>

                            {/* Verified Badge */}
                            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100/40 bg-indigo-50/50 p-4">
                                <Shield
                                    size={24}
                                    className="flex-shrink-0 text-indigo-600"
                                />
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-950">
                                        Jaminan Keamanan & Verifikasi
                                    </h4>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Seluruh properti kos di cabang ini telah
                                        diverifikasi secara fisik 100% oleh tim
                                        surveyor lapangan kami.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rooms Listing Section */}
                <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
                        <div>
                            <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase sm:text-sm">
                                Contoh Kamar
                            </span>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Rekomendasi Kost Terpopuler
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                Kamar kost premium di area cabang {branchName}
                            </p>
                        </div>
                        <Btn
                            variant="outline"
                            size="sm"
                            href={`/rooms?location=${branchName}`}
                        >
                            Lihat Semua Cabang ini <ArrowRight size={14} />
                        </Btn>
                    </div>

                    {filteredRooms.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {displayRooms.map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center text-sm text-amber-800">
                                ⚠️ Belum ada listing kamar khusus di Cabang ini.
                                Menampilkan rekomendasi kamar populer di cabang
                                lainnya.
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {displayRooms.map((room) => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
