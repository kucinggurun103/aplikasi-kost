import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Star, MessageCircle, MapPin, Trash2, Edit2, XCircle } from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

export default function AdminReviews({ reviews, branches }: { reviews: any[], branches: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    branch_id: branches.length > 0 ? branches[0].id : '',
    reviewer_name: '',
    rating: 5,
    review_text: '',
    is_published: true,
  });

  const openModal = (review: any = null) => {
    clearErrors();
    if (review) {
      setEditingId(review.id);
      setData({
        branch_id: review.branch_id,
        reviewer_name: review.reviewer_name,
        rating: review.rating,
        review_text: review.review_text,
        is_published: Boolean(review.is_published),
      });
    } else {
      setEditingId(null);
      reset();
      if (branches.length > 0) setData('branch_id', branches[0].id);
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
      put(`/admin/settings/reviews/${editingId}`, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
    } else {
      post(`/admin/settings/reviews`, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
      });
    }
  };

  const deleteReview = (id: number) => {
    if (confirm("Hapus ulasan ini?")) {
      router.delete(`/admin/settings/reviews/${id}`, { preserveScroll: true });
    }
  };

  // Helper for rendering stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={14} className={star <= rating ? 'fill-amber-400' : 'text-slate-200 fill-slate-200'} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ulasan Cabang</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola dan tampilkan ulasan pengguna untuk setiap cabang kost.</p>
        </div>
        <Btn variant="primary" onClick={() => openModal()}><Plus size={16} className="mr-1.5" /> Tambah Manual</Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews?.map((review: any) => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-1 h-full ${review.is_published ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {review.reviewer_name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{review.reviewer_name}</h3>
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(review)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => deleteReview(review.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            <p className="text-sm text-slate-600 italic mb-4 flex-1">"{review.review_text}"</p>

            <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin size={12} className="text-indigo-500" />
                <span className="truncate max-w-[150px]">{review.branch?.name || '-'}</span>
              </div>
              <Badge variant={review.is_published ? 'success' : 'outline'} className="text-[10px]">
                {review.is_published ? 'Published' : 'Hidden'}
              </Badge>
            </div>
          </div>
        ))}

        {(!reviews || reviews.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-100 border-dashed rounded-2xl">
            <MessageCircle size={40} className="mx-auto text-slate-300 mb-3" />
            Belum ada ulasan cabang. Tambahkan manual untuk ditampilkan di website!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Ulasan' : 'Tambah Ulasan Manual'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
            </div>
            
            <form onSubmit={submitForm} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cabang Kost</label>
                <SearchableSelect 
                  value={data.branch_id}
                  onChange={val => setData('branch_id', val)}
                  options={[{label: 'Pilih Cabang', value: ''}, ...branches.map((b: any) => ({ label: b.name, value: String(b.id) }))]}
                />
                {errors.branch_id && <p className="text-xs text-red-500 mt-1">{errors.branch_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Reviewer</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nama Reviewer" value={data.reviewer_name} onChange={e => setData('reviewer_name', e.target.value)} required />
                {errors.reviewer_name && <p className="text-xs text-red-500 mt-1">{errors.reviewer_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rating Bintang (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setData('rating', star)}
                      className="p-1 focus:outline-none focus:scale-110 transition-transform"
                    >
                      <Star size={24} className={star <= data.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'} />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700">{data.rating}/5</span>
                </div>
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Isi Ulasan</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Isi Review" value={data.review_text} onChange={e => setData('review_text', e.target.value)} required></textarea>
                {errors.review_text && <p className="text-xs text-red-500 mt-1">{errors.review_text}</p>}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_published" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} />
                <label htmlFor="is_published" className="text-sm font-medium text-slate-700">Tampilkan di Website</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <Btn variant="outline" type="button" onClick={closeModal}>Batal</Btn>
                <Btn variant="primary" type="submit" disabled={processing}>Simpan Ulasan</Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
