import React from 'react';
import { CreditCard, Download, ArrowUpRight } from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

export default function AdminTransactions({ transactions }: { transactions: any[] }) {
  const totalRevenue = transactions?.filter(t => t.status === 'Paid').reduce((sum, t) => sum + Number(t.amount || t.grand_total), 0) || 0;
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <CreditCard size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Laporan Transaksi Global</h2>
            <p className="text-sm text-slate-500 mt-1">Total Pendapatan (Status Lunas): <span className="font-bold text-green-600">{fmtIDR(totalRevenue)}</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <SearchableSelect 
              value="this_month"
              onChange={() => {}}
              options={[
                {label: 'Bulan Ini', value: 'this_month'},
                {label: 'Bulan Lalu', value: 'last_month'},
                {label: 'Tahun Ini', value: 'this_year'},
                {label: 'Semua Waktu', value: 'all'}
              ]}
            />
          </div>
          <Btn variant="outline"><Download size={16} className="mr-1.5" /> Export Excel</Btn>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">ID Transaksi / Tgl</th>
                <th className="px-6 py-4 whitespace-nowrap">Penyewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Cabang & Kamar</th>
                <th className="px-6 py-4 whitespace-nowrap">Metode Pembayaran</th>
                <th className="px-6 py-4 whitespace-nowrap">Nominal</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions?.length > 0 ? transactions.map((trx: any, index: number) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      TRX-{trx.id} 
                      {trx.status === 'Paid' && <ArrowUpRight size={14} className="text-green-500" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(trx.created_at).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{trx.booking?.tenant?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{trx.booking?.tenant?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{trx.booking?.branch?.name || '-'}</div>
                    <div className="text-xs text-slate-500">{trx.booking?.room_type?.type_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {trx.payment_method || 'Menunggu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                    {fmtIDR(trx.amount || trx.grand_total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {trx.status === 'Paid' ? (
                      <Badge variant="success">Berhasil</Badge>
                    ) : trx.status === 'Pending' ? (
                      <Badge variant="warning">Menunggu</Badge>
                    ) : (
                      <Badge variant="danger">Gagal/Batal</Badge>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Wallet size={40} className="mx-auto text-slate-300 mb-3" />
                    Belum ada riwayat transaksi.
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
