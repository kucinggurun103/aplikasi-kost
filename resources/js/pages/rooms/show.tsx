import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Wifi, Wind, Tv, Car, Package, Zap, Bath, Droplets, Coffee, ChevronRight,
  Star, MapPin, BedDouble, Layers, Building, Calendar, MessageSquare, ShieldCheck,
  Heart, Share2, Check, Refrigerator, Utensils, Sparkles, CheckCircle2, Shield,
  Dumbbell, Waves, Search
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import { Navbar, Footer, Badge, Btn, Avatar } from '@/components/cozqta/primitives';

export default function RoomShow({ room: propRoom, similarRooms: propSimilar }: { room?: any, similarRooms?: any[] }) {
  const { url, props } = usePage();
  const room = propRoom || (props as any).room || ROOMS[0];
  const similarRooms = propSimilar || (props as any).similarRooms || [];

  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const imgs = room.images && room.images.length > 0
    ? room.images
    : [room.image || 'https://placehold.co/800x420/e2e8f0/64748b?text=Belum+Ada+Foto'];

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
    const name = typeof facility === 'string' ? facility : (facility?.name || '');
    const clean = name.toLowerCase().trim();
    if (clean.includes('wifi')) return Wifi;
    if (clean.includes('ac')) return Wind;
    if (clean.includes('tv')) return Tv;
    if (clean.includes('kulkas')) return Refrigerator;
    if (clean.includes('listrik')) return Zap;
    if (clean.includes('air')) return Droplets;
    if (clean.includes('aman') || clean.includes('security')) return ShieldCheck;
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
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Head title={`${room.name} — CozQta`}>
        {room.description && <meta head-key="description" name="description" content={room.description} />}
        {room.description && <meta head-key="og:description" property="og:description" content={room.description} />}
      </Head>
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Beranda</Link>
              <ChevronRight size={14} />
              <Link href="/rooms" className="hover:text-indigo-600 transition-colors">Cari Kamar</Link>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{room.name}</span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShare}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs">
                <div className="relative">
                  <img
                    src={imgs[activeImg]}
                    alt={room.name}
                    className="w-full h-80 sm:h-[420px] object-cover bg-slate-100 transition-all duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant={room.status === 'Available' ? 'success' : room.status === 'Reserved' ? 'warning' : room.status === 'Occupied' ? 'danger' : 'default'}>
                      {room.status === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1" />}
                      {room.status === 'Available' ? 'Tersedia' : room.status === 'Reserved' ? 'Di-booking' : room.status === 'Occupied' ? 'Terisi' : room.status}
                    </Badge>
                    <Badge variant="outline">{room.type}</Badge>
                  </div>
                </div>

                <div className="p-4 bg-white flex gap-3 overflow-x-auto border-t border-slate-100">
                  {imgs.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'ring-2 ring-indigo-600 scale-95 shadow-xs' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover bg-slate-100" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{room.name}</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                      <span>{room.address}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-extrabold text-indigo-600">{fmtShort(room.price)}</p>
                    <p className="text-slate-400 text-xs mt-0.5">per Bulan</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-100 my-6 bg-slate-50 rounded-2xl px-4">
                  {[
                    { icon: BedDouble, label: 'Ukuran Kamar', val: `${room.size} m²` },
                    { icon: Layers, label: 'Posisi Lantai', val: `Lantai ${room.floor}` },
                    { icon: Building, label: 'Nama Gedung', val: room.building },
                  ].map(info => (
                    <div key={info.label} className="text-center">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2 text-indigo-600">
                        <info.icon size={20} />
                      </div>
                      <p className="text-xs text-slate-400 mb-0.5">{info.label}</p>
                      <p className="text-sm font-bold text-slate-800">{info.val}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Deskripsi Kost</h3>
                  {room.description ? (
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {room.description}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-sm italic">Belum ada deskripsi.</p>
                  )}
                </div>

                  {(() => {
                    const freeFacilities = room.facilities.filter((f: any) => (typeof f === 'string' ? 0 : f.price) === 0);
                    const paidFacilities = room.facilities.filter((f: any) => (typeof f === 'string' ? 0 : f.price) > 0);

                    return (
                      <div className="space-y-8">
                        {freeFacilities.length > 0 && (
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">
                              Fasilitas Utama (Termasuk)
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {freeFacilities.map((f: any) => {
                                const name = typeof f === 'string' ? f : f.name;
                                const IconComponent = getFacilityIcon(f);
                                return (
                                  <div
                                    key={name}
                                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/70 transition-colors"
                                  >
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shadow-2xs flex-shrink-0">
                                      <IconComponent size={16} />
                                    </div>
                                    <span className="truncate">{name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {paidFacilities.length > 0 && (
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-4">
                              Fasilitas Tambahan (Opsional)
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {paidFacilities.map((f: any) => {
                                const name = typeof f === 'string' ? f : f.name;
                                const price = typeof f === 'string' ? 0 : f.price;
                                const IconComponent = getFacilityIcon(f);
                                return (
                                  <div
                                    key={name}
                                    className="flex flex-col justify-between gap-2.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/70 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shadow-2xs flex-shrink-0">
                                        <IconComponent size={16} />
                                      </div>
                                      <span className="truncate text-slate-900 font-semibold">{name}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs self-start">
                                      + {fmtIDR(price)} / bln
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Lokasi & Peta Sekitar</h3>
                <div className="bg-slate-100 rounded-2xl h-64 flex flex-col items-center justify-center text-slate-500 border border-slate-200 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="relative z-10 text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 max-w-sm">
                    <MapPin size={36} className="mx-auto mb-2 text-indigo-600 animate-bounce" />
                    <p className="text-base font-bold text-slate-900 mb-1">Peta Lokasi Interaktif</p>
                    <p className="text-xs text-slate-500 mb-4">{room.address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(room.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                    >
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>


            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Building size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">{room.building}</p>
                    <p className="text-xs text-slate-400">Properti Cabang Terverifikasi</p>
                  </div>
                </div>

                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Harga Sewa Per Bulan</span>
                    <span className="font-bold text-slate-900">{fmtIDR(room.price)}</span>
                  </div>
                  {room.booking_price > 0 && (
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Biaya Booking / DP</span>
                      <span className="font-bold text-slate-900">{fmtIDR(room.booking_price)}</span>
                    </div>
                  )}
                  {room.deposit_type !== 'None' && room.deposit_price > 0 && (
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Deposit (Refundable) {room.deposit_type === 'AtEnd' ? <span className="text-[10px] text-amber-500 font-medium ml-1">(Bayar Nanti)</span> : ''}</span>
                      <span className="font-bold text-slate-900">{fmtIDR(room.deposit_price)}</span>
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
                    <Calendar size={18} /> Pesan Kamar Sekarang
                  </Btn>
                  <Btn
                    variant="outline"
                    size="lg"
                    onClick={handleChat}
                    className="w-full justify-center text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                  >
                    <MessageSquare size={18} /> Chat via WhatsApp
                  </Btn>
                </div>

                <div className="mt-6 p-3.5 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2.5">
                  <Shield size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-green-800">Jaminan Keamanan & Verifikasi</p>
                    <p className="text-[11px] text-green-700 leading-normal mt-0.5">
                      Properti ini telah melewati proses verifikasi fisik, kelayakan, keamanan, dan kepemilikan oleh tim surveyor lapangan CozQta.
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
