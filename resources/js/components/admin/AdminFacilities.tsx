import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { fmtIDR } from '@/components/cozqta/data';
import { 
  Edit, Trash2, Wifi, Tv, Wind, Coffee, Dumbbell, Car, Shield, Waves, 
  Utensils, Droplet, Box, Sparkles, MapPin, Search, ChevronDown, Zap, Bath, BedDouble, Refrigerator 
} from 'lucide-react';
import { Badge, SearchableSelect } from '@/components/cozqta/primitives';
import Swal from 'sweetalert2';

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

// Selectable icons for facilities matching database
const iconMap: Record<string, any> = {
  Wifi, Tv, Wind, Coffee, Dumbbell, Car, Shield, Waves, Utensils, Droplet, Zap, Bath, BedDouble, Refrigerator, Box, Sparkles, MapPin, Search
};

export default function AdminFacilities({ facilities = [], branches = [] }: { facilities: any[], branches?: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [searchIcon, setSearchIcon] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    name: '',
    icon: 'Sparkles', // default
    description: '',
    price: '',
    branch_id: branches.length > 0 ? branches[0].id : '',
  });

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      name: item.name,
      icon: item.icon || 'Sparkles',
      description: item.description || '',
      price: item.price || '',
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
      put(`/admin/master/facilities/${isEditing?.id}`, { preserveScroll: true, onSuccess: closeEdit });
    } else {
      post('/admin/master/facilities', { preserveScroll: true, onSuccess: closeEdit });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Fasilitas?',
      text: 'Yakin ingin menghapus fasilitas ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/master/facilities/${id}`, { preserveScroll: true });
      }
    });
  };

  // Helper to render icon
  const renderIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || iconMap['Sparkles'];
    return <Icon size={18} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Fasilitas' : 'Fasilitas'}</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola daftar fasilitas yang tersedia</p>
          </div>
          <Btn 
            onClick={() => {
              if (showForm && isEditing) {
                closeEdit();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="flex items-center gap-2"
          >
            {showForm && !isEditing ? 'Tutup Form' : isEditing ? 'Batal Edit' : 'Tambah Fasilitas Baru'}
            <ChevronDown className={`transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={16} />
          </Btn>
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            <form onSubmit={submit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Fasilitas</label>
                <input required type="text" value={data.name} onChange={e => setData('name', e.target.value.toUpperCase())} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 uppercase" placeholder="Nama Fasilitas" />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Ikon</label>
                <div className="relative">
                  <button type="button" className="w-full flex items-center gap-3 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50">
                    {renderIcon(data.icon)}
                    <span className="text-sm font-medium">{data.icon}</span>
                  </button>
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-lg grid grid-cols-6 gap-2">
                    {Object.keys(iconMap).map(iconName => {
                      const Icon = iconMap[iconName];
                      const isSelected = data.icon === iconName;
                      return (
                        <button 
                          key={iconName}
                          type="button"
                          onClick={() => setData('icon', iconName)}
                          title={iconName}
                          className={`p-2 flex items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          <Icon size={20} />
                        </button>
                      )
                    })}
                  </div>
                </div>
                {errors.icon && <div className="text-red-500 text-xs mt-1">{errors.icon}</div>}
              </div>
            </div>
            {branches.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Cabang</label>
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Harga Bulanan / Add-on (Opsional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">Rp</span>
                <input 
                  type="text" 
                  value={data.price ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
                  onChange={e => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    setData('price', rawValue);
                  }} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Harga Bulanan / Add-on" 
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Kosongkan atau isi 0 jika fasilitas ini gratis (termasuk harga sewa kamar).</p>
              {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
            </div>
            <div className="flex gap-3 pt-4">
              {isEditing && <Btn type="button" variant="outline" onClick={closeEdit}>Batal</Btn>}
              <Btn type="submit" variant="primary" disabled={processing}>{isEditing ? 'Simpan Perubahan' : 'Simpan Fasilitas Baru'}</Btn>
            </div>
          </form>
        </div>
      )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ikon</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fasilitas</th>
              {branches.length > 0 && <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cabang</th>}
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe / Harga</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {facilities.length === 0 ? (
              <tr><td colSpan={branches.length > 0 ? 6 : 5} className="p-8 text-center text-slate-400">Belum ada data fasilitas.</td></tr>
            ) : facilities.map(item => (
              <tr key={item?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500">{renderIcon(item?.icon)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 uppercase">{item?.name}</td>
                {branches.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item?.branch_id ? branches.find((b: any) => b.id === item.branch_id)?.name || 'Cabang Tidak Ditemukan' : <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">Tidak Valid</span>}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item?.price > 0 ? (
                    <span className="inline-flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit mb-1">Add-on Berbayar</span>
                      <span className="text-slate-700 font-semibold">{fmtIDR(item.price)} <span className="text-slate-400 font-normal">/bln</span></span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">Gratis (Bawaan)</span>
                  )}
                </td>
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
    </div>
  );
}
