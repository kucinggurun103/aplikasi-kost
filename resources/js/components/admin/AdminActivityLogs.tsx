import React from 'react';
import { Activity, Search, Shield, User, MapPin } from 'lucide-react';

export default function AdminActivityLogs({ logs }: { logs: any[] }) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Activity & Audit Logs</h2>
            <p className="text-sm text-slate-500 mt-0.5">Rekam jejak seluruh aktivitas krusial yang terjadi dalam sistem.</p>
          </div>
        </div>
        <div className="relative w-full max-w-xs hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Waktu</th>
                <th className="px-6 py-4 whitespace-nowrap">Pengguna (Aktor)</th>
                <th className="px-6 py-4 whitespace-nowrap">Aktivitas</th>
                <th className="px-6 py-4 whitespace-nowrap">Modul / Cabang</th>
                <th className="px-6 py-4 whitespace-nowrap">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.length > 0 ? logs.map((log: any, index: number) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {log.created_at ? new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {log.created_at ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User size={12} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{log.user?.name || 'System / Guest'}</div>
                        <div className="text-xs text-slate-500">{log.user?.email || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 capitalize flex items-center gap-1.5">
                      {log.action === 'create' ? (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      ) : log.action === 'update' ? (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      ) : log.action === 'delete' ? (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      )}
                      {log.action} {log.table_name && <span className="text-slate-500 font-normal">pada {log.table_name} (#{log.record_id})</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs w-fit uppercase tracking-wider">
                      {log.module || 'System'}
                    </div>
                    {log.branch && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin size={10} /> {log.branch.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-xs text-slate-600">{log.ip_address || '-'}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]" title={log.user_agent}>
                      {log.user_agent || '-'}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Shield size={40} className="mx-auto text-slate-300 mb-3" />
                    Belum ada log aktivitas yang terekam.
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
