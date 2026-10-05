import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    MapPin,
    DollarSign,
    ArrowRight,
    Shield,
    Zap,
    CreditCard,
    MessageSquare,
    Star,
    ChevronDown,
    CheckCircle2,
    HelpCircle,
} from 'lucide-react';
import { ROOMS, TESTIMONIALS, FAQ_ITEMS, Room } from '@/components/cozqta/data';
import {
    Navbar,
    Footer,
    RoomCard,
    Btn,
    Avatar,
    StarRating,
    SearchableSelect,
} from '@/components/cozqta/primitives';

function HeroSection() {
    const { props } = usePage();
    const globalBranches = (props as any).global_branches || [];
    const [searchState, setSearchState] = useState({
        location: '', // display name
        lokasi: '', // slug for filtering
        maxPrice: '',
        type: 'Semua',
        available: true,
    });

    const [locationOpen, setLocationOpen] = useState(false);
    const roomTypes = ['Semua', 'Pria', 'Wanita', 'Campur'];

    const filteredBranches = globalBranches.filter((b: any) =>
        b.name.toLowerCase().includes(searchState.location.toLowerCase()),
    );

    const handleSearch = () => {
        const data: any = {};
        if (searchState.lokasi) data.lokasi = searchState.lokasi;
        if (searchState.type !== 'Semua') data.type = searchState.type;
        if (searchState.maxPrice) data.maxPrice = searchState.maxPrice;

        sessionStorage.setItem('pending_room_filters', JSON.stringify(data));

        router.visit('/rooms', {
            preserveState: true,
        });
    };

    return (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=75&auto=format"
                    alt="Modern apartment interior"
                    className="h-full w-full bg-slate-800 object-cover"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-slate-900/75 to-slate-900/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
                <div className="animate-fade-in mx-auto mb-10 max-w-4xl text-left">
                    <h1 className="mb-5 text-left text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Temukan Kost
                        <br />
                        <span className="text-indigo-300">Impianmu</span>{' '}
                        Sekarang
                    </h1>
                    <p className="max-w-xl text-left text-lg leading-relaxed text-white/80">
                        Platform terpercaya untuk mencari dan mengelola kost di
                        seluruh Indonesia. Mudah, aman, dan transparan.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 text-left shadow-2xl">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                        <Search size={18} className="text-indigo-600" /> Cari
                        Kamar Kost
                    </h2>
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-500">
                                Lokasi
                            </label>
                            <div className="relative">
                                <input
                                    value={searchState.location}
                                    onFocus={() => setLocationOpen(true)}
                                    onBlur={() =>
                                        setTimeout(
                                            () => setLocationOpen(false),
                                            200,
                                        )
                                    }
                                    onChange={(e) => {
                                        setSearchState({
                                            ...searchState,
                                            location: e.target.value,
                                        });
                                        if (!locationOpen)
                                            setLocationOpen(true);
                                    }}
                                    placeholder="Cari Cabang..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-8 pl-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <ChevronDown
                                    size={14}
                                    className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`}
                                />

                                {locationOpen && (
                                    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl">
                                        <button
                                            type="button"
                                            onMouseDown={() => {
                                                setSearchState({
                                                    ...searchState,
                                                    location: '',
                                                    lokasi: '',
                                                });
                                                setLocationOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${searchState.location === '' ? 'bg-indigo-50 font-semibold text-indigo-600' : 'text-slate-600'}`}
                                        >
                                            Semua Cabang
                                        </button>
                                        {filteredBranches.length > 0 ? (
                                            filteredBranches.map((b: any) => (
                                                <button
                                                    key={b.id}
                                                    type="button"
                                                    onMouseDown={() => {
                                                        setSearchState({
                                                            ...searchState,
                                                            location: b.name,
                                                            lokasi: b.slug,
                                                        });
                                                        setLocationOpen(false);
                                                    }}
                                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${searchState.location.toLowerCase() === b.name.toLowerCase() ? 'bg-indigo-50 font-semibold text-indigo-600' : 'text-slate-700'}`}
                                                >
                                                    <span>{b.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-slate-400 italic">
                                                Cabang tidak ditemukan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-500">
                                Harga Maks
                            </label>
                            <div className="relative">
                                <DollarSign
                                    size={14}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                />
                                <SearchableSelect
                                    value={searchState.maxPrice}
                                    onChange={(val) =>
                                        setSearchState({
                                            ...searchState,
                                            maxPrice: val,
                                        })
                                    }
                                    options={[
                                        { label: 'Semua Harga', value: '' },
                                        {
                                            label: 's/d Rp 1jt',
                                            value: '1000000',
                                        },
                                        {
                                            label: 's/d Rp 2jt',
                                            value: '2000000',
                                        },
                                        {
                                            label: 's/d Rp 3jt',
                                            value: '3000000',
                                        },
                                        {
                                            label: 's/d Rp 5jt',
                                            value: '5000000',
                                        },
                                    ]}
                                    className="border-slate-200 !bg-slate-50 !py-2.5 pl-8"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-500">
                                Tipe Kost
                            </label>
                            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                                {roomTypes.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() =>
                                            setSearchState({
                                                ...searchState,
                                                type: t,
                                            })
                                        }
                                        className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${searchState.type === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 md:flex-row md:items-center">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 select-none">
                            <input
                                type="checkbox"
                                checked={searchState.available}
                                onChange={(e) =>
                                    setSearchState({
                                        ...searchState,
                                        available: e.target.checked,
                                    })
                                }
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            Tampilkan Hanya Kamar Tersedia
                        </label>
                        <Btn
                            variant="primary"
                            size="md"
                            onClick={handleSearch}
                            className="w-full justify-center md:w-auto"
                        >
                            <Search size={15} /> Cari Sekarang
                        </Btn>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturedRooms({
    rooms,
    wishlist,
    toggleWish,
}: {
    rooms: Room[];
    wishlist: Set<number>;
    toggleWish: (id: number) => void;
}) {
    const [filter, setFilter] = useState('Semua');
    const types = ['Semua', 'Putra', 'Putri', 'Campur'];

    const filtered =
        filter === 'Semua'
            ? rooms.slice(0, 3)
            : rooms
                  .filter((r: any) => {
                      const genderMatch =
                          filter === 'Putra'
                              ? 'Pria'
                              : filter === 'Putri'
                                ? 'Wanita'
                                : filter;
                      return r.gender === genderMatch;
                  })
                  .slice(0, 3);

    return (
        <section className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">
                            PILIHAN TERBAIK
                        </span>
                        <h2 className="mt-1 text-3xl font-bold text-slate-900">
                            Rekomendasi Kost Terpopuler
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Kamar kost pilihan terbaik dengan tingkat kenyamanan
                            maksimal
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white p-1 sm:self-auto">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${filter === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((r: any) => (
                            <RoomCard
                                key={r.id}
                                room={r}
                                wishlist={wishlist}
                                toggleWish={toggleWish}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in relative my-8 mb-10 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-50 opacity-70 blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-rose-50 opacity-70 blur-3xl"></div>

                        <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <Search size={32} />
                        </div>

                        <h3 className="relative z-10 mb-2 text-xl font-bold text-slate-900">
                            Ups! Belum Ada Kamar
                        </h3>
                        <p className="relative z-10 mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-500">
                            Maaf, saat ini belum ada kamar untuk tipe{' '}
                            <span className="font-semibold text-indigo-600">
                                "{filter}"
                            </span>
                            . Silakan telusuri tipe kamar kami yang lainnya!
                        </p>

                        <button
                            onClick={() => setFilter('Semua')}
                            className="relative z-10 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
                        >
                            Lihat Semua Kamar <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                <div className="text-center">
                    <Btn variant="outline" size="lg" href="/rooms">
                        Lihat Semua Kamar ({rooms.length}){' '}
                        <ArrowRight size={18} />
                    </Btn>
                </div>
            </div>
        </section>
    );
}

function WhyChooseUs() {
    const items = [
        {
            icon: Shield,
            title: 'Keamanan Terjamin',
            desc: 'Properti kos 100% terverifikasi fisik dengan fasilitas CCTV & sistem smart key card.',
        },
        {
            icon: Zap,
            title: 'Proses Cepat & Instan',
            desc: 'Cari, pesan, bayar, dan terima e-ticket akses kamar langsung dalam hitungan menit.',
        },
        {
            icon: MessageSquare,
            title: 'Chat Pemilik Langsung',
            desc: 'Tanya jawab atau jadwalkan survei lokasi dengan pemilik kos tanpa perantara.',
        },
    ];

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">
                        KEUNGGULAN KAMI
                    </span>
                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        Mengapa Memilih CozQta?
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Kami menghadirkan pengalaman hunian sewa kos modern
                        terbaik di Indonesia
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.title}
                            className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all hover:border-indigo-100 hover:bg-indigo-50/30"
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md transition-transform group-hover:scale-110">
                                <item.icon size={20} />
                            </div>
                            <h3 className="mb-2 font-bold text-slate-950">
                                {item.title}
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials({ testimonials }: { testimonials: any[] }) {
    return (
        <section className="border-y border-slate-100 bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">
                        TESTIMONI PENGHUNI
                    </span>
                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        Apa Kata Mereka?
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Ribuan penghuni dan pemilik kost telah merasakan manfaat
                        platform CozQta
                    </p>
                </div>

                {testimonials.length === 0 ? (
                    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-12 text-center shadow-sm">
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">
                            Belum Ada Testimoni
                        </h3>
                        <p className="text-slate-500">
                            Jadilah yang pertama untuk merasakan pengalaman
                            menginap terbaik di properti kami dan bagikan
                            ceritamu!
                        </p>
                    </div>
                ) : (
                    <div
                        className={`mx-auto grid grid-cols-1 gap-6 ${
                            testimonials.length === 1
                                ? 'max-w-md md:grid-cols-1'
                                : testimonials.length === 2
                                  ? 'max-w-3xl md:grid-cols-2'
                                  : 'md:grid-cols-3'
                        }`}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="mb-4 flex items-center gap-1 text-amber-400">
                                        {Array.from({
                                            length: Math.max(
                                                0,
                                                Math.min(
                                                    5,
                                                    Math.round(
                                                        Number(t.rating) || 5,
                                                    ),
                                                ),
                                            ),
                                        }).map((_, idx) => (
                                            <Star
                                                key={idx}
                                                size={16}
                                                className="fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                                        "{t.review_text || t.text}"
                                    </p>
                                </div>
                                <div className="flex w-full flex-col items-center gap-2 border-t border-slate-100 pt-4">
                                    <Avatar
                                        src={
                                            t.avatar ||
                                            `https://ui-avatars.com/api/?name=${t.reviewer_name || t.name}&background=6366f1&color=fff`
                                        }
                                        name={t.reviewer_name || t.name}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {t.reviewer_name || t.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {t.branch?.name || t.role} ·{' '}
                                            {t.created_at
                                                ? new Date(
                                                      t.created_at,
                                                  ).toLocaleDateString('id-ID')
                                                : t.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function FAQSection({ faqs }: { faqs: any[] }) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="border-b border-slate-100 bg-white py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <span className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">
                        TANYA JAWAB
                    </span>
                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        Pertanyaan Umum (FAQ)
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Temukan jawaban cepat atas pertanyaan seputar pemesanan
                        kost
                    </p>
                </div>

                {faqs.length === 0 ? (
                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm">
                            <HelpCircle size={32} />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">
                            Belum Ada FAQ
                        </h3>
                        <p className="text-slate-500">
                            Pertanyaan-pertanyaan umum akan segera ditambahkan
                            di sini untuk membantu Anda.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs"
                            >
                                <button
                                    onClick={() =>
                                        setOpen(open === i ? null : i)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-slate-900 sm:text-base"
                                >
                                    <span>{faq.question || faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {open === i && (
                                    <div className="border-t border-slate-50 px-6 pt-3 pb-5 text-sm leading-relaxed text-slate-600">
                                        {faq.answer || faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default function Welcome() {
    const { props } = usePage();
    const faqs = (props as any).faqs || [];
    const testimonials = (props as any).testimonials || [];
    const rooms = (props as any).rooms || [];
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());

    const toggleWish = (id: number) => {
        setWishlist((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
            <Head title="CozQta - Temukan Kost Impianmu Sekarang" />
            <Navbar />
            <main>
                <HeroSection />
                <FeaturedRooms
                    rooms={rooms}
                    wishlist={wishlist}
                    toggleWish={toggleWish}
                />
                <WhyChooseUs />
                <Testimonials testimonials={testimonials} />
                <FAQSection faqs={faqs} />
            </main>
            <Footer />
        </div>
    );
}
