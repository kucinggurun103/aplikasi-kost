import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { SearchableSelect } from '@/components/cozqta/primitives';

const Btn = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }: any) => {
  const base = "px-4 py-2 rounded-xl font-medium text-sm transition-all";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${(variants as any)[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function AdminCategories({ categories = [], branches = [] }: { categories: any[], branches?: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    name: '',
    description: '',
    branch_id: branches.length > 0 ? branches[0].id : '',
  });

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      name: item.name,
      description: item.description || '',
      branch_id: item.branch_id || (branches.length > 0 ? branches[0].id : ''),
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
      put(`/admin/master/categories/${isEditing?.id}`, { preserveScroll: true, onSuccess: closeEdit });
    } else {
      post('/admin/master/categories', { preserveScroll: true, onSuccess: closeEdit });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Kategori?',
      text: 'Yakin ingin menghapus kategori ini? Tipe kamar yang menggunakan kategori ini mungkin akan terpengaruh.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/master/categories/${id}`, { preserveScroll: true });
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            if (showForm && isEditing) {
              closeEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
            {!showForm && !isEditing && <p className="text-sm text-slate-500 mt-1">Klik untuk menambahkan kategori baru</p>}
          </div>
          <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={24} />
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            <form onSubmit={submit} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kategori</label>
              <input required type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Nama Kategori" />
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            {branches.length > 0 && (
              <div>
                <SearchableSelect 
                  value={data.branch_id} 
                  onChange={val => setData('branch_id', val)}
                  options={branches.map((b: any) => ({ label: b.name, value: b.id }))}
                  placeholder="Pilih Cabang..."
                />
                {errors.branch_id && <div className="text-red-500 text-xs mt-1">{errors.branch_id}</div>}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Tambahan</label>
              <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Deskripsi Tambahan" />
              {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            <div className="flex gap-3 pt-4">
              {isEditing && <Btn type="button" variant="outline" onClick={closeEdit}>Batal</Btn>}
              <Btn type="submit" variant="primary" disabled={processing}>{isEditing ? 'Simpan Perubahan' : 'Simpan Kategori Baru'}</Btn>
            </div>
          </form>
        </div>
      )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
              {branches.length > 0 && <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cabang</th>}
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.length === 0 ? (
              <tr><td colSpan={branches.length > 0 ? 4 : 3} className="p-8 text-center text-slate-400">Belum ada data kategori.</td></tr>
            ) : categories.map(item => (
              <tr key={item?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item?.name}</td>
                {branches.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item?.branch_id ? branches.find((b: any) => b.id === item.branch_id)?.name || 'Cabang Tidak Ditemukan' : <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">Tidak Valid</span>}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-slate-500">{item?.description || '-'}</td>
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
  );
}
