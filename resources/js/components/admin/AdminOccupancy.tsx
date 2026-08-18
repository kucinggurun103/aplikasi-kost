import React from 'react';
import { PieChart, Home, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/cozqta/primitives';

export default function AdminOccupancy({ branches, units }: { branches: any[], units: any[] }) {
  
  // Calculate global occupancy
  const totalUnits = units?.length || 0;
  const occupiedUnits = units?.filter(u => u.status === 'Occupied').length || 0;
  const maintenanceUnits = units?.filter(u => u.status === 'Maintenance').length || 0;
  const availableUnits = units?.filter(u => u.status === 'Available').length || 0;
  
  const globalOccupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Group by branch
  const occupancyByBranch = branches?.map(branch => {
    // Get all units for this branch
    const branchUnits = units?.filter(u => u.room_type?.branch_id === branch.id) || [];
    const tUnits = branchUnits.length;
    const occUnits = branchUnits.filter(u => u.status === 'Occupied').length;
    const availUnits = branchUnits.filter(u => u.status === 'Available').length;
    const maintUnits = branchUnits.filter(u => u.status === 'Maintenance').length;
    const rate = tUnits > 0 ? Math.round((occUnits / tUnits) * 100) : 0;
    
    return {
      ...branch,
      stats: { total: tUnits, occupied: occUnits, available: availUnits, maintenance: maintUnits, rate }
    };
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Global Summary */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-6 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <PieChart size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Ringkasan Okupansi Global</h2>
            <p className="text-sm text-slate-500 mt-1">Pantau tingkat hunian dari seluruh cabang kost Anda.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6 w-full md:w-auto">
          <div className="text-center">
            <div className="text-3xl font-black text-indigo-600">{globalOccupancyRate}%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Okupansi</div>
          </div>
          <div className="h-12 w-px bg-slate-100"></div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-700">Terisi: <span className="font-bold">{occupiedUnits}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">Kosong: <span className="font-bold">{availableUnits}</span></span>
            </div>
            {maintenanceUnits > 0 && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-700">Perbaikan: <span className="font-bold">{maintenanceUnits}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 pt-2 px-1">Rincian Per Cabang</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {occupancyByBranch?.map((branch: any) => (
          <div key={branch.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 ${branch.stats.rate >= 90 ? 'bg-green-500' : branch.stats.rate >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 leading-tight line-clamp-1">{branch.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 line-clamp-1">
                  <MapPin size={12} /> {branch.city}
                </div>
              </div>
              <Badge variant={branch.stats.rate >= 90 ? 'success' : branch.stats.rate >= 50 ? 'primary' : 'warning'} className="text-xs font-bold px-2 py-1">
                {branch.stats.rate}%
              </Badge>
            </div>

            <div className="mt-auto">
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden flex">
                <div className="bg-blue-500 h-2.5 rounded-l-full" style={{ width: `${(branch.stats.occupied / (branch.stats.total || 1)) * 100}%` }}></div>
                <div className="bg-amber-400 h-2.5" style={{ width: `${(branch.stats.maintenance / (branch.stats.total || 1)) * 100}%` }}></div>
                {/* The rest is implicitly available (slate-100) */}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                <div>
                  <div className="text-lg font-bold text-blue-600">{branch.stats.occupied}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Terisi</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">{branch.stats.available}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Kosong</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800">{branch.stats.total}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Total Unit</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {(!branches || branches.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-100 border-dashed rounded-2xl">
            <Home size={40} className="mx-auto text-slate-300 mb-3" />
            Belum ada data cabang.
          </div>
        )}
      </div>
    </div>
  );
}
