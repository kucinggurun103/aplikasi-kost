import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Search, MessageSquare, Clock, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';
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
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const role = user?.role || (user?.roles?.includes('admin') ? 'admin' : (user?.roles?.includes('operator') ? 'operator' : 'tenant'));

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
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            
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
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Terjadi kesalahan');
            }
            
            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tiket berhasil dibuat!' });
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
            case 'Open': return 'bg-blue-100 text-blue-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700';
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (view === 'create') {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-900 text-lg">Buat Tiket Baru</h3>
                    <button onClick={() => setView('list')} className="text-sm text-slate-500 hover:text-slate-900">Batal</button>
                </div>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Kategori Kendala</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" value={category} onChange={e => setCategory(e.target.value)}>
                            <option>Perbaikan</option>
                            <option>Kebersihan</option>
                            <option>Keamanan</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Prioritas</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" value={priority} onChange={e => setPriority(e.target.value)}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Judul / Subjek</label>
                        <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subjek / Topik Tiket" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Deskripsi Detail</label>
                        <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi Masalah" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Lampiran Foto (Opsional)</label>
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 rounded-xl p-4 flex flex-col items-center justify-center flex-1 transition-colors text-slate-500">
                                <Upload size={20} className="mb-2" />
                                <span className="text-sm font-medium">Klik untuk unggah foto</span>
                                <input type="file" className="hidden" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
                            </label>
                            {photo && (
                                <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden relative shrink-0">
                                    <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setPhoto(null)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors">
                                        <XCircle size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition-colors">
                        Kirim Tiket Laporan
                    </button>
                </form>
            </div>
        );
    }

    if (view === 'detail' && selectedTicketId) {
        return <TicketDetail ticketId={selectedTicketId} onBack={() => setView('list')} user={user} />;
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 text-lg">Laporan & Bantuan</h3>
                {role === 'tenant' && (
                    <button onClick={() => setView('create')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <Plus size={16} /> Buat Tiket
                    </button>
                )}
            </div>
            
            {loading ? (
                <div className="p-12 text-center text-slate-500">Memuat data tiket...</div>
            ) : tickets.length === 0 ? (
                <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Tiket</h3>
                    <p className="text-slate-500 text-sm">Semua kendala sudah teratasi atau belum ada laporan yang masuk.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                                <th className="px-6 py-4 font-medium">ID Tiket</th>
                                {role !== 'tenant' && <th className="px-6 py-4 font-medium">Penghuni & Cabang</th>}
                                <th className="px-6 py-4 font-medium">Kategori & Subjek</th>
                                <th className="px-6 py-4 font-medium">Status & Prioritas</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{ticket.ticket_no}</td>
                                    {role !== 'tenant' && (
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{ticket.user?.name}</p>
                                            <p className="text-xs text-slate-500">{ticket.branch?.name}</p>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{ticket.subject}</p>
                                        <p className="text-xs text-slate-500">{ticket.category}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs text-slate-500">Prioritas: {ticket.priority}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => { setSelectedTicketId(ticket.id); setView('detail'); }}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
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

function TicketDetail({ ticketId, onBack, user }: { ticketId: number, onBack: () => void, user: any }) {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyPhoto, setReplyPhoto] = useState<File | null>(null);
    const role = user?.role || (user?.roles?.includes('admin') ? 'admin' : (user?.roles?.includes('operator') ? 'operator' : 'tenant'));

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
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            
            const formData = new FormData();
            formData.append('message', replyMessage);
            if (replyPhoto) {
                formData.append('photo', replyPhoto);
            }

            const res = await fetch(`/tickets/${ticketId}/reply`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            });
            if (!res.ok) throw new Error();
            setReplyMessage('');
            setReplyPhoto(null);
            fetchDetail();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mengirim balasan.' });
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch(`/tickets/${ticketId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error();
            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Status diperbarui!' });
            fetchDetail();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal memperbarui status.' });
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">Memuat detail tiket...</div>;
    if (!ticket) return null;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in flex flex-col h-[700px]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                        <XCircle size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">{ticket.subject}</h3>
                            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium">{ticket.ticket_no}</span>
                        </div>
                        <p className="text-sm text-slate-500">Oleh: {ticket.user?.name} &bull; {ticket.branch?.name}</p>
                    </div>
                </div>
                {role !== 'tenant' && (
                    <select 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none font-medium text-slate-700"
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {/* Initial Issue */}
                {(() => {
                    const isMe = String(ticket.user_id) === String(user.id);
                    return (
                        <div className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isMe ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {ticket.user?.name.charAt(0)}
                            </div>
                            <div className={isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}>
                                <div className={`border rounded-2xl p-4 shadow-sm ${isMe ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                                    {ticket.attachment && (
                                        <a href={`/storage/${ticket.attachment}`} target="_blank" rel="noreferrer" className="block mt-3 border border-white/20 rounded-xl overflow-hidden max-w-sm">
                                            <img src={`/storage/${ticket.attachment}`} alt="Attachment" className="w-full h-auto object-cover max-h-64" />
                                        </a>
                                    )}
                                </div>
                                <p className={`text-xs text-slate-400 mt-2 mx-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {!isMe && <span className="font-medium mr-1">{ticket.user?.name} &bull;</span>}
                                    {new Date(ticket.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    );
                })()}

                {/* Replies */}
                {ticket.replies.map((reply: any) => {
                    const isMe = String(reply.user_id) === String(user.id);
                    return (
                        <div key={reply.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isMe ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                {reply.user?.name.charAt(0)}
                            </div>
                            <div className={isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}>
                                <div className={`border rounded-2xl p-4 shadow-sm ${isMe ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                    {reply.attachment && (
                                        <a href={`/storage/${reply.attachment}`} target="_blank" rel="noreferrer" className="block mt-3 border border-white/20 rounded-xl overflow-hidden max-w-sm">
                                            <img src={`/storage/${reply.attachment}`} alt="Attachment" className="w-full h-auto object-cover max-h-64" />
                                        </a>
                                    )}
                                </div>
                                <p className={`text-xs text-slate-400 mt-2 mx-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {!isMe && <span className="font-medium mr-1">{reply.user?.name} &bull;</span>}
                                    {new Date(reply.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reply Form */}
            {ticket.status !== 'Closed' && (
                <div className="p-4 bg-white border-t border-slate-100">
                    {replyPhoto && (
                        <div className="mb-3 w-20 h-20 rounded-xl border border-slate-200 overflow-hidden relative">
                            <img src={URL.createObjectURL(replyPhoto)} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setReplyPhoto(null)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors">
                                <XCircle size={12} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleReply} className="flex gap-3 items-center">
                        <label className="cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0 bg-slate-50 border border-slate-200 rounded-xl w-12 h-12 flex items-center justify-center">
                            <ImageIcon size={20} />
                            <input type="file" className="hidden" accept="image/*" onChange={e => setReplyPhoto(e.target.files?.[0] || null)} />
                        </label>
                        <input 
                            type="text" 
                            required
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-12" 
                            placeholder="Isi Balasan"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 h-12 flex-shrink-0">
                            <MessageSquare size={16} /> Kirim
                        </button>
                    </form>
                </div>
            )}
            {ticket.status === 'Closed' && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
                    Tiket ini telah ditutup. Percakapan tidak dapat dilanjutkan.
                </div>
            )}
        </div>
    );
}
