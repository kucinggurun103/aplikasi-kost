import {
    Plus,
    Star,
    MessageCircle,
    MapPin,
    Trash2,
    Edit2,
    XCircle,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import ReviewController from '@/actions/App/Http/Controllers/Admin/ReviewController';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

export default function AdminReviews({
    reviews,
    branches,
}: {
    reviews: any[];
    branches: any[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
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
            put(ReviewController.update.url(editingId), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(ReviewController.store.url(), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteReview = (id: number) => {
        if (confirm('Hapus ulasan ini?')) {
            router.delete(ReviewController.destroy.url(id), {
                preserveScroll: true,
            });
        }
    };

    // Helper for rendering stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={
                            star <= rating
                                ? 'fill-amber-400'
                                : 'fill-slate-200 text-slate-200'
                        }
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Ulasan Cabang
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola dan tampilkan ulasan pengguna untuk setiap cabang
                        kost.
                    </p>
                </div>
                <Btn variant="primary" onClick={() => openModal()}>
                    <Plus size={16} className="mr-1.5" /> Tambah Manual
                </Btn>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {reviews?.map((review: any) => (
                    <div
                        key={review.id}
                        className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div
                            className={`absolute top-0 left-0 h-full w-1 ${review.is_published ? 'bg-amber-400' : 'bg-slate-300'}`}
                        ></div>

                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                                    {review.reviewer_name
                                        .substring(0, 1)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="leading-tight font-bold text-slate-900">
                                        {review.reviewer_name}
                                    </h3>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openModal(review)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => deleteReview(review.id)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <p className="mb-4 flex-1 text-sm text-slate-600 italic">
                            "{review.review_text}"
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-slate-500">
                                <MapPin size={12} className="text-indigo-500" />
                                <span className="max-w-[150px] truncate">
                                    {review.branch?.name || '-'}
                                </span>
                            </div>
                            <Badge
                                variant={
                                    review.is_published ? 'success' : 'outline'
                                }
                                className="text-[10px]"
                            >
                                {review.is_published ? 'Published' : 'Hidden'}
                            </Badge>
                        </div>
                    </div>
                ))}

                {(!reviews || reviews.length === 0) && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-100 bg-white py-12 text-center text-slate-500">
                        <MessageCircle
                            size={40}
                            className="mx-auto mb-3 text-slate-300"
                        />
                        Belum ada ulasan cabang. Tambahkan manual untuk
                        ditampilkan di website!
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? 'Edit Ulasan'
                                    : 'Tambah Ulasan Manual'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={submitForm}
                            className="space-y-4 overflow-y-auto p-5"
                        >
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Cabang Kost
                                </label>
                                <SearchableSelect
                                    value={data.branch_id}
                                    onChange={(val) =>
                                        setData('branch_id', val)
                                    }
                                    options={[
                                        { label: 'Pilih Cabang', value: '' },
                                        ...branches.map((b: any) => ({
                                            label: b.name,
                                            value: String(b.id),
                                        })),
                                    ]}
                                />
                                {errors.branch_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Nama Reviewer
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nama Reviewer"
                                    value={data.reviewer_name}
                                    onChange={(e) =>
                                        setData('reviewer_name', e.target.value)
                                    }
                                    required
                                />
                                {errors.reviewer_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.reviewer_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Rating Bintang (1-5)
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setData('rating', star)
                                            }
                                            className="p-1 transition-transform focus:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={
                                                    star <= data.rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-slate-200 text-slate-200'
                                                }
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 font-bold text-slate-700">
                                        {data.rating}/5
                                    </span>
                                </div>
                                {errors.rating && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.rating}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Isi Ulasan
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Isi Review"
                                    value={data.review_text}
                                    onChange={(e) =>
                                        setData('review_text', e.target.value)
                                    }
                                    required
                                ></textarea>
                                {errors.review_text && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.review_text}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.is_published}
                                    onChange={(e) =>
                                        setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                />
                                <label
                                    htmlFor="is_published"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Tampilkan di Website
                                </label>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <Btn
                                    variant="outline"
                                    type="button"
                                    onClick={closeModal}
                                >
                                    Batal
                                </Btn>
                                <Btn
                                    variant="primary"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Simpan Ulasan
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
