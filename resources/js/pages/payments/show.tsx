import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
  QrCode, Building, CreditCard, Zap, Tag, Receipt, CheckCircle2,
  Clock, Copy, Check, ArrowRight, Shield, ChevronRight
} from 'lucide-react';
import { ROOMS, Room, fmtShort, fmtIDR } from '@/components/cozqta/data';
import { Navbar, Footer, Btn, Badge } from '@/components/cozqta/primitives';

export default function PaymentShow({ payment_gateways = [], payment = null, booking = null, room = null }: { payment_gateways?: any[], payment?: any, booking?: any, room?: any }) {
  const { url } = usePage();
  const [method, setMethod] = useState(payment_gateways.length > 0 ? payment_gateways[0].id : null);
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed'>(payment?.status?.toLowerCase() === 'paid' ? 'paid' : 'pending');
  const [countdown, setCountdown] = useState(900);
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const bookingId = booking?.booking_no || 'TRX-882910';
  const total = payment?.grand_total || 2575000;
  const duration = booking?.duration_month || 1;

  useEffect(() => {
    if (status !== 'pending') return;
    const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [status]);

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0');
  const secs = (countdown % 60).toString().padStart(2, '0');

  // Map backend payment_gateways to frontend format
  const getIconForProvider = (provider: string) => {
    const p = (provider || '').toLowerCase();
    if (p.includes('qris')) return QrCode;
    if (p.includes('transfer') || p.includes('manual')) return Receipt;
    if (p.includes('credit') || p.includes('card')) return CreditCard;
    if (p.includes('ewallet') || p.includes('gopay') || p.includes('ovo')) return Tag;
    return Building;
  };

  const methods = payment_gateways.map(pg => ({
    id: pg.id,
    label: pg.name,
    icon: getIconForProvider(pg.provider),
    desc: pg.provider?.toLowerCase() === 'manual' ? `A.n. ${pg.account_name}` : `Provider: ${pg.provider.toUpperCase()}`,
    badge: pg.is_default ? 'Terpopuler' : null,
    instruction: pg.instruction,
    original: pg
  }));

  const selectedMethodObj = methods.find(m => m.id === method) || methods[0];

  const handleCopyVa = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('8801928301928301');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = () => {
    const isManualOrQris = selectedMethodObj?.original?.provider?.toLowerCase() === 'manual' || selectedMethodObj?.original?.provider?.toLowerCase() === 'qris';
    
    if (isManualOrQris && proofFile) {
      const formData = new FormData();
      formData.append('payment_id', payment?.id);
      formData.append('method_id', method);
      formData.append('proof_file', proofFile);
      
      router.post('/payments/upload-proof', formData, {
        onSuccess: () => {
          setStatus('paid'); 
        }
      });
    } else if (!isManualOrQris) {
      const formData = new FormData();
      formData.append('payment_id', payment?.id);
      formData.append('method_id', method);

      router.post('/payments/simulate-gateway', formData, {
        onSuccess: () => {
          setStatus('paid');
        }
      });
    } else {
      setStatus('paid');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Head title={`Pembayaran ${bookingId} — CozQta`} />
      <Navbar activePage="rooms" />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-indigo-600">Beranda</Link>
            <ChevronRight size={14} />
            <Link href={`/rooms/${room.id}`} className="hover:text-indigo-600">{room.name}</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-semibold">Pembayaran #{bookingId}</span>
          </div>

          {status === 'paid' ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/10">
                <CheckCircle2 size={44} className="text-green-600 animate-bounce" />
              </div>
              <Badge variant="success">Pembayaran Terverifikasi</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
                Pemesanan Kost Berhasil!
              </h1>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Selamat! Pembayaran Anda sebesar <strong className="text-slate-900">{fmtIDR(total)}</strong> untuk <strong className="text-indigo-600">{room.name}</strong> telah kami terima. E-ticket dan kode akses kost telah dikirim ke dashboard Anda.
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left mb-8 max-w-md mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID Booking</span>
                  <span className="font-mono font-bold text-slate-800">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Properti</span>
                  <span className="font-bold text-slate-800">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Masa Sewa</span>
                  <span className="font-bold text-slate-800">{duration} Bulan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Bayar</span>
                  <span className="font-bold uppercase text-indigo-600">{method}</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between font-bold text-sm">
                  <span>Total Dibayar</span>
                  <span className="text-green-600">{fmtIDR(total)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Btn variant="primary" size="lg" href="/dashboard" className="w-full sm:w-auto px-8 shadow-md">
                  Lihat Tiket di Dashboard <ArrowRight size={18} />
                </Btn>
                <Btn variant="outline" size="lg" href="/" className="w-full sm:w-auto px-6">
                  Kembali ke Beranda
                </Btn>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">Pilih Metode Pembayaran</h1>
                      <p className="text-xs text-slate-500 mt-0.5">Semua transaksi dijamin aman dan terenkripsi SSL 256-bit.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold">
                      <Clock size={14} className="animate-pulse" />
                      <span>{mins}:{secs}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                          method === m.id
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${method === m.id ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                            <m.icon size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{m.label}</span>
                              {m.badge && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === m.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                          {method === m.id && <Check size={14} className="stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <QrCode size={18} className="text-indigo-600" /> Instruksi Pembayaran ({selectedMethodObj?.label})
                    </h3>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 prose prose-sm max-w-none text-slate-600">
                      {selectedMethodObj?.original?.account_number && (
                        <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg not-prose w-full">
                          <p className="text-xs text-indigo-500 font-semibold mb-1">Nomor Rekening Tujuan</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="font-mono text-xl sm:text-2xl font-bold text-indigo-700 break-all">{selectedMethodObj.original.account_number}</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedMethodObj.original.account_number);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="px-4 py-2 sm:px-3 sm:py-1 bg-white border border-indigo-200 rounded-lg text-sm sm:text-xs font-sans text-indigo-600 hover:bg-indigo-100 flex items-center justify-center gap-2 sm:gap-1 cursor-pointer whitespace-nowrap w-full sm:w-auto transition-colors"
                            >
                              {copied ? <Check size={16} className="sm:w-[14px] sm:h-[14px]" /> : <Copy size={16} className="sm:w-[14px] sm:h-[14px]" />}
                              {copied ? 'Tersalin' : 'Salin Rekening'}
                            </button>
                          </div>
                          {selectedMethodObj.original.account_name && (
                            <p className="text-sm font-semibold text-indigo-900 mt-3 sm:mt-2">A/N: {selectedMethodObj.original.account_name}</p>
                          )}
                        </div>
                      )}

                      {selectedMethodObj?.instruction ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedMethodObj.instruction.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p>Silakan lakukan pembayaran sesuai dengan detail di atas.</p>
                      )}
                    </div>

                    {(() => {
                      const isManualOrQris = selectedMethodObj?.original?.provider?.toLowerCase() === 'manual' || selectedMethodObj?.original?.provider?.toLowerCase() === 'qris';
                      return (
                        <>
                          {isManualOrQris && (
                            <div className="mt-4 mb-2 p-4 bg-white border border-slate-200 rounded-xl">
                               <p className="text-sm font-semibold text-slate-800 mb-2">Upload Bukti Pembayaran</p>
                               <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                               <p className="text-[11px] text-slate-400 mt-2">Format: JPG, PNG maksimal 2MB. Bukti transfer wajib diunggah agar pembayaran dapat diverifikasi.</p>
                            </div>
                          )}

                          <div className="pt-2">
                            <Btn
                              variant="primary"
                              size="lg"
                              disabled={isManualOrQris && !proofFile}
                              onClick={handleSimulatePayment}
                              className="w-full justify-center shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                              {isManualOrQris ? (
                                <>Kirim Bukti Pembayaran <CheckCircle2 size={18} /></>
                              ) : (
                                <>Cek Status Pembayaran <CheckCircle2 size={18} /></>
                              )}
                            </Btn>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                  <h3 className="font-bold text-base text-slate-900 mb-4">Ringkasan Tagihan</h3>

                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                    <img src={room.image} alt={room.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold">{room.type}</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{room.name}</h4>
                      <p className="text-xs text-slate-400">{room.building}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>ID Transaksi</span>
                      <span className="font-mono font-bold text-slate-800">{bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durasi Pemesanan</span>
                      <span className="font-semibold text-slate-800">{duration} Bulan</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-bold text-sm text-slate-900">
                      <span>Total Bayar</span>
                      <span className="text-lg text-indigo-600">{fmtIDR(total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600 flex-shrink-0" />
                    <span className="text-[11px] text-indigo-900 font-medium leading-normal">
                      Garansi 100% uang kembali jika properti tidak sesuai deskripsi.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
