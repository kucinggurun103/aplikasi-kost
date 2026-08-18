import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Wrench, CheckCircle2, AlertTriangle, AlertCircle, Search, Filter } from 'lucide-react';
import { SearchableSelect } from '@/components/cozqta/primitives';
import Swal from 'sweetalert2';
export default function AdminMaintenance({ units }: { units: any[] }) {
  const [selectedBranch, setSelectedBranch] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const branches = Array.from(new Set(units?.map(u => u.room_type?.branch?.name).filter(Boolean)));

  const filteredUnits = units?.filter(unit => {
    const matchBranch = selectedBranch === 'Semua' || unit.room_type?.branch?.name === selectedBranch;
    const matchStatus = selectedStatus === 'Semua' || unit.status === selectedStatus;
    return matchBranch && matchStatus;
  });

  const setMaintenance = async (unitId: number) => {
    const { value: notes } = await Swal.fire({
      title: 'Tandai Maintenance',
      text: 'Tulis catatan maintenance (misal: AC rusak):',
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Catatan tidak boleh kosong!';
        }
      }
    });

    if (notes) {
      router.post(`/admin/maintenance/${unitId}/status`, { status: 'Maintenance', notes }, {
        preserveScroll: true
      });
    }
  };

  const setFixed = async (unitId: number) => {
    const result = await Swal.fire({
      title: 'Selesai Diperbaiki?',
      text: 'Tandai kamar ini telah selesai diperbaiki dan siap dihuni?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Selesai',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      router.post(`/admin/maintenance/${unitId}/complete`, {}, {
        preserveScroll: true
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filter:</span>
        </div>
        <div className="w-full sm:w-48">
          <SearchableSelect 
            value={selectedBranch}
            onChange={val => setSelectedBranch(val)}
            options={[{label: 'Semua Cabang', value: 'Semua'}, ...branches.map((b: any) => ({ label: b, value: b }))]}
          />
        </div>
        <div className="w-full sm:w-48">
          <SearchableSelect 
            value={selectedStatus}
            onChange={val => setSelectedStatus(val)}
            options={[
              {label: 'Semua Status', value: 'Semua'},
              {label: 'Tersedia', value: 'Available'},
              {label: 'Terisi', value: 'Occupied'},
              {label: 'Maintenance', value: 'Maintenance'}
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Wrench size={20} className="text-indigo-600" /> Peta Kamar Keseluruhan
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredUnits?.length > 0 ? filteredUnits.map((unit: any) => {
            const isAvailable = unit.status === 'Available';
            const isMaintenance = unit.status === 'Maintenance';
            const isOccupied = unit.status === 'Occupied';

            let bgClass = "bg-slate-100 border-slate-200";
            let textClass = "text-slate-500";
            
            if (isAvailable) {
              bgClass = "bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md cursor-pointer";
              textClass = "text-green-700";
            } else if (isMaintenance) {
              bgClass = "bg-orange-50 border-orange-300 hover:border-orange-400 hover:shadow-md cursor-pointer";
              textClass = "text-orange-700";
            } else if (isOccupied) {
              bgClass = "bg-red-50 border-red-200 opacity-70";
              textClass = "text-red-700";
            }

            return (
              <div 
                key={unit.id}
                onClick={() => {
                  if (isAvailable) setMaintenance(unit.id);
                  if (isMaintenance) setFixed(unit.id);
                }}
                className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${bgClass} min-h-[140px]`}
              >
                {isAvailable && <CheckCircle2 size={20} className="mb-1 opacity-50" />}
                {isMaintenance && <AlertTriangle size={20} className="mb-1 text-orange-500" />}
                {isOccupied && <AlertCircle size={20} className="mb-1 opacity-50" />}

                <div className={`font-bold text-lg ${textClass}`}>{unit.unit_number}</div>
                <div className="text-[9px] font-medium text-slate-500 line-clamp-1 mt-0.5">
                  {unit.room_type?.type_name || '-'}
                </div>
                <div className="text-[9px] font-bold text-slate-600 line-clamp-1 mt-0.5 mb-1 bg-white/40 px-1 rounded">
                  {unit.room_type?.branch?.name || '-'}
                </div>
                
                <div className={`text-[9px] font-bold mt-1 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 ${textClass}`}>
                  {unit.status}
                </div>
                
                {isMaintenance && unit.notes && (
                  <div className="absolute inset-x-0 bottom-0 bg-orange-100 text-orange-800 text-[9px] p-1 truncate rounded-b-lg border-t border-orange-200" title={unit.notes}>
                    {unit.notes}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="col-span-full py-12 text-center text-slate-500">
              {units?.length === 0 ? 'Belum ada data unit kamar fisik.' : 'Tidak ada kamar yang sesuai dengan filter.'}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-slate-900 font-bold mr-2">Panduan Warna:</span>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Tersedia (Klik untuk Maintenance)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div> Terisi (Tidak bisa diubah)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div> Maintenance (Klik jika Selesai)</div>
        </div>
      </div>
    </div>
  );
}
