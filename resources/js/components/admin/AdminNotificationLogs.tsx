import React from 'react';
import { Send, CheckCircle2, Clock, XCircle, Search, Bell } from 'lucide-react';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminNotificationLogs({ logs }: { logs: any[] }) {
    const safeDate = (dateVal: string | null | undefined) => {
        if (!dateVal) return { date: '-', time: '-' };
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return { date: '-', time: '-' };
        return {
            date: d.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
            }),
            time: d.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Send size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Antrean Notifikasi
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Pantau status pengiriman email dan pesan WhatsApp ke
                            pengguna.
                        </p>
                    </div>
                </div>
                <div className="relative hidden w-full max-w-xs md:block">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari nomor atau email penerima..."
                        className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 font-medium text-slate-600">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    No
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Waktu
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Pengguna
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Penerima
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Kanal
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Subjek / Judul
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs?.length > 0 ? (
                                logs.map((log: any, index: number) => (
                                    <tr
                                        key={log.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-slate-900">
                                                {
                                                    safeDate(
                                                        log.created_at ||
                                                            log.sent_at,
                                                    ).date
                                                }
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {
                                                    safeDate(
                                                        log.created_at ||
                                                            log.sent_at,
                                                    ).time
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-slate-800">
                                                {log.user?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-xs text-slate-600">
                                                {log.recipient}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={
                                                    log.channel === 'email'
                                                        ? 'primary'
                                                        : 'success'
                                                }
                                                className="uppercase"
                                            >
                                                {log.channel}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="line-clamp-1 max-w-xs font-medium text-slate-800"
                                                title={log.subject}
                                            >
                                                {log.subject ||
                                                    (log.template
                                                        ? log.template.name
                                                        : '-')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.status === 'sent' ||
                                            log.status === 'success' ? (
                                                <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                                                    <CheckCircle2 size={14} />{' '}
                                                    Terkirim
                                                </span>
                                            ) : log.status === 'pending' ||
                                              log.status === 'queued' ? (
                                                <span className="flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                                                    <Clock size={14} /> Antre
                                                </span>
                                            ) : (
                                                <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                                                    <XCircle size={14} /> Gagal
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Bell
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
                                        Belum ada log pengiriman notifikasi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
