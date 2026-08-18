import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  Search, MapPin, DollarSign, ArrowRight, Shield, Zap,
  CreditCard, MessageSquare, Star, ChevronDown, CheckCircle2, HelpCircle
} from 'lucide-react';
import { ROOMS, TESTIMONIALS, FAQ_ITEMS, Room } from '@/components/cozqta/data';
import { Navbar, Footer, RoomCard, Btn, Avatar, StarRating, SearchableSelect } from '@/components/cozqta/primitives';

function HeroSection() {
  const { props } = usePage();
  const globalBranches = (props as any).global_branches || [];
  const [searchState, setSearchState] = useState({
    location: '', // display name
    lokasi: '',   // slug for filtering
    maxPrice: '',
    type: 'Semua',
    available: true,
  });

  const [locationOpen, setLocationOpen] = useState(false);
  const roomTypes = ['Semua', 'Pria', 'Wanita', 'Campur'];
  
  const filteredBranches = globalBranches.filter((b: any) => 
    b.name.toLowerCase().includes(searchState.location.toLowerCase())
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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=75&auto=format"
          alt="Modern apartment interior"
          className="w-full h-full object-cover bg-slate-800"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-slate-900/75 to-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="max-w-4xl mx-auto mb-10 animate-fade-in text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 tracking-tight text-left">
            Temukan Kost<br />
            <span className="text-indigo-300">Impianmu</span> Sekarang
          </h1>
          <p className="text-lg text-white/80 max-w-xl leading-relaxed text-left">
            Platform terpercaya untuk mencari dan mengelola kost di seluruh Indonesia. Mudah, aman, dan transparan.
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto text-left">
          <h2 className="text-slate-900 font-semibold text-base mb-4 flex items-center gap-2">
            <Search size={18} className="text-indigo-600" /> Cari Kamar Kost
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Lokasi</label>
              <div className="relative">
                <input
                  value={searchState.location}
                  onFocus={() => setLocationOpen(true)}
                  onBlur={() => setTimeout(() => setLocationOpen(false), 200)}
                  onChange={e => {
                    setSearchState({ ...searchState, location: e.target.value });
                    if (!locationOpen) setLocationOpen(true);
                  }}
                  placeholder="Cari Cabang..."
                  className="w-full pl-4 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform pointer-events-none ${locationOpen ? 'rotate-180' : ''}`} />

                {locationOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-80 overflow-y-auto z-50 py-1">
                    <button
                      type="button"
                      onMouseDown={() => {
                        setSearchState({ ...searchState, location: '', lokasi: '' });
                        setLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${searchState.location === '' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600'}`}
                    >
                      Semua Cabang
                    </button>
                    {filteredBranches.length > 0 ? (
                      filteredBranches.map((b: any) => (
                        <button
                          key={b.id}
                          type="button"
                          onMouseDown={() => {
                            setSearchState({ ...searchState, location: b.name, lokasi: b.slug });
                            setLocationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between ${searchState.location.toLowerCase() === b.name.toLowerCase() ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'}`}
                        >
                          <span>{b.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Cabang tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Harga Maks</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <SearchableSelect
                  value={searchState.maxPrice}
                  onChange={val => setSearchState({ ...searchState, maxPrice: val })}
                  options={[
                    {label: 'Semua Harga', value: ''},
                    {label: 's/d Rp 1jt', value: '1000000'},
                    {label: 's/d Rp 2jt', value: '2000000'},
                    {label: 's/d Rp 3jt', value: '3000000'},
                    {label: 's/d Rp 5jt', value: '5000000'}
                  ]}
                  className="pl-8 !py-2.5 !bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Tipe Kost</label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                {roomTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSearchState({ ...searchState, type: t })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${searchState.type === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
              <input
                type="checkbox"
                checked={searchState.available}
                onChange={e => setSearchState({ ...searchState, available: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Tampilkan Hanya Kamar Tersedia
            </label>
            <Btn variant="primary" size="md" onClick={handleSearch} className="w-full md:w-auto justify-center">
              <Search size={15} /> Cari Sekarang
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedRooms({ rooms, wishlist, toggleWish }: { rooms: Room[]; wishlist: Set<number>; toggleWish: (id: number) => void }) {
  const [filter, setFilter] = useState('Semua');
  const types = ['Semua', 'Putra', 'Putri', 'Campur'];
  
  const filtered = filter === 'Semua' 
    ? rooms.slice(0, 3) 
    : rooms.filter((r: any) => {
        const genderMatch = filter === 'Putra' ? 'Pria' : filter === 'Putri' ? 'Wanita' : filter;
        return r.gender === genderMatch;
      }).slice(0, 3);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">PILIHAN TERBAIK</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Rekomendasi Kost Terpopuler</h2>
            <p className="text-slate-500 text-sm mt-1">Kamar kost pilihan terbaik dengan tingkat kenyamanan maksimal</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 self-start sm:self-auto">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filtered.map((r: any) => (
              <RoomCard key={r.id} room={r} wishlist={wishlist} toggleWish={toggleWish} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center my-8 mb-10 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-70"></div>
            
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-5 relative z-10">
              <Search size={32} />
            </div>
            
            <h3 className="font-bold text-slate-900 text-xl mb-2 relative z-10">Ups! Belum Ada Kamar</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 relative z-10 leading-relaxed">
              Maaf, saat ini belum ada kamar untuk tipe <span className="font-semibold text-indigo-600">"{filter}"</span>. Silakan telusuri tipe kamar kami yang lainnya!
            </p>
            
            <button 
              onClick={() => setFilter('Semua')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shadow-indigo-200 relative z-10 flex items-center gap-2"
            >
              Lihat Semua Kamar <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="text-center">
          <Btn variant="outline" size="lg" href="/rooms">
            Lihat Semua Kamar ({rooms.length}) <ArrowRight size={18} />
          </Btn>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { icon: Shield, title: "Keamanan Terjamin", desc: "Properti kos 100% terverifikasi fisik dengan fasilitas CCTV & sistem smart key card." },
    { icon: Zap, title: "Proses Cepat & Instan", desc: "Cari, pesan, bayar, dan terima e-ticket akses kamar langsung dalam hitungan menit." },
    { icon: MessageSquare, title: "Chat Pemilik Langsung", desc: "Tanya jawab atau jadwalkan survei lokasi dengan pemilik kos tanpa perantara." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">KEUNGGULAN KAMI</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Mengapa Memilih CozQta?</h2>
          <p className="text-slate-500 text-sm mt-2">Kami menghadirkan pengalaman hunian sewa kos modern terbaik di Indonesia</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map(item => (
            <div key={item.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform">
                <item.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-950 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }: { testimonials: any[] }) {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">TESTIMONI PENGHUNI</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Apa Kata Mereka?</h2>
          <p className="text-slate-500 text-sm mt-2">Ribuan penghuni dan pemilik kost telah merasakan manfaat platform CozQta</p>
        </div>
        
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center max-w-3xl mx-auto shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Testimoni</h3>
            <p className="text-slate-500">Jadilah yang pertama untuk merasakan pengalaman menginap terbaik di properti kami dan bagikan ceritamu!</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 mx-auto ${
            testimonials.length === 1 ? 'md:grid-cols-1 max-w-md' : 
            testimonials.length === 2 ? 'md:grid-cols-2 max-w-3xl' : 
            'md:grid-cols-3'
          }`}>
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, idx) => (
                      <Star key={idx} size={16} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">"{t.review_text || t.text}"</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-100 w-full">
                  <Avatar src={t.avatar || `https://ui-avatars.com/api/?name=${t.reviewer_name || t.name}&background=6366f1&color=fff`} name={t.reviewer_name || t.name} />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.reviewer_name || t.name}</p>
                    <p className="text-slate-400 text-xs">{(t.branch?.name) || t.role} · {t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID') : t.date}</p>
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
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">TANYA JAWAB</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Pertanyaan Umum (FAQ)</h2>
          <p className="text-slate-500 text-sm mt-2">Temukan jawaban cepat atas pertanyaan seputar pemesanan kost</p>
        </div>
        
        {faqs.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-12 text-center shadow-sm relative overflow-hidden">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 shadow-sm border border-slate-100">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada FAQ</h3>
            <p className="text-slate-500">Pertanyaan-pertanyaan umum akan segera ditambahkan di sini untuk membantu Anda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 text-sm sm:text-base"
                >
                  <span>{faq.question || faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3">
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
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Head title="CozQta - Temukan Kost Impianmu Sekarang" />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedRooms rooms={rooms} wishlist={wishlist} toggleWish={toggleWish} />
        <WhyChooseUs />
        <Testimonials testimonials={testimonials} />
        <FAQSection faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
}
