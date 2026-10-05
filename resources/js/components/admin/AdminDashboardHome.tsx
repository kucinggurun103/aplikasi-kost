import React, { Suspense, lazy } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    BedDouble,
    Users,
    Package,
    DollarSign,
    Clock,
    Calendar,
    Download,
    Eye,
    Plus,
    FileText,
} from 'lucide-react';
import {
    TRANSACTIONS,
    OCCUPANCY_DATA,
    TENANTS,
    fmtShort,
    fmt,
} from '@/components/cozqta/data';
import {
    StatCard,
    StatusBadge,
    Btn,
    Avatar,
} from '@/components/cozqta/primitives';

// Lazy-load heavy recharts components — recharts is 309KB, only load when visible
const RevenueChart = lazy(() =>
    import('./AdminCharts').then((m) => ({ default: m.RevenueChart })),
);
const BookingChart = lazy(() =>
    import('./AdminCharts').then((m) => ({ default: m.BookingChart })),
);
const OccupancyChart = lazy(() =>
    import('./AdminCharts').then((m) => ({ default: m.OccupancyChart })),
);

const ChartSkeleton = () => (
    <div
        className="animate-pulse rounded-xl bg-slate-100"
        style={{ height: 160 }}
    />
);

export default function AdminDashboardHome({ stats }: { stats: any }) {
    const transformedOccupancyData = OCCUPANCY_DATA.map(
        (d: any, i: number) => ({
            name: d.city,
            value: d.occupancy,
            color: [
                '#4F46E5',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
                '#EC4899',
            ][i % 6],
        }),
    );

    const as = (usePage().props as any).admin_stats || {
        total_properties: 0,
        total_rooms: 0,
        filled_rooms: 0,
        vacant_rooms: 0,
        revenue_this_month: 0,
        pending_payments: 0,
        bookings_today: 0,
        new_users: 0,
        recent_transactions: [],
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Total Properti"
                    value={as.total_properties.toString()}
                    icon={Building2}
                    color="indigo"
                />
                <StatCard
                    label="Total Kamar"
                    value={as.total_rooms.toString()}
                    icon={BedDouble}
                    color="purple"
                />
                <StatCard
                    label="Kamar Terisi"
                    value={as.filled_rooms.toString()}
                    icon={Users}
                    color="green"
                />
                <StatCard
                    label="Kamar Kosong"
                    value={as.vacant_rooms.toString()}
                    icon={Package}
                    color="amber"
                />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Pendapatan Bulan Ini"
                    value={fmtShort(as.revenue_this_month)}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Pembayaran Pending"
                    value={as.pending_payments.toString()}
                    icon={Clock}
                    color="amber"
                />
                <StatCard
                    label="Booking Hari Ini"
                    value={as.bookings_today.toString()}
                    icon={Calendar}
                    color="indigo"
                />
                <StatCard
                    label="Pengguna Baru"
                    value={as.new_users.toString()}
                    icon={Users}
                    color="purple"
                />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Pendapatan Bulanan
                            </h3>
                            <p className="text-xs text-slate-400">
                                Target vs Realisasi
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="inline-block h-0.5 w-3 rounded bg-indigo-600" />
                                Realisasi
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="inline-block h-0.5 w-3 rounded bg-slate-300" />
                                Target
                            </div>
                        </div>
                    </div>
                    <Suspense
                        fallback={
                            <div
                                className="animate-pulse rounded-xl bg-slate-100"
                                style={{ height: 220 }}
                            />
                        }
                    >
                        <RevenueChart />
                    </Suspense>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-1 font-semibold text-slate-900">
                        Tingkat Hunian
                    </h3>
                    <p className="mb-2 text-xs text-slate-400">
                        Total 1.092 kamar
                    </p>
                    <Suspense fallback={<ChartSkeleton />}>
                        <OccupancyChart data={transformedOccupancyData} />
                    </Suspense>
                    <div className="mt-2 space-y-2">
                        {transformedOccupancyData.map((d) => (
                            <div
                                key={d.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                        style={{ background: d.color }}
                                    />
                                    <span className="text-xs text-slate-600">
                                        {d.name}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-slate-900">
                                    {d.value} (
                                    {Math.round((d.value / 1092) * 100)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                        Booking Mingguan
                    </h3>
                    <Btn variant="outline" size="sm">
                        <Download size={13} /> Export
                    </Btn>
                </div>
                <Suspense fallback={<ChartSkeleton />}>
                    <BookingChart />
                </Suspense>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                        <h3 className="font-semibold text-slate-900">
                            Transaksi Terkini
                        </h3>
                        <Btn variant="outline" size="sm" onClick={() => {}}>
                            <Eye size={13} /> Lihat Semua
                        </Btn>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    {[
                                        'No',
                                        'ID Transaksi',
                                        'Penghuni',
                                        'Kamar',
                                        'Jumlah',
                                        'Metode',
                                        'Tanggal',
                                        'Status',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap text-slate-500"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {TRANSACTIONS.map((t, index) => (
                                    <tr
                                        key={t.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 text-xs text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                            {t.id}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                                            {t.tenant}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">
                                            {t.room}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-slate-900">
                                            {fmtShort(t.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">
                                            {t.method}
                                        </td>
                                        <td className="px-4 py-3 text-xs whitespace-nowrap text-slate-400">
                                            {t.date}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={t.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
                            Transaksi Terkini
                        </h3>
                        <button className="text-xs font-semibold text-indigo-600 hover:underline">
                            Lihat Semua
                        </button>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    <th className="pr-4 pb-2">No</th>
                                    <th className="pr-4 pb-2">ID Transaksi</th>
                                    <th className="pr-4 pb-2">Penghuni</th>
                                    <th className="pr-4 pb-2">Kamar</th>
                                    <th className="pr-4 pb-2">Jumlah</th>
                                    <th className="pr-4 pb-2">Metode</th>
                                    <th className="pr-4 pb-2">Tanggal</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs">
                                {as.recent_transactions &&
                                as.recent_transactions.length > 0 ? (
                                    as.recent_transactions.map(
                                        (t: any, index: number) => (
                                            <tr
                                                key={t.id}
                                                className="transition-colors hover:bg-slate-50"
                                            >
                                                <td className="py-2.5 pr-4 text-slate-500">
                                                    {index + 1}
                                                </td>
                                                <td className="py-2.5 pr-4 font-mono text-slate-500">
                                                    {t.id}
                                                </td>
                                                <td className="py-2.5 pr-4 font-medium whitespace-nowrap text-slate-900">
                                                    {t.tenant_name}
                                                </td>
                                                <td className="py-2.5 pr-4 whitespace-nowrap text-slate-600">
                                                    {t.room_name}
                                                </td>
                                                <td className="py-2.5 pr-4 font-semibold text-slate-900">
                                                    {fmt(t.amount)}
                                                </td>
                                                <td className="py-2.5 pr-4 text-slate-500">
                                                    {t.method}
                                                </td>
                                                <td className="py-2.5 pr-4 whitespace-nowrap text-slate-400">
                                                    {t.date}
                                                </td>
                                                <td className="py-2.5">
                                                    <StatusBadge
                                                        status={t.status}
                                                    />
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            Belum ada transaksi bulan ini
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
