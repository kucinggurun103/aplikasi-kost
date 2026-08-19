import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Wallet, Search, CheckCircle2 } from 'lucide-react';
import { fmtIDR } from '@/components/cozqta/data';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminDeposits({ deposits }: { deposits: any[] }) {
  const [activeTab, setActiveTab] = useState<'Held' | 'Refunded'>('Held');
  
  const refundDeposit = (bookingId: number) => {
    if (confirm("Konfirmasi bahwa deposit ini telah dikembalikan (Refund) ke penyewa?")) {
      router.post(`/admin/transactions/bookings/${bookingId}/refund-deposit`, {}, {
        preserveScroll: true
      });
    }
  };

  // Status defaults to Held if null or empty
  const getStatus = (dep: any) => dep.deposit_status === 'Refunded' ? 'Refunded' : 'Held';

  const heldDeposits = deposits?.filter(dep => getStatus(dep) === 'Held') || [];
  const refundedDeposits = deposits?.filter(dep => getStatus(dep) === 'Refunded') || [];
  
  const displayedDeposits = activeTab === 'Held' ? heldDeposits : refundedDeposits;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manajemen Deposit</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pantau uang deposit penghuni yang ditahan dan riwayat refund.</p>
          </div>
        </div>
        <div className="relative w-full max-w-xs hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari penyewa atau kamar..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Held')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'Held' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Deposit Ditahan ({heldDeposits.length})
        </button>
        <button
          onClick={() => setActiveTab('Refunded')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'Refunded' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Riwayat Refund ({refundedDeposits.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">ID Booking</th>
                <th className="px-6 py-4 whitespace-nowrap">Penyewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Kamar / Cabang</th>
                <th className="px-6 py-4 whitespace-nowrap">Jumlah Deposit</th>
                <th className="px-6 py-4 whitespace-nowrap">Status Booking</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedDeposits.length > 0 ? displayedDeposits.map((dep: any, index: number) => (
                <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-indigo-600">{dep.booking_no}</div>
                    <div className="text-xs text-slate-500">{new Date(dep.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{dep.tenant?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{dep.tenant?.phone || dep.tenant?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{dep.room_unit?.unit_number || '-'}</div>
                    <div className="text-xs text-slate-500">{dep.branch?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                    {fmtIDR(dep.deposit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {dep.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {activeTab === 'Held' ? (
                      <button 
                        onClick={() => refundDeposit(dep.id)} 
                        className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors flex items-center justify-center gap-1.5 ml-auto"
                      >
                        <CheckCircle2 size={14} /> Tandai Refund
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 block text-right mt-1">
                        Di-refund pada: {dep.deposit_refunded_at ? new Date(dep.deposit_refunded_at).toLocaleDateString() : '-'}
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
                    Tidak ada data deposit di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
