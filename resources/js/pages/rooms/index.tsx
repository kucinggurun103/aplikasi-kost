import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Search, MapPin, Filter, Grid, List as ListIcon, ChevronRight, CheckCircle2, DollarSign, LayoutGrid } from 'lucide-react';
import { ROOMS, Room, fmtShort } from '@/components/cozqta/data';
import { Navbar, Footer, RoomCard, Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

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
        const branch = globalBranches.find((b: any) => b.slug === locSlug);
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

  const filteredRooms = rooms.filter((r: any) => {
    const matchSearch = search ? (r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase())) : true;
    const matchGender = genderFilter === 'Semua' || r.gender === genderFilter;
    const matchFacility = !facilityFilter || r.facilities.some((f: string) => f.toLowerCase().includes(facilityFilter.toLowerCase()));
    const matchBranch = !branchFilter || r.address.toLowerCase() === branchFilter.toLowerCase();
    const matchStatus = statusFilter === 'Semua Status' || 
                        (statusFilter === 'Tersedia' && r.status === 'Available') ||
                        (statusFilter === 'Terisi' && r.status !== 'Available');
    const matchPrice = !priceFilter || r.price <= parseInt(priceFilter);
    
    return matchSearch && matchGender && matchFacility && matchBranch && matchStatus && matchPrice;
  }).sort((a: any, b: any) => {
    if (a.status === 'Available' && b.status !== 'Available') return -1;
    if (a.status !== 'Available' && b.status === 'Available') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Head title="Cari Kamar Kost — CozQta" />
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <a href="/" className="hover:text-indigo-600">Beranda</a>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Cari Kamar</span>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Semua Kamar Kost</h1>
            <p className="text-slate-500 text-sm">Temukan kamar kost yang sesuai dengan preferensi, anggaran, dan lokasi tujuanmu</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-8">
            <div className="relative w-full mb-5">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari..."
                className="w-full pl-11 pr-4 py-3.5 text-sm md:text-base border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full justify-between lg:justify-start">
              
              <div className="flex w-full sm:w-auto items-center p-1 bg-slate-100/80 border border-slate-200 rounded-xl">
                {genders.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${genderFilter === g ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap w-full sm:w-auto gap-3 flex-1">
                <div className="relative group flex-[1.5] min-w-[180px]">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                  <SearchableSelect
                    value={branchFilter}
                    onChange={val => setBranchFilter(val)}
                    options={[
                      {label: 'Semua Cabang', value: ''},
                      ...globalBranches.map((b: any) => ({ label: b.name, value: b.name }))
                    ]}
                    className="pl-9 !py-2.5 !bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="relative group flex-1 min-w-[130px]">
                  <CheckCircle2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                  <SearchableSelect
                    value={statusFilter}
                    onChange={val => setStatusFilter(val)}
                    options={[
                      {label: 'Semua Status', value: 'Semua Status'},
                      {label: 'Tersedia', value: 'Tersedia'},
                      {label: 'Terisi', value: 'Terisi'}
                    ]}
                    className="pl-9 !py-2.5 !bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="relative group flex-1 min-w-[130px]">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                  <SearchableSelect
                    value={priceFilter}
                    onChange={val => setPriceFilter(val)}
                    options={[
                      {label: 'Semua Harga', value: ''},
                      {label: 's/d Rp 1jt', value: '1000000'},
                      {label: 's/d Rp 2jt', value: '2000000'},
                      {label: 's/d Rp 3jt', value: '3000000'},
                      {label: 's/d Rp 5jt', value: '5000000'}
                    ]}
                    className="pl-9 !py-2.5 !bg-slate-50 border-slate-200"
                  />
                </div>
                
                <div className="relative group flex-1 min-w-[140px]">
                  <LayoutGrid size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                  <SearchableSelect
                    value={facilityFilter}
                    onChange={val => setFacilityFilter(val)}
                    options={[
                      {label: 'Semua Fasilitas', value: ''},
                      ...globalFacilities.map((f: any) => ({ label: f.name, value: f.name }))
                    ]}
                    className="pl-9 !py-2.5 !bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50 ml-auto lg:ml-0">
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
            <span>Menampilkan <strong className="text-slate-800">{filteredRooms.length}</strong> kamar kost tersedia</span>
            {(search || genderFilter !== 'Semua' || facilityFilter || branchFilter || statusFilter !== 'Semua Status' || priceFilter) && (
              <button
                onClick={() => { setSearch(''); setGenderFilter('Semua'); setFacilityFilter(''); setBranchFilter(''); setStatusFilter('Semua Status'); setPriceFilter(''); }}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center my-8">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-1">Kamar tidak ditemukan</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Kami tidak menemukan kamar kost yang cocok dengan filter atau kata kunci pencarianmu.
              </p>
              <Btn variant="outline" size="sm" onClick={() => { setSearch(''); setGenderFilter('Semua'); setFacilityFilter(''); setBranchFilter(''); setStatusFilter('Semua Status'); setPriceFilter(''); }}>
                Reset Pencarian
              </Btn>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room: any) => (
                <RoomCard key={room.id} room={room} wishlist={wishlist} toggleWish={toggleWish} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map((room: any) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img src={room.image} alt={room.name} className="w-full sm:w-48 h-32 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{room.type}</Badge>
                      {room.status === 'Available' ? (
                        <Badge variant="success">Tersedia</Badge>
                      ) : room.status === 'Reserved' ? (
                        <Badge variant="warning">Di-booking</Badge>
                      ) : room.status === 'Occupied' ? (
                        <Badge variant="danger">Terisi</Badge>
                      ) : room.status === 'Maintenance' ? (
                        <Badge variant="default">Perbaikan</Badge>
                      ) : (
                        <Badge variant="outline">{room.status}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base line-clamp-1 mb-1">{room.name}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-3"><MapPin size={12} /> {room.address}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {room.facilities.slice(0, 3).map((f: any) => {
                        const name = typeof f === 'string' ? f : f.name;
                        return (
                          <span key={name} className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <p className="text-indigo-600 font-bold text-lg">{fmtShort(room.price)}</p>
                      <p className="text-slate-400 text-xs">/ bulan</p>
                    </div>
                    <Btn variant="primary" size="sm" href={`/rooms/${room.id}`}>
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
