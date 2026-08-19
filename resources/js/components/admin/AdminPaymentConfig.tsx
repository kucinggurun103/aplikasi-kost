import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CreditCard, Banknote, QrCode, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

export default function AdminPaymentConfig({ gateways, branches = [] }: { gateways: any[], branches?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterBranch, setFilterBranch] = useState<string>('all');
  
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    branch_id: '',
    name: '',
    provider: 'midtrans',
    environment: 'sandbox',
    client_key: '',
    server_key: '',
    api_key: '',
    merchant_id: '',
    account_number: '',
    account_name: '',
    qr_image: null as File | null,
    is_active: true,
  });

  const displayedGateways = React.useMemo(() => {
    if (filterBranch === 'all') return gateways;
    
    const branchId = Number(filterBranch);
    const branchGateways = gateways.filter((g: any) => g.branch_id === branchId);
    const globalGateways = gateways.filter((g: any) => !g.branch_id);

    // Logika prioritas: Jika cabang memiliki metode pembayarannya sendiri, gunakan milik cabang.
    // Jika tidak ada, maka fallback (default) ke metode pembayaran global.
    if (branchGateways.length > 0) {
      return branchGateways;
    }
    
    return globalGateways;
  }, [gateways, filterBranch]);

  const openModal = (gateway: any = null) => {
    clearErrors();
    if (gateway) {
      setEditingId(gateway.id);
      setData({
        branch_id: gateway.branch_id || '',
        name: gateway.name,
        provider: gateway.provider,
        environment: gateway.environment || 'sandbox',
        client_key: gateway.client_key || '',
        server_key: gateway.server_key || '',
        api_key: gateway.api_key || '',
        merchant_id: gateway.merchant_id || '',
        account_number: gateway.account_number || '',
        account_name: gateway.account_name || '',
        qr_image: null,
        is_active: gateway.is_active,
      });
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      post(`/admin/settings/payment-gateways/${editingId}`, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
    } else {
      post(`/admin/settings/payment-gateways`, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
    }
  };

  const deleteGateway = (id: number) => {
    if (confirm("Hapus metode pembayaran ini?")) {
      router.delete(`/admin/settings/payment-gateways/${id}`, { preserveScroll: true });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Konfigurasi Payment Gateway & Transfer</h2>
          <p className="text-sm text-slate-500 mt-1">Atur metode pembayaran yang bisa digunakan oleh penyewa (Midtrans, Manual Transfer, QRIS).</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-56">
            <SearchableSelect 
              value={filterBranch}
              onChange={val => setFilterBranch(val)}
              options={[{label: 'Semua Konfigurasi', value: 'all'}, ...branches?.map((b: any) => ({ label: b.name, value: String(b.id) }))]}
            />
          </div>
          <Btn variant="primary" onClick={() => openModal()}><Plus size={16} className="mr-1.5" /> Tambah Metode</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedGateways?.map((gateway: any) => (
          <div key={gateway.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${gateway.is_active ? 'bg-green-500' : 'bg-slate-300'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${gateway.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                  {gateway.provider === 'midtrans' || gateway.provider === 'duitku' ? <CreditCard size={20} /> : 
                   gateway.provider === 'qris' ? <QrCode size={20} /> : <Banknote size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{gateway.name}</h3>
                  <Badge variant={gateway.is_active ? 'success' : 'outline'} className="mt-1 text-[10px]">
                    {gateway.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openModal(gateway)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => deleteGateway(gateway.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Cabang</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {gateway.branch ? gateway.branch.name : (
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Semua Cabang</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provider</span>
                <span className="font-semibold text-slate-800 uppercase text-xs">{gateway.provider} {gateway.provider === 'midtrans' || gateway.provider === 'duitku' ? `(${gateway.environment || 'sandbox'})` : ''}</span>
              </div>
              
              {gateway.provider === 'manual' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Rekening</span>
                    <span className="font-medium text-slate-800">{gateway.account_number || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">A/N</span>
                    <span className="font-medium text-slate-800">{gateway.account_name || '-'}</span>
                  </div>
                </>
              )}
              
              {gateway.provider === 'qris' && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">QR Code</span>
                  {gateway.qr_image_path ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Terupload</span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium flex items-center gap-1"><XCircle size={12} /> Belum ada</span>
                  )}
                </div>
              )}
              
              {(gateway.provider === 'midtrans' || gateway.provider === 'duitku') && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Merchant ID</span>
                  <span className="font-medium text-slate-800 text-xs truncate max-w-[120px]">{gateway.merchant_id || '-'}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {(!gateways || gateways.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-100 border-dashed rounded-2xl">
            Belum ada metode pembayaran yang dikonfigurasi.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
            </div>
            
            <form onSubmit={submitForm} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cabang (Opsional)</label>
                <SearchableSelect 
                  value={data.branch_id}
                  onChange={val => setData('branch_id', val)}
                  options={[{label: 'Semua Cabang (Global)', value: ''}, ...branches?.map((b: any) => ({ label: b.name, value: String(b.id) }))]}
                  placeholder="Pilih Cabang..."
                />
                <p className="text-[10px] text-slate-500 mt-1">Pilih "Semua Cabang" jika metode ini berlaku untuk seluruh properti.</p>
                {errors.branch_id && <p className="text-xs text-red-500 mt-1">{errors.branch_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Metode (Tampil di Pengguna)</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nama Metode Pembayaran" value={data.name} onChange={e => setData('name', e.target.value)} required />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenis Provider</label>
                <SearchableSelect 
                  value={data.provider}
                  onChange={val => setData('provider', val)}
                  options={[
                    {label: 'Midtrans (Payment Gateway)', value: 'midtrans'},
                    {label: 'Duitku (Payment Gateway)', value: 'duitku'},
                    {label: 'Manual Transfer (Bank)', value: 'manual'},
                    {label: 'QRIS Statik (Upload Gambar)', value: 'qris'}
                  ]}
                />
              </div>

              {(data.provider === 'midtrans' || data.provider === 'duitku') && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">API Credentials</h4>
                    <div className="w-40">
                      <SearchableSelect 
                        value={data.environment}
                        onChange={val => setData('environment', val)}
                        options={[
                          {label: 'Sandbox (Testing)', value: 'sandbox'},
                          {label: 'Production (Live)', value: 'production'}
                        ]}
                      />
                    </div>
                  </div>
                  
                  {data.provider === 'midtrans' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Merchant ID</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.merchant_id} onChange={e => setData('merchant_id', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Client Key</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.client_key} onChange={e => setData('client_key', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Server Key (Rahasia)</label>
                        <input type="password" placeholder="Server Key / Secret Key" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.server_key} onChange={e => setData('server_key', e.target.value)} />
                      </div>
                    </>
                  )}

                  {data.provider === 'duitku' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Merchant Code</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.merchant_id} onChange={e => setData('merchant_id', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">API Key (Rahasia)</label>
                        <input type="password" placeholder="Client Key / API Key" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.api_key} onChange={e => setData('api_key', e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {data.provider === 'manual' && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Informasi Rekening</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor Rekening</label>
                    <input type="text" placeholder="Nomor Rekening / Tujuan" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.account_number} onChange={e => setData('account_number', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Atas Nama (A/N)</label>
                    <input type="text" placeholder="Atas Nama (A/N)" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={data.account_name} onChange={e => setData('account_name', e.target.value)} />
                  </div>
                </div>
              )}

              {data.provider === 'qris' && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gambar QRIS</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Upload QR Code Baru</label>
                    <input type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setData('qr_image', e.target.files ? e.target.files[0] : null)} />
                    {errors.qr_image && <p className="text-xs text-red-500 mt-1">{errors.qr_image}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_active" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Aktifkan metode pembayaran ini</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <Btn variant="outline" type="button" onClick={closeModal}>Batal</Btn>
                <Btn variant="primary" type="submit" disabled={processing}>Simpan Konfigurasi</Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
