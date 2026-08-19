import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FileText, AlertTriangle, Search, X } from 'lucide-react';
import { Badge, Btn, SearchableSelect } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

export default function AdminContracts({ contracts }: { contracts: any[] }) {
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [extendBookingId, setExtendBookingId] = useState<number | null>(null);
  
  const { data: extendData, setData: setExtendData, post: postExtend, processing: extendProcessing, errors: extendErrors, reset: resetExtend } = useForm({
    rent_type: 'Monthly',
    duration_month: '1',
    duration_days: '1',
    custom_price: ''
  });

  const submitExtend = (e: React.FormEvent) => {
    e.preventDefault();
    postExtend(`/admin/transactions/bookings/${extendBookingId}/extend`, {
      preserveScroll: true,
      onSuccess: () => {
        setIsExtendOpen(false);
        resetExtend();
        setExtendBookingId(null);
      }
    });
  };

  const terminateContract = (contractId: number) => {
    const notes = prompt("Masukkan alasan terminasi (opsional):");
    if (notes !== null) {
      router.post(`/admin/transactions/contracts/${contractId}/terminate`, { notes }, {
        preserveScroll: true
      });
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    return end < today;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari kontrak sewa..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">No Kontrak</th>
                <th className="px-6 py-4 whitespace-nowrap">Penghuni</th>
                <th className="px-6 py-4 whitespace-nowrap">Kamar</th>
                <th className="px-6 py-4 whitespace-nowrap">Periode Sewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Sewa Per Bulan</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts?.length > 0 ? contracts.map((contract: any, index: number) => {
                const expiring = contract.status === 'Active' && isExpiringSoon(contract.end_date);
                const expired = contract.status === 'Active' && isExpired(contract.end_date);
                
                return (
                  <tr key={contract.id} className={`hover:bg-slate-50/50 transition-colors ${expiring ? 'bg-orange-50/30' : ''} ${expired ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{contract.contract_number}</div>
                      <div className="text-xs text-slate-500">Ref: {contract.booking_header?.booking_no}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{contract.tenant?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{contract.tenant?.phone || contract.tenant?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{contract.room_type?.type_name || 'Tipe Kamar'}</div>
                      <div className="mt-1 text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                        Unit: {contract.room_unit?.unit_number || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">
                        {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                      </div>
                      {expiring && (
                        <div className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} /> H-7 Berakhir
                        </div>
                      )}
                      {expired && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} /> Sudah Lewat
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {fmtIDR(contract.monthly_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.status === 'Active' ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : contract.status === 'Terminated' ? (
                        <Badge variant="danger">Terminasi</Badge>
                      ) : (
                        <Badge variant="outline">{contract.status}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {contract.status === 'Active' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setExtendBookingId(contract.booking_header_id); setIsExtendOpen(true); }} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">
                            Perpanjang
                          </button>
                          <button onClick={() => terminateContract(contract.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium transition-colors">
                            Selesai / Terminasi
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data kontrak. aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extend Modal */}
      {isExtendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Perpanjang Sewa</h2>
              <button onClick={() => setIsExtendOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitExtend} className="p-5 space-y-4">
              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-xl border border-blue-200 mb-4">
                Sistem akan otomatis membuat tagihan (invoice) baru sejumlah durasi perpanjangan yang dipilih. Tagihan dapat dibayar nanti secara manual.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipe Perpanjangan</label>
                  <SearchableSelect 
                    value={extendData.rent_type}
                    onChange={val => setExtendData('rent_type', val as string)}
                    options={[
                      {label: 'Bulanan', value: 'Monthly'},
                      {label: 'Harian', value: 'Daily'}
                    ]}
                  />
                  {extendErrors.rent_type && <p className="text-xs text-red-500 mt-1">{extendErrors.rent_type}</p>}
                </div>
                {extendData.rent_type === 'Monthly' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Durasi (Bulan)</label>
                    <SearchableSelect 
                      value={extendData.duration_month}
                      onChange={val => setExtendData('duration_month', val as string)}
                      options={[
                        {label: '1 Bulan', value: '1'},
                        {label: '3 Bulan', value: '3'},
                        {label: '6 Bulan', value: '6'},
                        {label: '1 Tahun', value: '12'}
                      ]}
                    />
                    {extendErrors.duration_month && <p className="text-xs text-red-500 mt-1">{extendErrors.duration_month}</p>}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Durasi (Hari)</label>
                    <input 
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={extendData.duration_days}
                      onChange={e => setExtendData('duration_days', e.target.value)}
                      required
                    />
                    {extendErrors.duration_days && <p className="text-xs text-red-500 mt-1">{extendErrors.duration_days}</p>}
                  </div>
                )}
              </div>
              
              {extendData.rent_type === 'Daily' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Harga Sewa Total (Manual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input 
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Harga Sewa Total"
                      value={extendData.custom_price ? new Intl.NumberFormat('id-ID').format(Number(extendData.custom_price)) : ''}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setExtendData('custom_price', val);
                      }}
                      required
                    />
                  </div>
                  {extendErrors.custom_price && <p className="text-xs text-red-500 mt-1">{extendErrors.custom_price}</p>}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <Btn variant="outline" type="button" onClick={() => setIsExtendOpen(false)}>Batal</Btn>
                <Btn variant="primary" type="submit" disabled={extendProcessing}>Simpan Perpanjangan</Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
