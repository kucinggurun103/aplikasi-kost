import React, { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { Edit, Trash2, Image as ImageIcon, UploadCloud, X, ChevronDown, Layers } from 'lucide-react';
import { SearchableSelect } from '@/components/cozqta/primitives';
import Swal from 'sweetalert2';

const Btn = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }: any) => {
  const base = "px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2";
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

interface RoomTypeFormData {
  branch_id: string;
  room_category_id: string;
  type_code: string;
  type_name: string;
  description: string;
  room_size: string;
  monthly_price: any;
  booking_price: any;
  deposit_price: any;
  deposit_type: string;
  electricity_included: boolean;
  water_included: boolean;
  is_active: boolean;
  gender_type: string;
  facilities: number[];
  images: File[];
  amount_of_rooms: any;
  start_number: number;
  unit_prefix: string;
  unit_format: string;
  floor: string;
}

export default function AdminRoomTypes({ 
  roomTypes = [], 
  branches = [], 
  categories = [], 
  facilities = [] 
}: { 
  roomTypes: any[], 
  branches: any[], 
  categories: any[], 
  facilities: any[] 
}) {
  const { auth } = usePage().props as any;
  const isAdmin = auth?.user?.roles?.includes('admin');
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [expandedType, setExpandedType] = useState<number | null>(null);

  const getDmyhis = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };

  const { data, setData, post, delete: destroy, processing, reset, errors } = useForm<RoomTypeFormData>({
    branch_id: '',
    room_category_id: '',
    type_code: '',
    type_name: '',
    description: '',
    room_size: '',
    monthly_price: '',
    booking_price: '',
    deposit_price: '',
    deposit_type: 'Upfront',
    electricity_included: false,
    water_included: false,
    is_active: true,
    gender_type: 'Campur',
    facilities: [],
    images: [],
    amount_of_rooms: '',
    start_number: 1,
    unit_prefix: '',
    unit_format: 'numeric',
    floor: '',
  });

  React.useEffect(() => {
    if (!isAdmin && branches.length === 1 && !data.branch_id && showForm) {
      setData('branch_id', String(branches[0].id));
    }
  }, [branches, isAdmin, showForm, data.branch_id]);

  React.useEffect(() => {
    if (!isEditing && showForm && timestamp) {
      let branchPrefix = '';
      if (data.branch_id) {
        const b = branches.find(b => b.id.toString() === data.branch_id.toString());
        if (b && b.code) branchPrefix = b.code.split('-')[0] + '-';
      }
      const kw = keyword ? keyword + '-' : 'TYP-';
      setData('type_code', `${branchPrefix}${kw}${timestamp}`);
    }
  }, [keyword, data.branch_id, timestamp, isEditing, showForm]);

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      branch_id: item.branch_id ? String(item.branch_id) : '',
      room_category_id: item.room_category_id ? String(item.room_category_id) : '',
      type_code: item.type_code || '',
      type_name: item.type_name || '',
      description: item.description || '',
      room_size: item.room_size || '',
      monthly_price: item.monthly_price ? parseInt(item.monthly_price, 10) : '',
      booking_price: item.booking_price ? parseInt(item.booking_price, 10) : '',
      deposit_price: item.deposit_price ? parseInt(item.deposit_price, 10) : '',
      deposit_type: item.deposit_type || 'Upfront',
      electricity_included: Boolean(item.electricity_included),
      water_included: Boolean(item.water_included),
      is_active: Boolean(item.is_active),
      gender_type: item.gender_type || 'Campur',
      facilities: item.facilities?.map((f: any) => Number(f?.id || f)) || [],
      images: [],
      amount_of_rooms: '',
      start_number: 1,
      unit_prefix: '',
      unit_format: 'numeric',
      floor: '',
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
      post(`/admin/master/room-types/${isEditing?.id}`, { preserveScroll: true, onSuccess: closeEdit });
    } else {
      post('/admin/master/room-types', { preserveScroll: true, onSuccess: closeEdit });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Tipe Kamar?',
      text: 'Semua unit kamar di dalamnya juga akan terhapus. Yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/master/room-types/${id}`, { preserveScroll: true });
      }
    });
  };

  const handleAddUnit = async (typeId: number) => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Unit Baru',
      html: `
        <div class="flex flex-col gap-4 text-left">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Jumlah Unit</label>
            <input type="number" id="swal-input-amount" class="swal2-input !w-full !m-0 !text-sm" min="1" value="1" placeholder="Jumlah Unit">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Mulai Dari Angka</label>
              <input type="number" id="swal-input-start" class="swal2-input !w-full !m-0 !text-sm" min="1" value="1" placeholder="Mulai Dari Angka">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Format</label>
              <select id="swal-input-format" class="swal2-input !w-full !m-0 !text-sm !h-[42px] !py-0">
                <option value="numeric">Angka (1, 2...)</option>
                <option value="alphabet">Abjad (A, B...)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Awalan / Prefix (Opsional)</label>
            <input type="text" id="swal-input-prefix" class="swal2-input !w-full !m-0 !text-sm" placeholder="Awalan / Prefix">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Lantai (Angka)</label>
            <input type="number" id="swal-input-floor" class="swal2-input !w-full !m-0 !text-sm" min="1" placeholder="Lantai">
            <p class="text-[10px] text-slate-400 mt-1">Opsional, otomatis 'Lantai 1' jika dikosongkan</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const amount = (document.getElementById('swal-input-amount') as HTMLInputElement).value;
        const start_number = (document.getElementById('swal-input-start') as HTMLInputElement).value;
        const unit_prefix = (document.getElementById('swal-input-prefix') as HTMLInputElement).value;
        const unit_format = (document.getElementById('swal-input-format') as HTMLSelectElement).value;
        const floor = (document.getElementById('swal-input-floor') as HTMLInputElement).value;
        return { amount, start_number, unit_prefix, unit_format, floor };
      }
    });

    if (formValues) {
      router.post(`/admin/master/room-units/${typeId}`, formValues, { 
        preserveScroll: true,
        onError: (errors) => {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menambahkan Unit',
            text: errors.unit_prefix || 'Terjadi kesalahan saat menambahkan unit. Pastikan unit belum ada.',
            confirmButtonText: 'Tutup'
          });
        }
      });
    }
  };

  const handleUpdateUnit = (unit: any, fieldsToUpdate: any) => {
    router.put(`/admin/master/room-units/${unit.id}`, { 
      status: unit.status,
      unit_number: unit.unit_number,
      floor: unit.floor,
      building_name: unit.building_name,
      notes: unit.notes,
      ...fieldsToUpdate
    }, { preserveScroll: true });
  };

  const handleDeleteUnit = (unitId: number) => {
    Swal.fire({
      title: 'Hapus Unit Kamar?',
      text: 'Data kamar ini akan dihapus permanen. Yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/master/room-units/${unitId}`, { preserveScroll: true });
      }
    });
  };

  const handleDeleteImage = (imageId: number) => {
    destroy(`/admin/master/room-images/${imageId}`, { preserveScroll: true });
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatRupiahInput = (value: any) => {
    if (!value && value !== 0) return '';
    const number = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
    if (isNaN(number)) return '';
    return 'Rp. ' + number.toLocaleString('id-ID');
  };

  const parseCurrencyInput = (value: string) => {
    if (!value) return 0;
    const number = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return isNaN(number) ? 0 : number;
  };

  const [selectedUploadFiles, setSelectedUploadFiles] = useState<File[]>([]);
  const [isUploadingAction, setIsUploadingAction] = useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const formInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadImagesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUploading || selectedUploadFiles.length === 0) return;

    const formData = new FormData();
    selectedUploadFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    setIsUploadingAction(true);
    router.post(`/admin/master/room-types/${isUploading.id}/images`, formData, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedUploadFiles([]);
        setIsUploadingAction(false);
        if (uploadInputRef.current) uploadInputRef.current.value = '';
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Foto kamar berhasil diunggah.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (errs) => {
        setIsUploadingAction(false);
        Swal.fire({
          icon: 'error',
          title: 'Upload Gagal',
          text: Object.values(errs).join(', ') || 'Terjadi kesalahan saat mengunggah foto.',
        });
      }
    });
  };

  if (isUploading) {
    const currentRoom = roomTypes.find(r => r?.id === isUploading?.id) || isUploading;
    const currentImages = currentRoom.images || [];

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kelola Gambar: {currentRoom.type_name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kode: {currentRoom.type_code}</p>
          </div>
          <Btn onClick={() => { setIsUploading(null); setSelectedUploadFiles([]); }} variant="outline">Kembali</Btn>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-sm mb-3">Foto Tersimpan Saat Ini ({currentImages.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {currentImages.length > 0 ? (
              currentImages.map((img: any, idx: number) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 bg-slate-50 shadow-2xs">
                  <img src={`/storage/${img.image}`} alt="Room" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleDeleteImage(img.id)} 
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                      title="Hapus Foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      Cover
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada gambar untuk tipe kamar ini.
              </div>
            )}
          </div>

          <form onSubmit={handleUploadImagesSubmit} className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Upload Foto Tambahan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Bisa pilih 1 per 1 secara bertahap atau sekaligus banyak foto.</p>
              </div>
              {selectedUploadFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedUploadFiles([])}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Hapus Semua ({selectedUploadFiles.length})
                </button>
              )}
            </div>

            <div className="space-y-4">
              <input 
                ref={uploadInputRef}
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setSelectedUploadFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }}
                className="hidden" 
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <UploadCloud size={18} />
                  <span>{selectedUploadFiles.length > 0 ? '+ Tambah Foto Lagi' : 'Pilih / Tambah Foto'}</span>
                </button>
                <span className="text-xs text-slate-500">
                  {selectedUploadFiles.length === 0 ? 'Belum ada foto baru dipilih.' : `${selectedUploadFiles.length} foto baru siap diunggah.`}
                </span>
              </div>

              {selectedUploadFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {selectedUploadFiles.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 bg-white group shadow-2xs">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => {
                            const next = [...selectedUploadFiles];
                            next.splice(i, 1);
                            setSelectedUploadFiles(next);
                          }}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                          title="Hapus"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <Btn type="submit" variant="primary" disabled={isUploadingAction || selectedUploadFiles.length === 0} className="w-full sm:w-auto">
                  <UploadCloud size={16} /> {isUploadingAction ? 'Mengunggah...' : `Simpan & Unggah (${selectedUploadFiles.length} Foto)`}
                </Btn>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
                setTimestamp(getDmyhis());
                setKeyword('');
              }
              setShowForm(!showForm);
            }
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar Baru'}</h2>
            {!showForm && !isEditing && <p className="text-sm text-slate-500 mt-1">Klik untuk menambahkan tipe kamar baru</p>}
          </div>
          <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={24} />
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            <form onSubmit={submit} className="space-y-6 pt-4">
            

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span> Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Cabang Properti</label>
                  <SearchableSelect 
                    value={data.branch_id} 
                    onChange={val => setData('branch_id', val)}
                    options={[{label: '-- Pilih Cabang --', value: ''}, ...branches.map(b => ({ label: `${b.code} - ${b.name}`, value: String(b.id) }))]}
                  />
                  {errors.branch_id && <div className="text-red-500 text-xs mt-1">{errors.branch_id}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Kamar</label>
                  <SearchableSelect 
                    value={data.room_category_id} 
                    onChange={val => setData('room_category_id', val)}
                    options={
                      !data.branch_id 
                        ? [{label: '-- Pilih Cabang Terlebih Dahulu --', value: ''}] 
                        : [{label: '-- Pilih Kategori --', value: ''}, ...categories.filter(c => !c.branch_id || String(c.branch_id) === String(data.branch_id)).map(c => ({ label: c.name, value: String(c.id) }))]
                    }
                  />
                  {errors.room_category_id && <div className="text-red-500 text-xs mt-1">{errors.room_category_id}</div>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{isEditing ? 'Kode Tipe Kamar' : 'Kata Kunci Tipe Kamar'}</label>
                  <input 
                    required 
                    maxLength={isEditing ? 50 : 4}
                    type="text" 
                    value={isEditing ? data.type_code : keyword} 
                    onChange={e => {
                      const val = e.target.value.toUpperCase();
                      if (isEditing) {
                        setData('type_code', val);
                      } else {
                        setKeyword(val);
                      }
                    }} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder={isEditing ? "Kode Tipe" : "Kata Kunci Tipe (Prefix)"} 
                  />
                  {!isEditing && <div className="text-xs text-indigo-600 font-medium mt-1">Otomatis Dibuat: {data.type_code}</div>}
                  {errors.type_code && <div className="text-red-500 text-xs mt-1">{errors.type_code}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Tipe Kamar</label>
                  <input required type="text" value={data.type_name} onChange={e => setData('type_name', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Nama Tipe Kamar" />
                  {errors.type_name && <div className="text-red-500 text-xs mt-1">{errors.type_name}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipe Penghuni (Gender)</label>
                  <SearchableSelect 
                    value={data.gender_type} 
                    onChange={val => setData('gender_type', val)}
                    options={[
                      {label: 'Campur (Pria & Wanita)', value: 'Campur'},
                      {label: 'Khusus Pria', value: 'Pria'},
                      {label: 'Khusus Wanita', value: 'Wanita'}
                    ]}
                  />
                  {errors.gender_type && <div className="text-red-500 text-xs mt-1">{errors.gender_type}</div>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span> Harga & Ukuran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Harga Bulanan</label>
                  <input 
                    required 
                    type="text" 
                    value={formatRupiahInput(data.monthly_price)} 
                    onChange={e => setData('monthly_price', parseCurrencyInput(e.target.value))} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Harga Bulanan"
                  />
                  {errors.monthly_price && <div className="text-red-500 text-xs mt-1">{errors.monthly_price}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya Booking / DP</label>
                  <input 
                    required 
                    type="text" 
                    value={formatRupiahInput(data.booking_price)} 
                    onChange={e => setData('booking_price', parseCurrencyInput(e.target.value))} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Biaya Booking / DP"
                  />
                  {errors.booking_price && <div className="text-red-500 text-xs mt-1">{errors.booking_price}</div>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipe Deposit</label>
                  <SearchableSelect 
                    value={data.deposit_type} 
                    onChange={val => setData('deposit_type', val)}
                    options={[
                      {label: 'Bayar di Awal (Upfront)', value: 'Upfront'},
                      {label: 'Bayar di Akhir / Nanti', value: 'AtEnd'},
                      {label: 'Tanpa Deposit', value: 'None'}
                    ]}
                  />
                  {errors.deposit_type && <div className="text-red-500 text-xs mt-1">{errors.deposit_type}</div>}
                </div>
                {data.deposit_type !== 'None' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nominal Deposit</label>
                    <input 
                      required 
                      type="text" 
                      value={formatRupiahInput(data.deposit_price)} 
                      onChange={e => setData('deposit_price', parseCurrencyInput(e.target.value))} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Nominal Deposit"
                    />
                    {errors.deposit_price && <div className="text-red-500 text-xs mt-1">{errors.deposit_price}</div>}
                  </div>
                ) : (
                  <div></div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ukuran Kamar (m²)</label>
                  <input type="number" min="0" step="0.1" value={data.room_size} onChange={e => setData('room_size', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Ukuran Kamar (m²)" />
                  {errors.room_size && <div className="text-red-500 text-xs mt-1">{errors.room_size}</div>}
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
                <h3 className="text-sm font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span> Auto-Generate Unit Kamar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Kamar</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      value={data.amount_of_rooms} 
                      onChange={e => setData('amount_of_rooms', e.target.value)} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white" 
                      placeholder="Jumlah Kamar" 
                    />
                    {errors.amount_of_rooms && <div className="text-red-500 text-xs mt-1">{errors.amount_of_rooms}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Lantai (Angka)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-sm font-medium">Lantai</span>
                      </div>
                      <input 
                        type="number" 
                        min="1"
                        value={data.floor} 
                        onChange={e => setData('floor', e.target.value)} 
                        className="w-full pl-14 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white" 
                        placeholder="Lantai" 
                      />
                    </div>
                    <p className="text-[10px] text-indigo-500/80 mt-1 font-medium">Opsional. Diterapkan ke semua unit yang digenerate.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mulai Dari Angka</label>
                    <input 
                      type="number" 
                      min="1"
                      value={data.start_number} 
                      onChange={e => setData('start_number', parseInt(e.target.value) || 1)} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white" 
                      placeholder="Mulai Dari Angka" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Format Penomoran</label>
                    <SearchableSelect 
                      value={data.unit_format} 
                      onChange={val => setData('unit_format', val)}
                      options={[
                        {label: 'Angka (1, 2, 3...)', value: 'numeric'},
                        {label: 'Abjad (A, B, C...)', value: 'alphabet'}
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Awalan / Prefix (Opsional)</label>
                    <input 
                      type="text" 
                      value={data.unit_prefix} 
                      onChange={e => setData('unit_prefix', e.target.value)} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white" 
                      placeholder="Awalan / Prefix" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Kamar</label>
              <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Fasilitas Kamar & Tagihan (Centang yang tersedia)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Utilities: Listrik & Air */}
                <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 bg-amber-50/30 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={data.electricity_included} 
                    onChange={e => setData('electricity_included', e.target.checked)} 
                    className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-600" 
                  />
                  <span className="text-sm font-semibold text-amber-900">Listrik Termasuk</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 bg-sky-50/30 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={data.water_included} 
                    onChange={e => setData('water_included', e.target.checked)} 
                    className="w-4 h-4 text-sky-600 border-sky-300 rounded focus:ring-sky-600" 
                  />
                  <span className="text-sm font-semibold text-sky-900">Air Termasuk</span>
                </label>

                {/* Branch Specific Facilities */}
                {!data.branch_id ? (
                  <p className="text-sm text-slate-500 col-span-full">Silakan pilih cabang properti terlebih dahulu.</p>
                ) : (
                  facilities.filter(f => !f.branch_id || String(f.branch_id) === String(data.branch_id)).map(f => (
                    <label key={f.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200/70 bg-white transition-colors">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600"
                        checked={data.facilities.some((fid: any) => Number(fid) === Number(f.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData('facilities', [...data.facilities.filter((id: any) => Number(id) !== Number(f.id)), Number(f.id)]);
                          } else {
                            setData('facilities', data.facilities.filter((id: any) => Number(id) !== Number(f.id)));
                          }
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">{f.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            
            {!isEditing && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-800">
                      Upload Gambar Kamar
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bisa pilih 1 per 1 secara bertahap atau langsung pilih banyak foto sekaligus.
                    </p>
                  </div>
                  {data.images && data.images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setData('images', [])}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus Semua ({data.images.length})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-indigo-400 rounded-xl text-sm font-semibold transition-all shadow-2xs">
                      <UploadCloud size={18} className="text-indigo-600" />
                      <span>{data.images.length > 0 ? '+ Tambah Foto Lainnya' : 'Pilih / Unggah Foto'}</span>
                      <input 
                        id="form-room-images-input"
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setData('images', [...data.images, ...Array.from(e.target.files)]);
                            e.target.value = '';
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                    <span className="text-xs text-slate-500">
                      {data.images.length === 0 ? 'Belum ada foto dipilih.' : `${data.images.length} foto dipilih (Foto #1 otomatis jadi Cover)`}
                    </span>
                  </div>

                  {data.images && data.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                      {data.images.map((file, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 bg-white group shadow-2xs">
                          <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => {
                                const newImages = [...data.images];
                                newImages.splice(i, 1);
                                setData('images', newImages);
                              }}
                              className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                              title="Hapus Foto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${i === 0 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-black/60 text-white'}`}>
                            {i === 0 ? 'Cover' : `#${i + 1}`}
                          </span>
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {Object.keys(errors).filter(k => k.startsWith('images')).map(k => (
                    <div key={k} className="text-red-500 text-xs mt-1">{errors[k as keyof typeof errors]}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {isEditing && <Btn type="button" variant="outline" onClick={closeEdit}>Batal</Btn>}
              <Btn type="submit" variant="primary" disabled={processing}>{isEditing ? 'Simpan Perubahan' : 'Simpan Tipe Kamar Baru'}</Btn>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe Kamar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori / Cabang</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Fasilitas</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roomTypes.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada data tipe kamar.</td></tr>
              ) : roomTypes.map((item, index) => (
                <React.Fragment key={item?.id || Math.random()}>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        {item?.cover_image ? (
                          <img src={`/storage/${item.cover_image}`} alt={item?.type_name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold text-sm text-slate-900">{item?.type_name}</div>
                        <div className="flex gap-2 items-center text-xs text-slate-500">
                          {item?.type_code}
                          {item.gender_type && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.gender_type === 'Pria' ? 'bg-blue-100 text-blue-700' :
                              item.gender_type === 'Wanita' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {item.gender_type === 'Campur' ? 'Campur' : `Khusus ${item.gender_type}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 mb-1">
                      {item?.category?.name || '-'}
                    </span>
                    <div className="text-xs text-slate-500">{item?.branch?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-slate-900">{formatRupiah(item?.monthly_price)}<span className="text-xs text-slate-400 font-normal">/bln</span></div>
                    <div className="text-xs text-slate-500 mt-1">Dep: {formatRupiah(item?.deposit_price)}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                      {item?.facilities?.slice(0, 3).map((f:any) => (
                        <span key={f?.id} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded" title={f?.name}>{f?.name}</span>
                      ))}
                      {item?.facilities?.length > 3 && (
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">+{item.facilities.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setExpandedType(expandedType === item.id ? null : item.id)} className={`p-2 rounded-xl transition-colors ${expandedType === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title="Kelola Unit"><Layers size={16}/></button>
                      <button onClick={() => setIsUploading(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Kelola Gambar"><ImageIcon size={16}/></button>
                      <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Edit"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(item?.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
                {expandedType === item.id && (
                  <tr key={`expanded-${item.id}`} className="bg-slate-50/50 border-b border-slate-100">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-800 text-sm">Daftar Unit Kamar ({item.units?.length || 0})</h4>
                          <Btn variant="primary" size="sm" onClick={() => handleAddUnit(item.id)} disabled={processing}>
                            + Tambah Unit
                          </Btn>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(!item.units || item.units.length === 0) ? (
                            <p className="text-sm text-slate-400 col-span-full">Belum ada unit kamar di tipe ini.</p>
                          ) : item.units.map((unit: any) => (
                            <div key={unit.id} className="flex flex-col gap-2 border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                              <div className="flex items-center justify-between gap-2">
                                <input 
                                  type="text" 
                                  defaultValue={unit.unit_number} 
                                  placeholder="No/Nama Kamar"
                                  onBlur={e => handleUpdateUnit(unit, { unit_number: e.target.value })}
                                  className="font-semibold text-slate-800 text-sm bg-transparent border-none p-0 focus:ring-0 w-32"
                                />
                                <button onClick={() => handleDeleteUnit(unit.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <SearchableSelect 
                                  value={unit.status} 
                                  disabled={!isAdmin}
                                  onChange={val => handleUpdateUnit(unit, { status: val })}
                                  className={`text-xs ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''} ${unit.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : unit.status === 'Reserved' ? 'bg-warning-50 text-warning-700 border-warning-200' : unit.status === 'Occupied' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
                                  options={[
                                    {label: 'Tersedia', value: 'Available'},
                                    {label: 'Di-booking', value: 'Reserved'},
                                    {label: 'Terisi', value: 'Occupied'},
                                    {label: 'Maintenance', value: 'Maintenance'},
                                    {label: 'Nonaktif', value: 'Inactive'}
                                  ]}
                                />
                                <input 
                                  type="text" 
                                  defaultValue={unit.floor || ''} 
                                  placeholder="Lantai"
                                  onBlur={e => handleUpdateUnit(unit, { floor: e.target.value })}
                                  className="w-full text-xs rounded-md border-slate-200 py-1 px-2 focus:ring-indigo-500"
                                />
                                <input 
                                  type="text" 
                                  defaultValue={unit.building_name || ''} 
                                  placeholder="Gedung/Blok"
                                  onBlur={e => handleUpdateUnit(unit, { building_name: e.target.value })}
                                  className="w-full text-xs rounded-md border-slate-200 py-1 px-2 focus:ring-indigo-500"
                                />
                                <input 
                                  type="text" 
                                  defaultValue={unit.notes || ''} 
                                  placeholder="Catatan..."
                                  onBlur={e => handleUpdateUnit(unit, { notes: e.target.value })}
                                  className="w-full text-xs rounded-md border-slate-200 py-1 px-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
