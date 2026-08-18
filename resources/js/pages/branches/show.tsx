import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
  MapPin, Building2, Star, ArrowRight, ChevronRight, Phone, Mail, 
  Map, Compass, Shield, CheckCircle2, MessageSquare
} from 'lucide-react';
import { ROOMS, Room } from '@/components/cozqta/data';
import { Navbar, Footer, RoomCard, Btn, Badge } from '@/components/cozqta/primitives';

export default function BranchShow() {
  const { url } = usePage();
  
  // Extract branch name from URL (e.g., /branches/Bandung -> Bandung)
  const pathParts = url.split('/');
  const rawBranchName = pathParts[pathParts.length - 1]?.split('?')[0] || 'Jakarta';
  const branchName = decodeURIComponent(rawBranchName);

  // Branch statistics and mock description based on city
  const branchDetails: Record<string, { desc: string; address: string; phone: string; rating: number }> = {
    Jakarta: {
      desc: 'Cabang utama CozQta terletak di pusat bisnis dan pemerintahan. Menyediakan akses mudah ke berbagai stasiun MRT, Halte TransJakarta, pusat perbelanjaan, serta gedung perkantoran elit di Sudirman, Thamrin, dan Kuningan.',
      address: 'Hub CozQta Central Jakarta, Jl. Jend. Sudirman Kav. 21, Jakarta Pusat',
      phone: '+62 812-3456-7890',
      rating: 4.9,
    },
    Bandung: {
      desc: 'Cabang Paris van Java menghadirkan hunian sejuk dan estetik yang dekat dengan berbagai universitas ternama seperti ITB, Unpad, dan UPI. Sangat cocok bagi kalangan akademisi dan profesional muda.',
      address: 'Hub CozQta Dago, Jl. Ir. H. Juanda No. 102, Coblong, Bandung',
      phone: '+62 812-3456-7891',
      rating: 4.8,
    },
    Surabaya: {
      desc: 'Cabang Kota Pahlawan berlokasi strategis di area industri, perkantoran, dan kampus ternama seperti ITS dan Unair. Menyediakan fasilitas premium untuk menunjang kenyamanan produktivitas Anda.',
      address: 'Hub CozQta Gubeng, Jl. Raya Gubeng No. 44, Gubeng, Surabaya',
      phone: '+62 812-3456-7892',
      rating: 4.7,
    },
    Yogyakarta: {
      desc: 'Mengusung konsep hunian ramah pelajar dan berbudaya, cabang Yogyakarta dekat dengan UGM, UNY, dan Malioboro. Menawarkan lingkungan belajar yang kondusif dengan harga yang bersahabat.',
      address: 'Hub CozQta Sleman, Jl. Kaliurang Km 5.5, Depok, Sleman, Yogyakarta',
      phone: '+62 812-3456-7893',
      rating: 4.8,
    },
    Malang: {
      desc: 'Nikmati suasana sejuk pegunungan di cabang Malang yang sangat dekat dengan Universitas Brawijaya dan UMM. Tempat hunian modern yang tenang dan nyaman untuk fokus belajar.',
      address: 'Hub CozQta Lowokwaru, Jl. Soekarno Hatta No. 12, Lowokwaru, Malang',
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
  const filteredRooms = ROOMS.filter(room => 
    room.address.toLowerCase().includes(branchName.toLowerCase()) ||
    room.name.toLowerCase().includes(branchName.toLowerCase())
  );

  // Fallback to general rooms if none matching the city
  const displayRooms = filteredRooms.length > 0 ? filteredRooms : ROOMS.slice(0, 3);

  // Dynamic Google Map Embed URL
  const mapEmbedUrl = `https://maps.google.com/maps?q=CozQta%20${encodeURIComponent(branchName)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Head title={`Cabang ${branchName} — CozQta`} />
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* Banner Section */}
        <section className="bg-indigo-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-850 opacity-90" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-sm text-indigo-200/80 mb-4 justify-center md:justify-start">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight size={14} />
              <span className="text-white">Cabang</span>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{branchName}</span>
            </div>
            
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1 bg-indigo-500/35 border border-indigo-400/30 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                <Building2 size={13} /> Cabang Resmi CozQta
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                CozQta Cabang {branchName}
              </h1>
              <p className="text-indigo-200/90 text-sm sm:text-base mt-2 max-w-2xl">
                Temukan pilihan kamar kos terbaik dengan standarisasi kenyamanan bintang lima di {branchName}.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Detail & Description */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Informasi Cabang</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {currentBranch.desc}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alamat Kantor Cabang</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentBranch.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hubungi CS Cabang</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentBranch.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
                    <Star size={18} className="fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating Kepuasan Penghuni</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      {currentBranch.rating} / 5.0 <span className="text-slate-400 font-normal text-xs">(Terverifikasi)</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-3">
                <a 
                  href={`https://wa.me/${currentBranch.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
                >
                  <MessageSquare size={16} /> Hubungi WhatsApp CS
                </a>
                <Btn variant="outline" href="/rooms">
                  <Compass size={16} /> Cari Kamar Lainnya
                </Btn>
              </div>
            </div>

            {/* Right: Map Embed */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Map size={16} className="text-indigo-600" />
                    <span className="text-sm font-bold text-slate-800">Peta Lokasi Cabang</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                
                {/* Responsive Map Container */}
                <div className="relative w-full h-[280px] sm:h-[350px] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                  <iframe
                    src={mapEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    title={`Peta Lokasi CozQta Cabang ${branchName}`}
                  />
                </div>
              </div>

              {/* Verified Badge */}
              <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100/40 p-4 flex items-center gap-3">
                <Shield size={24} className="text-indigo-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">Jaminan Keamanan & Verifikasi</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Seluruh properti kos di cabang ini telah diverifikasi secara fisik 100% oleh tim surveyor lapangan kami.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Rooms Listing Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-center sm:text-left">
            <div>
              <span className="text-indigo-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">Contoh Kamar</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Rekomendasi Kost Terpopuler</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Kamar kost premium di area cabang {branchName}</p>
            </div>
            <Btn variant="outline" size="sm" href={`/rooms?location=${branchName}`}>
              Lihat Semua Cabang ini <ArrowRight size={14} />
            </Btn>
          </div>

          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center text-amber-800 text-sm">
                ⚠️ Belum ada listing kamar khusus di Cabang ini. Menampilkan rekomendasi kamar populer di cabang lainnya.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayRooms.map(room => (
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
