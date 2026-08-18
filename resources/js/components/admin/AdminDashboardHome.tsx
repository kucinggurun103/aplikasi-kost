import React, { Suspense, lazy } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Building2, BedDouble, Users, Package, DollarSign, Clock, Calendar, Download, Eye, Plus, FileText
} from 'lucide-react';
import {
  TRANSACTIONS, OCCUPANCY_DATA, TENANTS,
  fmtShort, fmt
} from '@/components/cozqta/data';
import { StatCard, StatusBadge, Btn, Avatar } from '@/components/cozqta/primitives';

// Lazy-load heavy recharts components — recharts is 309KB, only load when visible
const RevenueChart = lazy(() => import('./AdminCharts').then(m => ({ default: m.RevenueChart })));
const BookingChart = lazy(() => import('./AdminCharts').then(m => ({ default: m.BookingChart })));
const OccupancyChart = lazy(() => import('./AdminCharts').then(m => ({ default: m.OccupancyChart })));

const ChartSkeleton = () => (
  <div className="animate-pulse bg-slate-100 rounded-xl" style={{ height: 160 }} />
);

export default function AdminDashboardHome({ stats }: { stats: any }) {
  const transformedOccupancyData = OCCUPANCY_DATA.map((d: any, i: number) => ({
    name: d.city,
    value: d.occupancy,
    color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][i % 6]
  }));

  const as = (usePage().props as any).admin_stats || {
    total_properties: 0, total_rooms: 0, filled_rooms: 0, vacant_rooms: 0,
    revenue_this_month: 0, pending_payments: 0, bookings_today: 0, new_users: 0, recent_transactions: []
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Properti" value={as.total_properties.toString()} icon={Building2} color="indigo" />
        <StatCard label="Total Kamar" value={as.total_rooms.toString()} icon={BedDouble} color="purple" />
        <StatCard label="Kamar Terisi" value={as.filled_rooms.toString()} icon={Users} color="green" />
        <StatCard label="Kamar Kosong" value={as.vacant_rooms.toString()} icon={Package} color="amber" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pendapatan Bulan Ini" value={fmtShort(as.revenue_this_month)} icon={DollarSign} color="green" />
        <StatCard label="Pembayaran Pending" value={as.pending_payments.toString()} icon={Clock} color="amber" />
        <StatCard label="Booking Hari Ini" value={as.bookings_today.toString()} icon={Calendar} color="indigo" />
        <StatCard label="Pengguna Baru" value={as.new_users.toString()} icon={Users} color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Pendapatan Bulanan</h3>
              <p className="text-xs text-slate-400">Target vs Realisasi</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-0.5 bg-indigo-600 inline-block rounded" />Realisasi</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-0.5 bg-slate-300 inline-block rounded" />Target</div>
            </div>
          </div>
          <Suspense fallback={<div className="animate-pulse bg-slate-100 rounded-xl" style={{ height: 220 }} />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Tingkat Hunian</h3>
          <p className="text-xs text-slate-400 mb-2">Total 1.092 kamar</p>
          <Suspense fallback={<ChartSkeleton />}>
            <OccupancyChart data={transformedOccupancyData} />
          </Suspense>
          <div className="space-y-2 mt-2">
            {transformedOccupancyData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} /><span className="text-xs text-slate-600">{d.name}</span></div>
                <span className="text-xs font-semibold text-slate-900">{d.value} ({Math.round(d.value / 1092 * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Booking Mingguan</h3>
          <Btn variant="outline" size="sm"><Download size={13} /> Export</Btn>
        </div>
        <Suspense fallback={<ChartSkeleton />}>
          <BookingChart />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Transaksi Terkini</h3>
            <Btn variant="outline" size="sm" onClick={() => {}}><Eye size={13} /> Lihat Semua</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>{["ID Transaksi", "Penghuni", "Kamar", "Jumlah", "Metode", "Tanggal", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{t.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">{t.tenant}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{t.room}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">{fmtShort(t.amount)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{t.method}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Transaksi Terkini</h3>
            <button className="text-xs font-semibold text-indigo-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="pb-2 pr-4">ID Transaksi</th>
                  <th className="pb-2 pr-4">Penghuni</th>
                  <th className="pb-2 pr-4">Kamar</th>
                  <th className="pb-2 pr-4">Jumlah</th>
                  <th className="pb-2 pr-4">Metode</th>
                  <th className="pb-2 pr-4">Tanggal</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-50">
                {as.recent_transactions && as.recent_transactions.length > 0 ? (
                  as.recent_transactions.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-4 font-mono text-slate-500">{t.id}</td>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{t.tenant_name}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{t.room_name}</td>
                      <td className="py-2.5 pr-4 font-semibold text-slate-900">{fmt(t.amount)}</td>
                      <td className="py-2.5 pr-4 text-slate-500">{t.method}</td>
                      <td className="py-2.5 pr-4 text-slate-400 whitespace-nowrap">{t.date}</td>
                      <td className="py-2.5"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      Belum ada transaksi bulan ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Penghuni Terbaru</h3>
          <div className="space-y-3">
            {TENANTS.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <Avatar src={t.avatar} name={t.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.room} · s/d {t.until}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 mb-3">Aksi Cepat</h4>
            <div className="grid grid-cols-2 gap-2">
              {[{ icon: Plus, label: "Tambah Kamar", href: "/rooms/create" }, { icon: Users, label: "Tambah Penghuni" }, { icon: Download, label: "Export Data" }, { icon: FileText, label: "Buat Laporan" }].map(a => (
                <Link key={a.label} href={a.href || "#"} className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors">
                  <a.icon size={13} className="flex-shrink-0" /><span className="truncate">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
