import React from 'react';
import { Send, CheckCircle2, Clock, XCircle, Search, Bell } from 'lucide-react';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminNotificationLogs({ logs }: { logs: any[] }) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Send size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Antrean Notifikasi</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pantau status pengiriman email dan pesan WhatsApp ke pengguna.</p>
          </div>
        </div>
        <div className="relative w-full max-w-xs hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari nomor atau email penerima..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Waktu</th>
                <th className="px-6 py-4 whitespace-nowrap">Pengguna</th>
                <th className="px-6 py-4 whitespace-nowrap">Penerima</th>
                <th className="px-6 py-4 whitespace-nowrap">Kanal</th>
                <th className="px-6 py-4 whitespace-nowrap">Subjek / Judul</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.length > 0 ? logs.map((log: any, index: number) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {new Date(log.created_at || log.sent_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(log.created_at || log.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{log.user?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-slate-600 text-xs">{log.recipient}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={log.channel === 'email' ? 'primary' : 'success'} className="uppercase">
                      {log.channel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium line-clamp-1 max-w-xs" title={log.subject}>
                      {log.subject || (log.template ? log.template.name : '-')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'sent' || log.status === 'success' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 size={14} /> Terkirim
                      </span>
                    ) : log.status === 'pending' || log.status === 'queued' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                        <Clock size={14} /> Antre
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full w-fit">
                        <XCircle size={14} /> Gagal
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Bell size={40} className="mx-auto text-slate-300 mb-3" />
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
