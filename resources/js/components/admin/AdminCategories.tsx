import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { SearchableSelect } from '@/components/cozqta/primitives';

const Btn = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
}: any) => {
    const base = 'px-4 py-2 rounded-xl font-medium text-sm transition-all';
    const variants = {
        primary:
            'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50',
        outline:
            'border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50',
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${(variants as any)[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default function AdminCategories({
    categories = [],
    branches = [],
}: {
    categories: any[];
    branches?: any[];
}) {
    const [isEditing, setIsEditing] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
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
            branch_id:
                item.branch_id || (branches.length > 0 ? branches[0].id : ''),
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
            put(`/admin/master/categories/${isEditing?.id}`, {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
        } else {
            post('/admin/master/categories', {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
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
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(`/admin/master/categories/${id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-4xl space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div
                    className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-slate-50"
                    onClick={() => {
                        if (showForm && isEditing) {
                            closeEdit();
                        } else {
                            setShowForm(!showForm);
                        }
                    }}
                >
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEditing
                                ? 'Edit Kategori'
                                : 'Tambah Kategori Baru'}
                        </h2>
                        {!showForm && !isEditing && (
                            <p className="mt-1 text-sm text-slate-500">
                                Klik untuk menambahkan kategori baru
                            </p>
                        )}
                    </div>
                    <ChevronDown
                        className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`}
                        size={24}
                    />
                </div>

                {showForm && (
                    <div className="animate-fade-in border-t border-slate-100 p-6 pt-0">
                        <form onSubmit={submit} className="space-y-4 pt-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Nama Kategori
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nama Kategori"
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            {branches.length > 0 && (
                                <div>
                                    <SearchableSelect
                                        value={data.branch_id}
                                        onChange={(val) =>
                                            setData('branch_id', val)
                                        }
                                        options={branches.map((b: any) => ({
                                            label: b.name,
                                            value: b.id,
                                        }))}
                                        placeholder="Pilih Cabang..."
                                    />
                                    {errors.branch_id && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.branch_id}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Deskripsi Tambahan
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Deskripsi Tambahan"
                                />
                                {errors.description && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.description}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 pt-4">
                                {isEditing && (
                                    <Btn
                                        type="button"
                                        variant="outline"
                                        onClick={closeEdit}
                                    >
                                        Batal
                                    </Btn>
                                )}
                                <Btn
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                >
                                    {isEditing
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Kategori Baru'}
                                </Btn>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                No
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Kategori
                            </th>
                            {branches.length > 0 && (
                                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                    Cabang
                                </th>
                            )}
                            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Deskripsi
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {categories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={branches.length > 0 ? 5 : 4}
                                    className="p-8 text-center text-slate-400"
                                >
                                    Belum ada data kategori.
                                </td>
                            </tr>
                        ) : (
                            categories.map((item, index) => (
                                <tr
                                    key={item?.id || Math.random()}
                                    className="transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                                        {item?.name}
                                    </td>
                                    {branches.length > 0 && (
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                            {item?.branch_id ? (
                                                branches.find(
                                                    (b: any) =>
                                                        b.id === item.branch_id,
                                                )?.name ||
                                                'Cabang Tidak Ditemukan'
                                            ) : (
                                                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                                                    Tidak Valid
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {item?.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item?.id)
                                                }
                                                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
