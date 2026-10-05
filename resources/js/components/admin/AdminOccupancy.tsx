import React from 'react';
import { PieChart, Home, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminOccupancy({
    branches,
    units,
}: {
    branches: any[];
    units: any[];
}) {
    // Calculate global occupancy
    const totalUnits = units?.length || 0;
    const occupiedUnits =
        units?.filter((u) => u.status === 'Occupied').length || 0;
    const maintenanceUnits =
        units?.filter((u) => u.status === 'Maintenance').length || 0;
    const availableUnits =
        units?.filter((u) => u.status === 'Available').length || 0;

    const globalOccupancyRate =
        totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    // Group by branch
    const occupancyByBranch = branches?.map((branch) => {
        // Get all units for this branch
        const branchUnits =
            units?.filter((u) => u.room_type?.branch_id === branch.id) || [];
        const tUnits = branchUnits.length;
        const occUnits = branchUnits.filter(
            (u) => u.status === 'Occupied',
        ).length;
        const availUnits = branchUnits.filter(
            (u) => u.status === 'Available',
        ).length;
        const maintUnits = branchUnits.filter(
            (u) => u.status === 'Maintenance',
        ).length;
        const rate = tUnits > 0 ? Math.round((occUnits / tUnits) * 100) : 0;

        return {
            ...branch,
            stats: {
                total: tUnits,
                occupied: occUnits,
                available: availUnits,
                maintenance: maintUnits,
                rate,
            },
        };
    });

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            {/* Global Summary */}
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                        <PieChart size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl leading-tight font-bold text-slate-900">
                            Ringkasan Okupansi Global
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Pantau tingkat hunian dari seluruh cabang kost Anda.
                        </p>
                    </div>
                </div>

                <div className="flex w-full items-center gap-6 md:w-auto md:border-l md:border-slate-100 md:pl-6">
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-600">
                            {globalOccupancyRate}%
                        </div>
                        <div className="mt-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Total Okupansi
                        </div>
                    </div>
                    <div className="h-12 w-px bg-slate-100"></div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            <span className="text-slate-700">
                                Terisi:{' '}
                                <span className="font-bold">
                                    {occupiedUnits}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                            <span className="text-slate-700">
                                Kosong:{' '}
                                <span className="font-bold">
                                    {availableUnits}
                                </span>
                            </span>
                        </div>
                        {maintenanceUnits > 0 && (
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                                <span className="text-slate-700">
                                    Perbaikan:{' '}
                                    <span className="font-bold">
                                        {maintenanceUnits}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="px-1 pt-2 text-lg font-bold text-slate-900">
                Rincian Per Cabang
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {occupancyByBranch?.map((branch: any) => (
                    <div
                        key={branch.id}
                        className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                        <div
                            className={`absolute top-0 left-0 h-1 w-full ${branch.stats.rate >= 90 ? 'bg-green-500' : branch.stats.rate >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        ></div>

                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="line-clamp-1 leading-tight font-bold text-slate-900">
                                    {branch.name}
                                </h3>
                                <div className="mt-1 line-clamp-1 flex items-center gap-1 text-xs text-slate-500">
                                    <MapPin size={12} /> {branch.city}
                                </div>
                            </div>
                            <Badge
                                variant={
                                    branch.stats.rate >= 90
                                        ? 'success'
                                        : branch.stats.rate >= 50
                                          ? 'primary'
                                          : 'warning'
                                }
                                className="px-2 py-1 text-xs font-bold"
                            >
                                {branch.stats.rate}%
                            </Badge>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-2.5 rounded-l-full bg-blue-500"
                                    style={{
                                        width: `${(branch.stats.occupied / (branch.stats.total || 1)) * 100}%`,
                                    }}
                                ></div>
                                <div
                                    className="h-2.5 bg-amber-400"
                                    style={{
                                        width: `${(branch.stats.maintenance / (branch.stats.total || 1)) * 100}%`,
                                    }}
                                ></div>
                                {/* The rest is implicitly available (slate-100) */}
                            </div>

                            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                                <div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {branch.stats.occupied}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">
                                        Terisi
                                    </div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-emerald-600">
                                        {branch.stats.available}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">
                                        Kosong
                                    </div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-800">
                                        {branch.stats.total}
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">
                                        Total Unit
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {(!branches || branches.length === 0) && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-100 bg-white py-12 text-center text-slate-500">
                        <Home
                            size={40}
                            className="mx-auto mb-3 text-slate-300"
                        />
                        Belum ada data cabang.
                    </div>
                )}
            </div>
        </div>
    );
}
