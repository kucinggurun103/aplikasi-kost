import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Plus,
    BellRing,
    Mail,
    MessageSquare,
    Trash2,
    Edit2,
    XCircle,
} from 'lucide-react';
import { Btn, Badge } from '@/components/cozqta/primitives';

const AVAILABLE_VARIABLES = [
    { code: 'name', label: 'Nama Pengguna' },
    { code: 'email', label: 'Email Pengguna' },
    { code: 'phone', label: 'No. HP' },
    { code: 'branch_name', label: 'Nama Cabang' },
    { code: 'room_name', label: 'Nama Kamar' },
    { code: 'invoice_number', label: 'Nomor Invoice' },
    { code: 'amount', label: 'Jumlah Tagihan' },
    { code: 'due_date', label: 'Jatuh Tempo' },
    { code: 'payment_link', label: 'Link Pembayaran' },
    { code: 'booking_id', label: 'ID Booking' },
];

export default function AdminNotificationTemplates({
    templates,
}: {
    templates: any[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [lastFocusedField, setLastFocusedField] = useState<
        'email_subject' | 'email_content' | 'whatsapp_content' | null
    >(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            code: '',
            email_enabled: false,
            whatsapp_enabled: false,
            email_subject: '',
            email_content: '',
            whatsapp_subject: '',
            whatsapp_content: '',
            is_active: true,
        });

    const openModal = (template: any = null) => {
        clearErrors();
        if (template) {
            setEditingId(template.id);
            setData({
                name: template.name,
                code: template.code,
                email_enabled: Boolean(template.email_enabled),
                whatsapp_enabled: Boolean(template.whatsapp_enabled),
                email_subject: template.email_subject || '',
                email_content: template.email_content || '',
                whatsapp_subject: template.whatsapp_subject || '',
                whatsapp_content: template.whatsapp_content || '',
                is_active: Boolean(template.is_active),
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
            put(`/admin/settings/notification-templates/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(`/admin/settings/notification-templates`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteTemplate = (id: number) => {
        if (confirm('Hapus template notifikasi ini?')) {
            router.delete(`/admin/settings/notification-templates/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const insertVariable = (
        field: 'email_subject' | 'email_content' | 'whatsapp_content' | null,
        variableCode: string,
    ) => {
        if (!field) {
            alert(
                'Klik pada input/textarea (Subjek atau Konten) terlebih dahulu, lalu klik variabel ini.',
            );
            return;
        }
        const el = document.getElementById(field) as
            HTMLTextAreaElement | HTMLInputElement;
        const variableToInsert = `{{${variableCode}}}`;

        if (el) {
            const startPos = el.selectionStart || 0;
            const endPos = el.selectionEnd || 0;
            const currentValue = data[field] || '';

            const newValue =
                currentValue.substring(0, startPos) +
                variableToInsert +
                currentValue.substring(endPos);

            setData(field, newValue);

            setTimeout(() => {
                el.focus();
                el.setSelectionRange(
                    startPos + variableToInsert.length,
                    startPos + variableToInsert.length,
                );
            }, 0);
        } else {
            setData(field, (data[field] || '') + variableToInsert);
        }
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Template Notifikasi
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Atur format pesan email dan WhatsApp yang dikirimkan ke
                        pengguna.
                    </p>
                </div>
                <Btn variant="primary" onClick={() => openModal()}>
                    <Plus size={16} className="mr-1.5" /> Tambah Template
                </Btn>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {templates?.map((template: any) => (
                    <div
                        key={template.id}
                        className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div
                            className={`absolute top-0 left-0 h-full w-1 ${template.is_active ? 'bg-indigo-500' : 'bg-slate-300'}`}
                        ></div>

                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-xl p-2.5 ${template.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    <BellRing size={20} />
                                </div>
                                <div>
                                    <h3 className="leading-tight font-bold text-slate-900">
                                        {template.name}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                                            {template.code}
                                        </span>
                                        <Badge
                                            variant={
                                                template.is_active
                                                    ? 'success'
                                                    : 'outline'
                                            }
                                            className="text-[10px]"
                                        >
                                            {template.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => openModal(template)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => deleteTemplate(template.id)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <Mail
                                    size={16}
                                    className={`mt-0.5 ${template.email_enabled ? 'text-indigo-600' : 'text-slate-300'}`}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-700">
                                            Email
                                        </span>
                                        <span
                                            className={`text-xs font-bold ${template.email_enabled ? 'text-green-600' : 'text-slate-400'}`}
                                        >
                                            {template.email_enabled
                                                ? 'ON'
                                                : 'OFF'}
                                        </span>
                                    </div>
                                    {template.email_enabled && (
                                        <p className="mt-1 line-clamp-1 border-t border-slate-200/50 pt-1 text-xs text-slate-500">
                                            {template.email_subject ||
                                                'Tidak ada subjek'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <MessageSquare
                                    size={16}
                                    className={`mt-0.5 ${template.whatsapp_enabled ? 'text-emerald-600' : 'text-slate-300'}`}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-slate-700">
                                            WhatsApp
                                        </span>
                                        <span
                                            className={`text-xs font-bold ${template.whatsapp_enabled ? 'text-green-600' : 'text-slate-400'}`}
                                        >
                                            {template.whatsapp_enabled
                                                ? 'ON'
                                                : 'OFF'}
                                        </span>
                                    </div>
                                    {template.whatsapp_enabled && (
                                        <p className="mt-1 line-clamp-1 border-t border-slate-200/50 pt-1 text-xs text-slate-500">
                                            {template.whatsapp_content ||
                                                'Tidak ada konten'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {(!templates || templates.length === 0) && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-100 bg-white py-12 text-center text-slate-500">
                        Belum ada template notifikasi yang dibuat.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? 'Edit Template'
                                    : 'Tambah Template Baru'}
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
                            className="space-y-5 overflow-y-auto p-5"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Nama Template
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Nama Template"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Kode Template (Unik)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Kode Unik"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.code && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Variabel Tersedia */}
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                                <p className="mb-2 text-xs font-semibold text-blue-800">
                                    Pilih variabel untuk disisipkan ke template:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_VARIABLES.map((v) => (
                                        <button
                                            key={v.code}
                                            type="button"
                                            className="rounded border border-blue-200 bg-white px-2 py-1 font-mono text-[10px] text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
                                            title={v.label}
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent losing focus from the textarea
                                                insertVariable(
                                                    lastFocusedField,
                                                    v.code,
                                                );
                                            }}
                                        >
                                            {'{' + '{' + v.code + '}' + '}'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email Section */}
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <Mail
                                            size={16}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">
                                            Template Email
                                        </span>
                                    </div>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <span className="text-xs text-slate-500">
                                            Aktifkan Email
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={data.email_enabled}
                                            onChange={(e) =>
                                                setData(
                                                    'email_enabled',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                                {data.email_enabled && (
                                    <div className="space-y-4 p-4">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                Subjek Email
                                            </label>
                                            <input
                                                id="email_subject"
                                                onFocus={() =>
                                                    setLastFocusedField(
                                                        'email_subject',
                                                    )
                                                }
                                                type="text"
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={data.email_subject}
                                                onChange={(e) =>
                                                    setData(
                                                        'email_subject',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                Isi Email (Mendukung variabel)
                                            </label>
                                            <textarea
                                                id="email_content"
                                                onFocus={() =>
                                                    setLastFocusedField(
                                                        'email_content',
                                                    )
                                                }
                                                rows={4}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={data.email_content}
                                                onChange={(e) =>
                                                    setData(
                                                        'email_content',
                                                        e.target.value,
                                                    )
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* WhatsApp Section */}
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare
                                            size={16}
                                            className="text-emerald-600"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">
                                            Template WhatsApp
                                        </span>
                                    </div>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <span className="text-xs text-slate-500">
                                            Aktifkan WhatsApp
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            checked={data.whatsapp_enabled}
                                            onChange={(e) =>
                                                setData(
                                                    'whatsapp_enabled',
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                                {data.whatsapp_enabled && (
                                    <div className="space-y-4 p-4">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                Isi Pesan WhatsApp
                                            </label>
                                            <textarea
                                                id="whatsapp_content"
                                                onFocus={() =>
                                                    setLastFocusedField(
                                                        'whatsapp_content',
                                                    )
                                                }
                                                rows={4}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                                value={data.whatsapp_content}
                                                onChange={(e) =>
                                                    setData(
                                                        'whatsapp_content',
                                                        e.target.value,
                                                    )
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active_template"
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_active_template"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Aktifkan template ini
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
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
                                    Simpan Template
                                </Btn>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
