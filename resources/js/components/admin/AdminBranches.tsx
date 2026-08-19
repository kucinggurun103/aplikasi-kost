import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Edit, Trash2, Users, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

// We create an inline simple button if Btn is not easily exported, or just use tailwind
const Btn = ({ children, onClick, type = 'button', variant = 'primary', className = '' }: any) => {
  const base = "px-4 py-2 rounded-xl font-medium text-sm transition-all";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${(variants as any)[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function AdminBranches({ branches = [], operators = [] }: { branches: any[], operators: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isAssigning, setIsAssigning] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  const getDmyhis = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };
  
  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    code: '',
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    google_maps_url: '',
    latitude: '',
    longitude: '',
    is_active: true,
  });

  const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
    user_ids: [] as number[],
  });

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      code: item.code,
      name: item.name,
      description: item.description || '',
      address: item.address || '',
      phone: item.phone || '',
      email: item.email || '',
      google_maps_url: item.google_maps_url || '',
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      is_active: item.is_active,
    });
  };

  const closeEdit = () => {
    setIsEditing(null);
    setShowForm(false);
    reset();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(`/admin/master/branches/${isEditing?.id}`, { preserveScroll: true, onSuccess: closeEdit });
    } else {
      post('/admin/master/branches', { 
        preserveScroll: true, 
        onSuccess: () => {
          closeEdit();
          Swal.fire({
            title: 'Cabang Berhasil Dibuat!',
            text: 'Apakah Anda ingin mengatur metode pembayaran untuk cabang ini sekarang?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ya, Atur Pembayaran',
            cancelButtonText: 'Nanti Saja',
            confirmButtonColor: '#4f46e5'
          }).then((result) => {
            if (result.isConfirmed) {
              router.visit('?tab=midtrans', { preserveState: true, preserveScroll: true });
            }
          });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Cabang?',
      text: 'Yakin ingin menghapus cabang ini? Semua data terkait (tipe kamar, dll) mungkin akan terpengaruh.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/master/branches/${id}`, { preserveScroll: true });
      }
    });
  };

  const openAssign = (branch: any) => {
    setIsAssigning(branch);
    setAssignData('user_ids', branch?.users?.map((u: any) => u?.id) || []);
  };

  const closeAssign = () => {
    setIsAssigning(null);
  };

  const submitAssign = (e: React.FormEvent) => {
    e.preventDefault();
    postAssign(`/admin/master/branches/${isAssigning?.id}/assign`, { preserveScroll: true, onSuccess: closeAssign });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            if (showForm && isEditing) {
              closeEdit();
            } else {
              if (!showForm && !isEditing) {
                const ts = getDmyhis();
                setTimestamp(ts);
                setData('code', `CB-${ts}`);
              }
              setShowForm(!showForm);
            }
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h2>
            {!showForm && !isEditing && <p className="text-sm text-slate-500 mt-1">Klik untuk menambahkan cabang baru</p>}
          </div>
          <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={24} />
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            <form onSubmit={submit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{isEditing ? 'Kode Cabang' : 'Kata Kunci Cabang (Prefix)'}</label>
                <input 
                  required 
                  maxLength={isEditing ? 50 : 4}
                  type="text" 
                  value={isEditing ? data.code : (data.code ? data.code.split('-')[0] : '')} 
                  onChange={e => {
                    const val = e.target.value.toUpperCase();
                    if (isEditing) {
                      setData('code', val);
                    } else {
                      setData('code', `${val}-${timestamp}`);
                    }
                  }} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  placeholder={isEditing ? "Kode Cabang" : "Kata Kunci Cabang (Prefix)"} 
                />
                {!isEditing && <div className="text-xs text-indigo-600 font-medium mt-1">Otomatis Dibuat: {data.code}</div>}
                {errors.code && <div className="text-red-500 text-xs mt-1">{errors.code}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Cabang</label>
                <input required type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Nama Cabang" />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email (Opsional)</label>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Email" />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">No. HP / Telepon (Opsional)</label>
                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="No. HP / Telepon" />
                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Alamat Lengkap" />
              {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Link Google Maps (Opsional)</label>
                <input type="text" value={data.google_maps_url} onChange={e => setData('google_maps_url', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Link Google Maps" />
                {errors.google_maps_url && <div className="text-red-500 text-xs mt-1">{errors.google_maps_url}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Latitude</label>
                <input type="text" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Latitude" />
                {errors.latitude && <div className="text-red-500 text-xs mt-1">{errors.latitude}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Longitude</label>
                <input type="text" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Longitude" />
                {errors.longitude && <div className="text-red-500 text-xs mt-1">{errors.longitude}</div>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Tambahan</label>
              <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Deskripsi Tambahan" />
              {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            <div className="flex gap-3 pt-4">
              {isEditing && <Btn type="button" variant="outline" onClick={closeEdit}>Batal</Btn>}
              <Btn type="submit" variant="primary" disabled={processing}>{isEditing ? 'Simpan Perubahan' : 'Simpan Cabang Baru'}</Btn>
            </div>
          </form>
        </div>
      )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Cabang</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat & Kontak</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator Assigned</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {branches.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada data cabang.</td></tr>
              ) : branches.map((item, index) => (
                <tr key={item?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item?.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">{item?.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="line-clamp-1">{item.address || '-'}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.phone} {item.email && `• ${item.email}`}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openAssign(item)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Users size={14} />
                      {item.users?.length || 0} Operator
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(item?.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAssigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tugaskan Operator</h3>
            <p className="text-sm text-slate-500 mb-6">Pilih operator yang akan mengelola cabang <strong>{isAssigning.name}</strong>.</p>
            
            <form onSubmit={submitAssign} className="space-y-4">
              <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1">
                {operators.length === 0 ? (
                  <p className="text-sm text-slate-400 p-4 text-center">Belum ada user dengan role Operator.</p>
                ) : operators.map((op: any) => (
                  <label key={op?.id || Math.random()} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={assignData.user_ids.includes(op?.id)}
                      onChange={(e) => {
                        const ids = e.target.checked 
                          ? [...assignData.user_ids, op?.id]
                          : assignData.user_ids.filter(id => id !== op?.id);
                        setAssignData('user_ids', ids);
                      }}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{op.name}</div>
                      <div className="text-xs text-slate-500">{op.email}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Btn type="button" variant="outline" onClick={closeAssign}>Batal</Btn>
                <Btn type="submit" variant="primary" disabled={assignProcessing}>Simpan Penugasan</Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
