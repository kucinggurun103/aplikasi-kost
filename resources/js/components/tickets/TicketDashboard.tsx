import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Plus,
    Search,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    Upload,
    Image as ImageIcon,
} from 'lucide-react';
import Swal from 'sweetalert2';

interface Ticket {
    id: number;
    ticket_no: string;
    category: string;
    subject: string;
    priority: string;
    status: string;
    created_at: string;
    attachment?: string | null;
    branch?: { name: string };
    user?: { name: string };
}

export default function TicketDashboard({ user }: { user: any }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
        null,
    );
    const role =
        user?.role ||
        (user?.roles?.includes('admin')
            ? 'admin'
            : user?.roles?.includes('operator')
              ? 'operator'
              : 'tenant');

    // Form states
    const [category, setCategory] = useState('Perbaikan');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [photo, setPhoto] = useState<File | null>(null);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/tickets');
            const data = await res.json();
            setTickets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchTickets();
        }
    }, [view]);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';

            const formData = new FormData();
            formData.append('category', category);
            formData.append('subject', subject);
            formData.append('description', description);
            formData.append('priority', priority);
            if (photo) {
                formData.append('photo', photo);
            }

            const res = await fetch('/tickets', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Terjadi kesalahan');
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Tiket berhasil dibuat!',
            });
            setView('list');
            setSubject('');
            setDescription('');
            setPhoto(null);
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: error.message });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100 text-blue-700';
            case 'In Progress':
                return 'bg-amber-100 text-amber-700';
            case 'Resolved':
                return 'bg-green-100 text-green-700';
            case 'Closed':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    if (view === 'create') {
        return (
            <div className="animate-fade-in rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Buat Tiket Baru
                    </h3>
                    <button
                        onClick={() => setView('list')}
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        Batal
                    </button>
                </div>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Kategori Kendala
                        </label>
                        <select
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Perbaikan</option>
                            <option>Kebersihan</option>
                            <option>Keamanan</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Prioritas
                        </label>
                        <select
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Judul / Subjek
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subjek / Topik Tiket"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Deskripsi Detail
                        </label>
                        <textarea
                            required
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi Masalah"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Lampiran Foto (Opsional)
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-slate-500 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50">
                                <Upload size={20} className="mb-2" />
                                <span className="text-sm font-medium">
                                    Klik untuk unggah foto
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPhoto(e.target.files?.[0] || null)
                                    }
                                />
                            </label>
                            {photo && (
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200">
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPhoto(null)}
                                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow transition-colors hover:bg-red-600"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        Kirim Tiket Laporan
                    </button>
                </form>
            </div>
        );
    }

    if (view === 'detail' && selectedTicketId) {
        return (
            <TicketDetail
                ticketId={selectedTicketId}
                onBack={() => setView('list')}
                user={user}
            />
        );
    }

    return (
        <div className="animate-fade-in overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                    Laporan & Bantuan
                </h3>
                {role === 'tenant' && (
                    <button
                        onClick={() => setView('create')}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        <Plus size={16} /> Buat Tiket
                    </button>
                )}
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500">
                    Memuat data tiket...
                </div>
            ) : tickets.length === 0 ? (
                <div className="p-12 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                        Belum Ada Tiket
                    </h3>
                    <p className="text-sm text-slate-500">
                        Semua kendala sudah teratasi atau belum ada laporan yang
                        masuk.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-sm text-slate-500">
                                <th className="px-6 py-4 font-medium">
                                    ID Tiket
                                </th>
                                {role !== 'tenant' && (
                                    <th className="px-6 py-4 font-medium">
                                        Penghuni & Cabang
                                    </th>
                                )}
                                <th className="px-6 py-4 font-medium">
                                    Kategori & Subjek
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Status & Prioritas
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {ticket.ticket_no}
                                    </td>
                                    {role !== 'tenant' && (
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">
                                                {ticket.user?.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {ticket.branch?.name}
                                            </p>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">
                                            {ticket.subject}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {ticket.category}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <span
                                                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                                            >
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Prioritas: {ticket.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(
                                            ticket.created_at,
                                        ).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedTicketId(ticket.id);
                                                setView('detail');
                                            }}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            Lihat Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function TicketDetail({
    ticketId,
    onBack,
    user,
}: {
    ticketId: number;
    onBack: () => void;
    user: any;
}) {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyPhoto, setReplyPhoto] = useState<File | null>(null);
    const role =
        user?.role ||
        (user?.roles?.includes('admin')
            ? 'admin'
            : user?.roles?.includes('operator')
              ? 'operator'
              : 'tenant');

    const fetchDetail = async () => {
        try {
            const res = await fetch(`/tickets/${ticketId}`);
            const data = await res.json();
            setTicket(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [ticketId]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';

            const formData = new FormData();
            formData.append('message', replyMessage);
            if (replyPhoto) {
                formData.append('photo', replyPhoto);
            }

            const res = await fetch(`/tickets/${ticketId}/reply`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: formData,
            });
            if (!res.ok) throw new Error();
            setReplyMessage('');
            setReplyPhoto(null);
            fetchDetail();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal mengirim balasan.',
            });
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
            const res = await fetch(`/tickets/${ticketId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Status diperbarui!',
            });
            fetchDetail();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal memperbarui status.',
            });
        }
    };

    if (loading)
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-500">
                Memuat detail tiket...
            </div>
        );
    if (!ticket) return null;

    return (
        <div className="animate-fade-in flex h-[700px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <XCircle size={20} />
                    </button>
                    <div>
                        <div className="mb-1 flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                                {ticket.subject}
                            </h3>
                            <span className="rounded-lg bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                {ticket.ticket_no}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Oleh: {ticket.user?.name} &bull;{' '}
                            {ticket.branch?.name}
                        </p>
                    </div>
                </div>
                {role !== 'tenant' && (
                    <select
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none"
                        value={ticket.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                )}
            </div>

            {/* Chat History */}
            <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/30 p-6">
                {/* Initial Issue */}
                {(() => {
                    const isMe = String(ticket.user_id) === String(user.id);
                    return (
                        <div
                            className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${isMe ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}
                            >
                                {ticket.user?.name.charAt(0)}
                            </div>
                            <div
                                className={
                                    isMe
                                        ? 'flex flex-col items-end'
                                        : 'flex flex-col items-start'
                                }
                            >
                                <div
                                    className={`rounded-2xl border p-4 shadow-sm ${isMe ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                    {ticket.attachment && (
                                        <a
                                            href={`/storage/${ticket.attachment}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 block max-w-sm overflow-hidden rounded-xl border border-white/20"
                                        >
                                            <img
                                                src={`/storage/${ticket.attachment}`}
                                                alt="Attachment"
                                                className="h-auto max-h-64 w-full object-cover"
                                            />
                                        </a>
                                    )}
                                </div>
                                <p
                                    className={`mx-1 mt-2 text-xs text-slate-400 ${isMe ? 'text-right' : 'text-left'}`}
                                >
                                    {!isMe && (
                                        <span className="mr-1 font-medium">
                                            {ticket.user?.name} &bull;
                                        </span>
                                    )}
                                    {new Date(ticket.created_at).toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })()}

                {/* Replies */}
                {ticket.replies.map((reply: any) => {
                    const isMe = String(reply.user_id) === String(user.id);
                    return (
                        <div
                            key={reply.id}
                            className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${isMe ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                            >
                                {reply.user?.name.charAt(0)}
                            </div>
                            <div
                                className={
                                    isMe
                                        ? 'flex flex-col items-end'
                                        : 'flex flex-col items-start'
                                }
                            >
                                <div
                                    className={`rounded-2xl border p-4 shadow-sm ${isMe ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">
                                        {reply.message}
                                    </p>
                                    {reply.attachment && (
                                        <a
                                            href={`/storage/${reply.attachment}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 block max-w-sm overflow-hidden rounded-xl border border-white/20"
                                        >
                                            <img
                                                src={`/storage/${reply.attachment}`}
                                                alt="Attachment"
                                                className="h-auto max-h-64 w-full object-cover"
                                            />
                                        </a>
                                    )}
                                </div>
                                <p
                                    className={`mx-1 mt-2 text-xs text-slate-400 ${isMe ? 'text-right' : 'text-left'}`}
                                >
                                    {!isMe && (
                                        <span className="mr-1 font-medium">
                                            {reply.user?.name} &bull;
                                        </span>
                                    )}
                                    {new Date(reply.created_at).toLocaleString(
                                        'id-ID',
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reply Form */}
            {ticket.status !== 'Closed' && (
                <div className="border-t border-slate-100 bg-white p-4">
                    {replyPhoto && (
                        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-xl border border-slate-200">
                            <img
                                src={URL.createObjectURL(replyPhoto)}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setReplyPhoto(null)}
                                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow transition-colors hover:bg-red-600"
                            >
                                <XCircle size={12} />
                            </button>
                        </div>
                    )}
                    <form
                        onSubmit={handleReply}
                        className="flex items-center gap-3"
                    >
                        <label className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:text-indigo-600">
                            <ImageIcon size={20} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    setReplyPhoto(e.target.files?.[0] || null)
                                }
                            />
                        </label>
                        <input
                            type="text"
                            required
                            className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Isi Balasan"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                            <MessageSquare size={16} /> Kirim
                        </button>
                    </form>
                </div>
            )}
            {ticket.status === 'Closed' && (
                <div className="border-t border-slate-100 bg-slate-50 p-4 text-center text-sm font-medium text-slate-500">
                    Tiket ini telah ditutup. Percakapan tidak dapat dilanjutkan.
                </div>
            )}
        </div>
    );
}
