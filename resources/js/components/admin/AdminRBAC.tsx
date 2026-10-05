import { ChevronDown, Edit, Trash2, Shield, Users } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Btn = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: any) => {
    const base =
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200';
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };
    const variants = {
        primary:
            'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200',
        outline:
            'bg-white text-slate-700 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    };

    return (
        <button
            className={`${base} ${sizes[size as keyof typeof sizes]} ${variants[variant as keyof typeof variants]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default function AdminRBAC({
    roles = [],
    users = [],
}: {
    roles: any[];
    users: any[];
}) {
    const [activeTab, setActiveTab] = useState<'roles' | 'staff' | 'tenants'>(
        'roles',
    );

    const staffUsers = users.filter((u: any) => u.roles && u.roles.length > 0);
    const tenantUsers = users.filter(
        (u: any) => !u.roles || u.roles.length === 0,
    );

    return (
        <div className="animate-fade-in mx-auto w-full max-w-5xl space-y-6">
            {/* Navigation Tabs */}
            <div className="hide-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Shield size={18} /> Manajemen Role
                </button>
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Users size={18} /> Staff & Admin
                </button>
                <button
                    onClick={() => setActiveTab('tenants')}
                    className={`flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeTab === 'tenants' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Users size={18} /> Penghuni (Tenant)
                </button>
            </div>

            <div className="pt-2">
                {activeTab === 'roles' && <RoleManager roles={roles} />}
                {activeTab === 'staff' && (
                    <UserManager
                        type="staff"
                        users={staffUsers}
                        roles={roles}
                    />
                )}
                {activeTab === 'tenants' && (
                    <UserManager
                        type="tenants"
                        users={tenantUsers}
                        roles={roles}
                    />
                )}
            </div>
        </div>
    );
}

function RoleManager({ roles = [] }: { roles: any[] }) {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState<any>(null);

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
        code: '',
        description: '',
        access_all_branches: false,
    });

    const openEdit = (item: any) => {
        setIsEditing(item);
        setShowForm(true);
        setData({
            name: item.name,
            code: item.code,
            description: item.description || '',
            access_all_branches: item.access_all_branches || false,
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
            put(`/admin/master/roles/${isEditing.id}`, {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
        } else {
            post('/admin/master/roles', {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Role?',
            text: 'Yakin ingin menghapus role ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(`/admin/master/roles/${id}`, { preserveScroll: true });
            }
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Shield className="text-indigo-600" size={24} /> Manajemen Role
            </h2>
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div
                    className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-slate-50"
                    onClick={() => {
                        if (showForm && isEditing) closeEdit();
                        else setShowForm(!showForm);
                    }}
                >
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {isEditing ? 'Edit Role' : 'Tambah Role Baru'}
                        </h3>
                        {!showForm && !isEditing && (
                            <p className="mt-1 text-sm text-slate-500">
                                Klik untuk menambahkan role akses sistem
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                                        Nama Role
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Nama Role"
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                                        Kode Role
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData(
                                                'code',
                                                e.target.value.toLowerCase(),
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Kode Role"
                                    />
                                    {errors.code && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.code}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Deskripsi"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="access_all_branches"
                                    checked={data.access_all_branches}
                                    onChange={(e) =>
                                        setData(
                                            'access_all_branches',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="access_all_branches"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Akses ke Semua Cabang
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
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
                                    {isEditing ? 'Simpan' : 'Tambah Role'}
                                </Btn>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">Nama Role</th>
                                <th className="px-6 py-4">Kode</th>
                                <th className="px-6 py-4">Akses Cabang</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {roles.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-slate-400"
                                    >
                                        Belum ada data role
                                    </td>
                                </tr>
                            ) : (
                                roles.map((item: any, index: number) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {item.name}
                                            <div className="mt-1 text-xs font-normal text-slate-500">
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.access_all_branches ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                                                    <Shield size={12} /> Semua
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                                                    Terbatas
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                {item.code !== 'admin' && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function UserManager({
    type,
    users = [],
    roles = [],
}: {
    type: 'staff' | 'tenants';
    users: any[];
    roles: any[];
}) {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState<any>(null);

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
        email: '',
        password: '',
        roles: [] as number[], // still sent as array to backend, but we'll enforce single select in UI
    });

    const openEdit = (item: any) => {
        setIsEditing(item);
        setShowForm(true);
        setData({
            name: item.name,
            email: item.email,
            password: '', // blank when editing
            roles:
                item.roles && item.roles.length > 0
                    ? [item.roles[0].id]
                    : type === 'tenants'
                      ? [
                            roles.find((r: any) => r.code === 'tenant')?.id,
                        ].filter(Boolean)
                      : [],
        });
    };

    const closeEdit = () => {
        setIsEditing(null);
        setShowForm(false);
        reset();
    };

    const handleOpenCreate = () => {
        const tenantRole = roles.find((r: any) => r.code === 'tenant');
        setData({
            name: '',
            email: '',
            password: '',
            roles: type === 'tenants' && tenantRole ? [tenantRole.id] : [],
        });
        setShowForm(true);
        setIsEditing(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/master/users/${isEditing.id}`, {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
        } else {
            post('/admin/master/users', {
                preserveScroll: true,
                onSuccess: closeEdit,
            });
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus User?',
            text: 'Yakin ingin menghapus user ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(`/admin/master/users/${id}`, { preserveScroll: true });
            }
        });
    };

    const toggleRole = (roleId: number) => {
        // Single select: Replace the array with just this roleId
        setData('roles', [roleId]);
    };

    const handleResetPassword = (user: any) => {
        Swal.fire({
            title: `Reset Password ${user.name}`,
            input: 'password',
            inputLabel: 'Password Baru',
            inputPlaceholder: 'Masukkan minimal 8 karakter',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Reset',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#4f46e5',
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
                if (!password || password.length < 8) {
                    Swal.showValidationMessage('Password minimal 8 karakter');
                    return false;
                }
                return new Promise((resolve) => {
                    router.put(
                        `/admin/master/users/${user.id}/reset-password`,
                        { password },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                resolve(true);
                            },
                            onError: () => {
                                Swal.showValidationMessage(
                                    'Gagal mereset password',
                                );
                                resolve(false);
                            },
                        },
                    );
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Users className="text-indigo-600" size={24} />
                {type === 'staff'
                    ? 'Manajemen Staff & Admin'
                    : 'Manajemen Penghuni'}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div
                    className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-slate-50"
                    onClick={() => {
                        if (showForm && isEditing) closeEdit();
                        else if (!showForm) handleOpenCreate();
                        else setShowForm(false);
                    }}
                >
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {isEditing
                                ? type === 'staff'
                                    ? 'Edit Staff'
                                    : 'Edit Penghuni'
                                : type === 'staff'
                                  ? 'Tambah Staff Baru'
                                  : 'Tambah Penghuni Baru'}
                        </h3>
                        {!showForm && !isEditing && (
                            <p className="mt-1 text-sm text-slate-500">
                                Klik untuk{' '}
                                {type === 'staff'
                                    ? 'menambahkan staf baru'
                                    : 'menambahkan penghuni baru'}
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                                        Username / Email
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Contoh: budi@gmail.com"
                                    />
                                    {errors.email && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Password{' '}
                                    {isEditing && (
                                        <span className="font-normal text-slate-400">
                                            (Kosongkan jika tidak diubah)
                                        </span>
                                    )}
                                </label>
                                <input
                                    required={!isEditing}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.password && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {type === 'staff' && (
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                                        Role / Hak Akses (Pilih Satu){' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {roles
                                            .filter(
                                                (r: any) => r.code !== 'tenant',
                                            )
                                            .map((role: any) => (
                                                <label
                                                    key={role.id}
                                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-200 ${data.roles.includes(role.id) ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-400' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="role_selection"
                                                        className="sr-only"
                                                        checked={data.roles.includes(
                                                            role.id,
                                                        )}
                                                        onChange={() =>
                                                            setData('roles', [
                                                                role.id,
                                                            ])
                                                        }
                                                        required={
                                                            data.roles
                                                                .length === 0
                                                        }
                                                    />
                                                    <span className="text-sm font-semibold">
                                                        {role.name}
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                    {errors.roles && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {errors.roles}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
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
                                        ? 'Simpan'
                                        : type === 'staff'
                                          ? 'Tambah Staff'
                                          : 'Tambah Penghuni'}
                                </Btn>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Roles</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-8 text-center text-slate-400"
                                    >
                                        Belum ada data{' '}
                                        {type === 'staff'
                                            ? 'staff'
                                            : 'penghuni'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((item: any, index: number) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {item.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.roles &&
                                                    item.roles.map((r: any) => (
                                                        <span
                                                            key={r.id}
                                                            className="inline-flex items-center rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700"
                                                        >
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                {(!item.roles ||
                                                    item.roles.length ===
                                                        0) && (
                                                    <span className="text-xs text-slate-400 italic">
                                                        No role
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleResetPassword(
                                                            item,
                                                        )
                                                    }
                                                    title="Reset Password"
                                                    className="rounded-lg border border-transparent p-2 text-xs font-semibold text-slate-400 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    Reset PW
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                    title="Edit User"
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    title="Hapus User"
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
        </div>
    );
}
