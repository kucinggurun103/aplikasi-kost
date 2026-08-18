import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
  Check, MapPin, ChevronRight, ChevronLeft, Calendar, User, Phone,
  FileText, BedDouble, Shield, AlertCircle, ArrowRight, DollarSign,
  Clock, Sparkles, Building, CheckCircle2, Tag
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import { Navbar, Footer, Btn, Badge, Avatar } from '@/components/cozqta/primitives';

export default function BookingCreate({ room: propRoom, addons = [] }: { room?: Room, addons?: any[] }) {
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
      setFormData(prev => ({
        ...prev,
        name: auth.user.name || prev.name,
        phone: auth.user.phone || prev.phone,
      }));
    }
  }, [auth?.user]);

  const [duration, setDuration] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);

  const toggleAddon = (addon: any) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
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
  const monthlyAddonPrice = selectedAddons.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const totalAddonPrice = monthlyAddonPrice * duration;

  const adminFee = webSettings?.admin_fee ? parseFloat(webSettings.admin_fee) : 25000;
  const bookingFee = room.booking_price || 0;
  const depositFee = room.deposit_type === 'None' ? 0 : (room.deposit_price || 0);
  
  const firstMonthRent = (room.price * 1) + monthlyAddonPrice;
  const laterPayment = firstMonthRent + depositFee - (duration === 1 ? discountAmount : 0); // simplifikasi
  
  const totalPrice = basePrice + totalAddonPrice - discountAmount + adminFee + depositFee;
  
  const initialPayment = bookingFee > 0 ? (bookingFee + adminFee) : (firstMonthRent - discountAmount + adminFee + depositFee);
  const remainingTotal = totalPrice - initialPayment;

  const handleProceedToPayment = () => {
    router.post('/bookings/create', {
      room_id: room.id,
      duration: duration,
      checkInDate: formData.checkInDate,
      notes: formData.notes,
      addons: selectedAddons.map(a => a.id),
      insurance: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Head title="Pesan Kamar Kost — CozQta" />
      <Navbar activePage="rooms" />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-indigo-600">Beranda</Link>
            <ChevronRight size={14} />
            <Link href={`/rooms/${room.id}`} className="hover:text-indigo-600">{room.name}</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-semibold">Form Pemesanan</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto mb-10 px-4">
              <div className="absolute top-5 left-10 right-10 h-1 bg-slate-200 -z-10 rounded-full" />
              <div
                className="absolute top-5 left-10 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 80}%` }}
              />

              {steps.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shadow-xs ${
                      i + 1 < step
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : i + 1 === step
                        ? 'bg-white border-indigo-600 text-indigo-600 scale-110'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {i + 1 < step ? <Check size={18} className="stroke-[3]" /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold text-center max-w-[100px] ${
                      i + 1 === step ? 'text-indigo-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Langkah 1: Identitas Calon Penghuni</h2>
                      <p className="text-slate-500 text-xs">Pastikan data kontak aktif agar pemilik kost mudah menghubungi Anda.</p>
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3">
                      <Shield size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-900 leading-relaxed">
                        Data identitas Anda dilindungi dengan enkripsi tingkat tinggi dan hanya akan dibagikan kepada pemilik kost setelah pemesanan dikonfirmasi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                          Nama Lengkap (Sesuai KTP/KTN) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama Lengkap (Sesuai KTP/KTN)"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                          Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Nomor WhatsApp / HP Aktif"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                          Tanggal Pemesanan (Booking) <span className="text-red-500">*</span>
                        </label>
                        <div className="p-3 mb-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-2.5">
                          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>Perhatian:</strong> Check-in fisik ke kamar baru dapat dilakukan minimal 1 hari setelah Tanggal Pemesanan yang Anda tentukan di bawah ini.
                          </p>
                        </div>
                        <div className="relative">
                          <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="date"
                            min={minDateString}
                            value={formData.checkInDate}
                            onChange={e => setFormData({ ...formData, checkInDate: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                          Catatan Tambahan untuk Pemilik (Opsional)
                        </label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Catatan Tambahan untuk Pemilik (Opsional)"
                          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <Btn
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          if (!auth?.user) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Harus Login',
                              text: 'Anda harus login sebagai penghuni untuk melakukan pemesanan.',
                              confirmButtonText: 'Login Sekarang',
                              showCancelButton: true,
                              cancelButtonText: 'Batal'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                router.visit('/login');
                              }
                            });
                            return;
                          }
                          
                          const userRoles = auth.user.roles || [];
                          if (!userRoles.includes('tenant') && !userRoles.includes('penghuni')) {
                            Swal.fire({
                              icon: 'error',
                              title: 'Akses Ditolak',
                              text: 'Hanya akun dengan hak akses Penghuni yang dapat melakukan pemesanan kamar.',
                              confirmButtonText: 'Tutup'
                            });
                            return;
                          }
                          
                          if (!formData.name || !formData.phone || !formData.checkInDate) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Data Belum Lengkap',
                              text: 'Mohon lengkapi data wajib (Nama, No HP, Tanggal Masuk) terlebih dahulu.'
                            });
                            return;
                          }
                          if (formData.checkInDate < minDateString) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Tanggal Tidak Valid',
                              text: 'Tanggal check-in minimal adalah besok.'
                            });
                            return;
                          }
                          
                          Swal.fire({
                            icon: 'info',
                            title: 'Informasi Check-in',
                            text: 'Kamar akan dipersiapkan sehari setelah ditentukan tanggal check in Anda jika pembayaran berhasil terkonfirmasi.',
                            confirmButtonText: 'Mengerti'
                          }).then(() => {
                            setStep(2);
                          });
                        }}
                        className="px-8 shadow-sm"
                      >
                        Lanjutkan ke Durasi Sewa <ArrowRight size={18} />
                      </Btn>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Langkah 2: Pilih Durasi Sewa</h2>
                      <p className="text-slate-500 text-xs">Semakin lama durasi sewa, semakin hemat biaya yang Anda keluarkan dengan diskon spesial.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { m: 1, label: '1 Bulan' },
                        { m: 3, label: '3 Bulan' },
                        { m: 6, label: '6 Bulan' },
                        { m: 12, label: '1 Tahun' },
                      ].map(item => {
                        let itemDiscountRate = 0;
                        for (const rule of discountRules) {
                            if (item.m == rule.minimum_months) {
                                itemDiscountRate = parseFloat(rule.discount_percentage) / 100;
                                break;
                            }
                        }
                        const badge = itemDiscountRate > 0 ? `Hemat ${itemDiscountRate * 100}%` + (itemDiscountRate >= 0.15 ? ' 🔥' : '') : null;
                        const itemBasePrice = room.price * item.m;
                        const itemDiscounted = itemBasePrice * (1 - itemDiscountRate);
                        return (
                          <button
                            key={item.m}
                            onClick={() => setDuration(item.m)}
                            className={`relative p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col justify-between h-32 ${
                              duration === item.m
                                ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10 scale-102'
                                : 'border-slate-200 hover:border-indigo-300 bg-white'
                            }`}
                          >
                            {badge && (
                              <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-xs">
                                {badge}
                              </span>
                            )}
                            <div className="mt-1">
                              <p className="text-2xl font-extrabold text-slate-900">{item.m}</p>
                              <p className="text-xs text-slate-500">Bulan</p>
                            </div>
                            <p className="text-xs font-bold text-indigo-600 mt-2 border-t border-slate-100 pt-2">
                              {fmtShort(itemDiscounted / item.m)}/bln
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {room.facilities && room.facilities.length > 0 && (
                      <div className="pt-2 pb-2">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Fasilitas Utama (Termasuk)</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {room.facilities
                            .filter((fac: any) => typeof fac === 'object' ? (!fac.price || fac.price === 0) : true)
                            .map((fac: any, idx: number) => (
                            <div key={idx} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-sm font-medium text-slate-700">{typeof fac === 'object' ? fac.name : fac}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {addons && addons.length > 0 && (
                      <div className="pt-2">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Fasilitas Tambahan (Opsional)</h3>
                        <div className="space-y-2">
                          {addons.map((addon: any) => {
                            const isSelected = selectedAddons.some(a => a.id === addon.id);
                            return (
                              <label key={addon.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                                <div className="mt-0.5">
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => toggleAddon(addon)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="font-semibold text-slate-900 text-sm">{addon.name}</p>
                                    <p className="font-bold text-indigo-600 text-sm">+{fmtIDR(addon.price)} <span className="text-xs font-normal text-slate-500">/bln</span></p>
                                  </div>
                                  {addon.description && <p className="text-xs text-slate-500 mt-1">{addon.description}</p>}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Harga Sewa Normal ({duration} x {fmtShort(room.price)})</span>
                        <span className="font-semibold text-slate-900">{fmtIDR(basePrice)}</span>
                      </div>

                      {totalAddonPrice > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Fasilitas Tambahan ({duration} bln x {selectedAddons.length} item)</span>
                          <span className="font-semibold text-slate-900">+{fmtIDR(totalAddonPrice)}</span>
                        </div>
                      )}

                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Tag size={15} /> Diskon Durasi Sewa ({discountRate * 100}%)
                          </span>
                          <span>-{fmtIDR(discountAmount)}</span>
                        </div>
                      )}



                      {depositFee > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Deposit Jaminan {room.deposit_type === 'AtEnd' ? '(Bayar Nanti)' : '(Dibayar Awal)'}</span>
                          <span className="font-semibold text-slate-900">{fmtIDR(depositFee)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Biaya Layanan & Administrasi CozQta</span>
                        <span className="font-semibold text-slate-900">{fmtIDR(adminFee)}</span>
                      </div>

                      <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-base">Total Tagihan Awal</span>
                        <span className="text-2xl font-extrabold text-indigo-600">{fmtIDR(totalPrice)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Btn variant="outline" size="lg" onClick={() => setStep(1)}>
                        <ChevronLeft size={18} /> Kembali
                      </Btn>
                      <Btn variant="primary" size="lg" onClick={() => setStep(3)} className="px-8 shadow-sm">
                        Lanjut Konfirmasi <ArrowRight size={18} />
                      </Btn>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Langkah 3: Konfirmasi Pesanan Anda</h2>
                      <p className="text-slate-500 text-xs">Periksa kembali seluruh rincian kamar, jadwal, dan identitas penghuni sebelum lanjut ke pembayaran.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">Rincian Calon Penghuni</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Nama Lengkap</p>
                          <p className="font-bold text-slate-800">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Nomor WhatsApp / HP</p>
                          <p className="font-bold text-slate-800">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Tanggal Pemesanan</p>
                          <p className="font-bold text-indigo-600">{formData.checkInDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Masa Sewa</p>
                          <p className="font-bold text-slate-800">{duration} Bulan (Berakhir {new Date(new Date(formData.checkInDate).setMonth(new Date(formData.checkInDate).getMonth() + duration)).toISOString().split('T')[0]})</p>
                        </div>
                      </div>
                      {formData.notes && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <p className="text-xs text-slate-400">Catatan Khusus</p>
                          <p className="text-xs italic text-slate-600 mt-0.5">&ldquo;{formData.notes}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900 leading-relaxed">
                        Dengan menekan tombol <strong>&ldquo;Bayar Sekarang&rdquo;</strong>, Anda menyetujui <a href="/" className="underline font-bold">Syarat & Ketentuan CozQta</a> serta peraturan tata tertib dari pemilik kost.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-4">
                        <Btn
                          variant="outline"
                          size="lg"
                          onClick={() => setStep(step - 1)}
                        >
                          <ChevronLeft size={18} /> Ubah Durasi
                        </Btn>
                        <Btn
                          variant="primary"
                          size="lg"
                          onClick={handleProceedToPayment}
                          className="px-8 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                          Bayar Tagihan Awal ({fmtShort(initialPayment)}) <ArrowRight size={18} />
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-base text-slate-900 mb-4">Ringkasan Kamar</h3>
                <div className="flex gap-3.5 mb-5 pb-5 border-b border-slate-100">
                  <img src={room.image} alt={room.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                  <div>
                    <Badge variant="outline">{room.type}</Badge>
                    <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{room.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                      <MapPin size={12} className="flex-shrink-0" /> {room.address}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  {/* Rincian Total Keseluruhan */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Harga Kamar ({duration} bln)</span>
                      <span className="font-semibold text-slate-900">{fmtIDR(basePrice)}</span>
                    </div>
                    {totalAddonPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Add-on ({duration} bln)</span>
                        <span className="font-semibold text-slate-900">{fmtIDR(totalAddonPrice)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Diskon Promo</span>
                        <span>-{fmtIDR(discountAmount)}</span>
                      </div>
                    )}
                    {depositFee > 0 && (
                      <div className="flex justify-between">
                        <span>Deposit Jaminan {room.deposit_type === 'AtEnd' ? '(Nanti)' : ''}</span>
                        <span className="font-semibold text-slate-900">{fmtIDR(depositFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Biaya Layanan Admin</span>
                      <span className="font-semibold text-slate-900">{fmtIDR(adminFee)}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-slate-900 text-sm">Total Keseluruhan</span>
                      <span className="font-bold text-slate-900 text-sm">{fmtIDR(totalPrice)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Total akumulasi biaya selama masa sewa.</p>
                  </div>

                  {/* Apa yang harus dibayar SEKARANG */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mt-3">
                    <p className="font-bold text-indigo-900 text-sm mb-2">Yang Harus Dibayar Sekarang</p>
                    {bookingFee > 0 ? (
                      <>
                        <div className="flex justify-between mb-1">
                          <span>DP / Booking Fee</span>
                          <span className="font-semibold text-indigo-900">{fmtIDR(bookingFee)}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                          <span>Biaya Layanan Admin</span>
                          <span className="font-semibold text-indigo-900">{fmtIDR(adminFee)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between mb-3">
                        <span>Sewa Bulan 1 + Deposit + Admin</span>
                        <span className="font-semibold text-indigo-900">{fmtIDR(initialPayment)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-2 border-t border-indigo-200/60">
                      <span className="font-bold text-indigo-900">Total Saat Ini</span>
                      <span className="text-lg font-extrabold text-indigo-700">{fmtIDR(initialPayment)}</span>
                    </div>
                  </div>

                  {/* Sisa yang dibayar NANTI */}
                  {remainingTotal > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-800 leading-tight">
                          {bookingFee > 0 
                            ? "Sisa tagihan (Sewa Bulan 1 + Deposit) dibayarkan nanti setelah Admin menyetujui DP dan saat Anda ke lokasi."
                            : "Sisa tagihan untuk bulan-bulan berikutnya dibayarkan sesuai jatuh tempo."}
                        </p>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-amber-200/60">
                        <span className="font-bold text-amber-900">Sisa Tagihan Nanti</span>
                        <span className="text-sm font-bold text-amber-700">{fmtIDR(remainingTotal)}</span>
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
