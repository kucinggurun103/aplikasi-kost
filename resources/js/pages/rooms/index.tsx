import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Search,
    MapPin,
    Filter,
    Grid,
    List as ListIcon,
    ChevronRight,
    CheckCircle2,
    DollarSign,
    LayoutGrid,
} from 'lucide-react';
import { ROOMS, Room, fmtShort } from '@/components/cozqta/data';
import {
    Navbar,
    Footer,
    RoomCard,
    Btn,
    Badge,
    SearchableSelect,
} from '@/components/cozqta/primitives';

export default function RoomsIndex() {
    const { url, props } = usePage();
    const rooms = (props as any).rooms || [];
    const globalBranches = (props as any).global_branches || [];
    const globalFacilities = (props as any).global_facilities || [];
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('Semua');
    const [facilityFilter, setFacilityFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [priceFilter, setPriceFilter] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [wishlist, setWishlist] = useState<Set<number>>(new Set([1, 4]));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let locSlug = null;
            let loc = null;
            let typ = null;
            let maxP = null;

            const params = new URLSearchParams(window.location.search);
            if (params.has('lokasi')) locSlug = params.get('lokasi');
            if (params.has('location')) loc = params.get('location');
            if (params.has('type')) typ = params.get('type');
            if (params.has('maxPrice')) maxP = params.get('maxPrice');

            const pendingStr = sessionStorage.getItem('pending_room_filters');
            if (pendingStr) {
                try {
                    const pending = JSON.parse(pendingStr);
                    if (pending.lokasi) locSlug = pending.lokasi;
                    if (pending.type) typ = pending.type;
                    if (pending.maxPrice) maxP = pending.maxPrice;
                } catch (e) {}
                sessionStorage.removeItem('pending_room_filters');
            }

            if (locSlug) {
                const branch = globalBranches.find(
                    (b: any) => b.slug === locSlug,
                );
                if (branch) {
                    setBranchFilter(branch.name);
                } else {
                    setBranchFilter(locSlug.replace(/-/g, ' '));
                }
            } else if (loc) {
                setBranchFilter(loc);
            }
            if (typ) setGenderFilter(typ);
            if (maxP) setPriceFilter(maxP);

            if (params.toString()) {
                window.history.replaceState({}, '', '/rooms');
            }
        }
    }, [url, globalBranches]);

    const toggleWish = (id: number) => {
        const next = new Set(wishlist);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setWishlist(next);
    };

    const genders = ['Semua', 'Pria', 'Wanita', 'Campur'];

    const filteredRooms = rooms
        .filter((r: any) => {
            const matchSearch = search
                ? r.name.toLowerCase().includes(search.toLowerCase()) ||
                  r.address.toLowerCase().includes(search.toLowerCase())
                : true;
            const matchGender =
                genderFilter === 'Semua' || r.gender === genderFilter;
            const matchFacility =
                !facilityFilter ||
                r.facilities.some((f: string) =>
                    f.toLowerCase().includes(facilityFilter.toLowerCase()),
                );
            const matchBranch =
                !branchFilter ||
                r.address.toLowerCase() === branchFilter.toLowerCase();
            const matchStatus =
                statusFilter === 'Semua Status' ||
                (statusFilter === 'Tersedia' && r.status === 'Available') ||
                (statusFilter === 'Terisi' && r.status !== 'Available');
            const matchPrice = !priceFilter || r.price <= parseInt(priceFilter);

            return (
                matchSearch &&
                matchGender &&
                matchFacility &&
                matchBranch &&
                matchStatus &&
                matchPrice
            );
        })
        .sort((a: any, b: any) => {
            if (a.status === 'Available' && b.status !== 'Available') return -1;
            if (a.status !== 'Available' && b.status === 'Available') return 1;
            return 0;
        });

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans text-slate-900 antialiased">
            <Head title="Cari Kamar Kost — CozQta" />
            <Navbar />

            <main className="flex-1 pt-20 pb-16">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                        <a href="/" className="hover:text-indigo-600">
                            Beranda
                        </a>
                        <ChevronRight size={14} />
                        <span className="font-medium text-slate-900">
                            Cari Kamar
                        </span>
                    </div>

                    <div className="mb-8 text-center md:text-left">
                        <h1 className="mb-2 text-3xl font-bold text-slate-900">
                            Semua Kamar Kost
                        </h1>
                        <p className="text-sm text-slate-500">
                            Temukan kamar kost yang sesuai dengan preferensi,
                            anggaran, dan lokasi tujuanmu
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                        <div className="relative mb-5 w-full">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm text-slate-900 transition-colors hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none md:text-base"
                            />
                        </div>

                        <div className="flex w-full flex-col flex-wrap items-center justify-between gap-3 sm:flex-row lg:justify-start">
                            <div className="flex w-full items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 sm:w-auto">
                                {genders.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGenderFilter(g)}
                                        className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:flex-none ${genderFilter === g ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>

                            <div className="grid w-full flex-1 grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap">
                                <div className="group relative min-w-[180px] flex-[1.5]">
                                    <MapPin
                                        size={14}
                                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                                    />
                                    <SearchableSelect
                                        value={branchFilter}
                                        onChange={(val) => setBranchFilter(val)}
                                        options={[
                                            {
                                                label: 'Semua Cabang',
                                                value: '',
                                            },
                                            ...globalBranches.map((b: any) => ({
                                                label: b.name,
                                                value: b.name,
                                            })),
                                        ]}
                                        className="border-slate-200 !bg-slate-50 !py-2.5 pl-9"
                                    />
                                </div>

                                <div className="group relative min-w-[130px] flex-1">
                                    <CheckCircle2
                                        size={14}
                                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                                    />
                                    <SearchableSelect
                                        value={statusFilter}
                                        onChange={(val) => setStatusFilter(val)}
                                        options={[
                                            {
                                                label: 'Semua Status',
                                                value: 'Semua Status',
                                            },
                                            {
                                                label: 'Tersedia',
                                                value: 'Tersedia',
                                            },
                                            {
                                                label: 'Terisi',
                                                value: 'Terisi',
                                            },
                                        ]}
                                        className="border-slate-200 !bg-slate-50 !py-2.5 pl-9"
                                    />
                                </div>

                                <div className="group relative min-w-[130px] flex-1">
                                    <DollarSign
                                        size={14}
                                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                                    />
                                    <SearchableSelect
                                        value={priceFilter}
                                        onChange={(val) => setPriceFilter(val)}
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
                                        className="border-slate-200 !bg-slate-50 !py-2.5 pl-9"
                                    />
                                </div>

                                <div className="group relative min-w-[140px] flex-1">
                                    <LayoutGrid
                                        size={14}
                                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
                                    />
                                    <SearchableSelect
                                        value={facilityFilter}
                                        onChange={(val) =>
                                            setFacilityFilter(val)
                                        }
                                        options={[
                                            {
                                                label: 'Semua Fasilitas',
                                                value: '',
                                            },
                                            ...globalFacilities.map(
                                                (f: any) => ({
                                                    label: f.name,
                                                    value: f.name,
                                                }),
                                            ),
                                        ]}
                                        className="border-slate-200 !bg-slate-50 !py-2.5 pl-9"
                                    />
                                </div>
                            </div>

                            <div className="ml-auto hidden overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:flex lg:ml-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <ListIcon size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                        <span>
                            Menampilkan{' '}
                            <strong className="text-slate-800">
                                {filteredRooms.length}
                            </strong>{' '}
                            kamar kost tersedia
                        </span>
                        {(search ||
                            genderFilter !== 'Semua' ||
                            facilityFilter ||
                            branchFilter ||
                            statusFilter !== 'Semua Status' ||
                            priceFilter) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setGenderFilter('Semua');
                                    setFacilityFilter('');
                                    setBranchFilter('');
                                    setStatusFilter('Semua Status');
                                    setPriceFilter('');
                                }}
                                className="text-xs font-medium text-indigo-600 hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {filteredRooms.length === 0 ? (
                        <div className="my-8 rounded-2xl border border-slate-100 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Search size={28} />
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-slate-800">
                                Kamar tidak ditemukan
                            </h3>
                            <p className="mx-auto mb-6 max-w-md text-sm text-slate-500">
                                Kami tidak menemukan kamar kost yang cocok
                                dengan filter atau kata kunci pencarianmu.
                            </p>
                            <Btn
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    setGenderFilter('Semua');
                                    setFacilityFilter('');
                                    setBranchFilter('');
                                    setStatusFilter('Semua Status');
                                    setPriceFilter('');
                                }}
                            >
                                Reset Pencarian
                            </Btn>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredRooms.map((room: any) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    wishlist={wishlist}
                                    toggleWish={toggleWish}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRooms.map((room: any) => (
                                <div
                                    key={room.id}
                                    className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row"
                                >
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="h-32 w-full flex-shrink-0 rounded-xl object-cover sm:w-48"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <Badge variant="outline">
                                                {room.type}
                                            </Badge>
                                            {room.status === 'Available' ? (
                                                <Badge variant="success">
                                                    Tersedia
                                                </Badge>
                                            ) : room.status === 'Reserved' ? (
                                                <Badge variant="warning">
                                                    Di-booking
                                                </Badge>
                                            ) : room.status === 'Occupied' ? (
                                                <Badge variant="danger">
                                                    Terisi
                                                </Badge>
                                            ) : room.status ===
                                              'Maintenance' ? (
                                                <Badge variant="default">
                                                    Perbaikan
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    {room.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-slate-900">
                                            {room.name}
                                        </h3>
                                        <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin size={12} /> {room.address}
                                        </p>
                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {room.facilities
                                                .slice(0, 3)
                                                .map((f: any) => {
                                                    const name =
                                                        typeof f === 'string'
                                                            ? f
                                                            : f.name;
                                                    return (
                                                        <span
                                                            key={name}
                                                            className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                                                        >
                                                            {name}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <div className="flex w-full items-end justify-between gap-3 border-t border-slate-100 pt-3 sm:w-auto sm:flex-col sm:justify-center sm:border-t-0 sm:pt-0">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">
                                                {fmtShort(room.price)}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                / bulan
                                            </p>
                                        </div>
                                        <Btn
                                            variant="primary"
                                            size="sm"
                                            href={`/rooms/${room.id}`}
                                        >
                                            Lihat Detail
                                        </Btn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
