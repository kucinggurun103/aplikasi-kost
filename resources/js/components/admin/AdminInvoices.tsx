import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Receipt, Search, CheckCircle2, X } from 'lucide-react';
import { Btn, Badge } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

import Swal from 'sweetalert2';

export default function AdminInvoices({ invoices }: { invoices: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'DP' | 'Sewa' | 'Riwayat'>('DP');
  
  const approvePayment = async (bookingId: number, paymentId: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Konfirmasi bahwa tagihan ini telah dibayar Lunas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Konfirmasi Lunas',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      router.post(`/admin/transactions/bookings/${bookingId}/manual-pay`, { payment_id: paymentId }, {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Tagihan telah diverifikasi sebagai Lunas.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    }
  };

  const getInvoiceCategory = (inv: any) => {
    const parts = inv.payment_no ? inv.payment_no.split('-') : [];
    let paymentCount = 1;
    if (parts.length >= 4) {
      paymentCount = parseInt(parts[parts.length - 1], 10) || 1;
    }
    const hasDP = (inv.booking?.room_type?.booking_price || 0) > 0;
    
    if (hasDP && paymentCount === 1) return 'DP';
    return 'Sewa';
  };

  const dpInvoices = invoices?.filter(inv => inv.status === 'Pending' && getInvoiceCategory(inv) === 'DP') || [];
  const sewaInvoices = invoices?.filter(inv => inv.status === 'Pending' && getInvoiceCategory(inv) === 'Sewa') || [];
  const riwayatInvoices = invoices?.filter(inv => inv.status !== 'Pending') || [];
  
  const displayedInvoices = activeTab === 'DP' ? dpInvoices : (activeTab === 'Sewa' ? sewaInvoices : riwayatInvoices);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Receipt size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tagihan & Invoice Pending</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pantau dan verifikasi pembayaran tagihan dari penyewa.</p>
          </div>
        </div>
        <div className="relative w-full max-w-xs hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari invoice atau penyewa..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('DP')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'DP' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Antrian Verifikasi DP ({dpInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('Sewa')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'Sewa' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Antrian Verifikasi Sewa / Deposit ({sewaInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('Riwayat')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'Riwayat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Riwayat Pembayaran & Perpanjangan ({riwayatInvoices.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">No. Tagihan</th>
                <th className="px-6 py-4 whitespace-nowrap">Penyewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Rincian Sewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Total Tagihan</th>
                <th className="px-6 py-4 whitespace-nowrap">Metode</th>
                <th className="px-6 py-4 whitespace-nowrap">Bukti Transfer</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedInvoices.length > 0 ? displayedInvoices.map((invoice: any, index: number) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-indigo-600">{invoice.payment_no}</div>
                    <div className="text-xs text-slate-500">{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{invoice.booking?.tenant?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{invoice.booking?.tenant?.phone || invoice.booking?.tenant?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{invoice.booking?.room_type?.type_name || '-'}</div>
                    <div className="text-xs text-slate-500">{invoice.booking?.branch?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                    {fmtIDR(invoice.grand_total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {invoice.payment_method || 'Menunggu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.proof_of_payment ? (
                      <button onClick={() => setSelectedImage(`/storage/${invoice.proof_of_payment}`)} className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                        Lihat Bukti
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Belum ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {activeTab === 'Riwayat' ? (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        invoice.status === 'Failed' ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {invoice.status === 'Paid' ? 'Lunas' : invoice.status === 'Failed' ? 'Gagal' : invoice.status}
                      </span>
                    ) : (
                      <button 
                        onClick={() => approvePayment(invoice.booking_header_id, invoice.id)} 
                        className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 font-bold transition-colors flex items-center justify-center gap-1.5 ml-auto"
                      >
                        <CheckCircle2 size={14} /> Konfirmasi Lunas
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <Receipt size={40} className="mx-auto text-slate-300 mb-3" />
                    Tidak ada antrian tagihan pending di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="font-bold text-slate-900">Bukti Transfer</h3>
              <button onClick={() => setSelectedImage(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex justify-center items-center bg-slate-50">
              <img src={selectedImage} alt="Bukti Transfer" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
