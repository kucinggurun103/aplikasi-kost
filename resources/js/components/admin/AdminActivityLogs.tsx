import React from 'react';
import { Activity, Search, Shield, User, MapPin } from 'lucide-react';

export default function AdminActivityLogs({ logs }: { logs: any[] }) {
    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Activity & Audit Logs
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Rekam jejak seluruh aktivitas krusial yang terjadi
                            dalam sistem.
                        </p>
                    </div>
                </div>
                <div className="relative hidden w-full max-w-xs md:block">
                    <Search
                        size={14}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Cari..."
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
                                    Pengguna (Aktor)
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Aktivitas
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Modul / Cabang
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    IP Address
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
                                                {log.created_at
                                                    ? new Date(
                                                          log.created_at,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: '2-digit',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '-'}
                                            </div>
                                            <div className="mt-0.5 text-xs text-slate-500">
                                                {log.created_at
                                                    ? new Date(
                                                          log.created_at,
                                                      ).toLocaleTimeString(
                                                          'id-ID',
                                                          {
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          },
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                                                    <User size={12} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">
                                                        {log.user?.name ||
                                                            'System / Guest'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {log.user?.email || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 font-medium text-slate-900 capitalize">
                                                {log.action === 'create' ? (
                                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                ) : log.action === 'update' ? (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                ) : log.action === 'delete' ? (
                                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                ) : (
                                                    <span className="h-2 w-2 rounded-full bg-slate-500"></span>
                                                )}
                                                {log.action}{' '}
                                                {log.table_name && (
                                                    <span className="font-normal text-slate-500">
                                                        pada {log.table_name} (#
                                                        {log.record_id})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-fit rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                                                {log.module || 'System'}
                                            </div>
                                            {log.branch && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin size={10} />{' '}
                                                    {log.branch.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-mono text-xs text-slate-600">
                                                {log.ip_address || '-'}
                                            </div>
                                            <div
                                                className="max-w-[120px] truncate text-[10px] text-slate-400"
                                                title={log.user_agent}
                                            >
                                                {log.user_agent || '-'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Shield
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
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
