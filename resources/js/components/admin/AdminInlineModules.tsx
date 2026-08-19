import React, { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import {
  Building2, Star, CheckCircle2, AlertCircle, Clock,
  BedDouble, Users, Package, DollarSign, Receipt, FileText, Globe, Plus,
  ChevronLeft, ChevronRight, Download, Sparkles, Shield, Search, Filter, List, Grid, Eye, Edit, Trash2, Check,
  Folder, Wrench, HelpCircle, AlertTriangle, ChevronDown, Mail, Percent,
  RefreshCw, MapPin, Calendar, Bell, X, MessageSquare, BarChart2,
  Instagram, Facebook, Youtube, Twitter, Linkedin, Share2
} from 'lucide-react';
import {
  ROOMS, TRANSACTIONS, TENANTS,
  fmtShort, fmtIDR, fmt
} from '@/components/cozqta/data';
import { StatCard, StatusBadge, Badge, Btn, Avatar, SearchableSelect } from '@/components/cozqta/primitives';

const showAlert = async (opts: any) => {
  const { default: Swal } = await import('sweetalert2');
  return Swal.fire(opts);
};

export function AdminRooms({ roomView, setRoomView }: { roomView: "grid" | "list"; setRoomView: (v: "grid" | "list") => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const filtered = ROOMS.filter(r =>
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "Semua" || r.status === statusFilter)
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kamar..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="w-40">
          <SearchableSelect 
            value={statusFilter}
            onChange={val => setStatusFilter(val)}
            options={["Semua", "Tersedia", "Terisi", "Maintenance"].map(s => ({label: s, value: s}))}
          />
        </div>
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setRoomView("list")} className={`p-2 ${roomView === "list" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-500"}`}><List size={16} /></button>
          <button onClick={() => setRoomView("grid")} className={`p-2 ${roomView === "grid" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-500"}`}><Grid size={16} /></button>
        </div>
        <Btn variant="primary" size="sm" href="/rooms/create"><Plus size={14} /> Tambah Kamar</Btn>
      </div>
      {roomView === "list" ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>{["Kamar", "Gedung", "Lantai", "Harga", "Tipe", "Fasilitas", "Status", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={r.image} alt={r.name} className="w-10 h-8 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                      <p className="text-sm font-medium text-slate-900 line-clamp-1 max-w-32">{r.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.building}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">Lt. {r.floor}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{fmtShort(r.price)}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{r.type}</Badge></td>
                  <td className="px-4 py-3"><div className="flex gap-1">{r.facilities.slice(0, 2).map(f => <Badge key={f} variant="default">{f}</Badge>)}{r.facilities.length > 2 && <Badge variant="outline">+{r.facilities.length - 2}</Badge>}</div></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/rooms/${r.id}`} className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={13} /></Link>
                      <button className="w-7 h-7 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors"><Edit size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>{["Kamar", "Gedung", "Lantai", "Harga", "Tipe", "Fasilitas", "Status", "Aksi"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={r.image} alt={r.name} className="w-10 h-8 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <p className="text-sm font-medium text-slate-900 line-clamp-1 max-w-32">{r.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.building}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Lt. {r.floor}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{fmtShort(r.price)}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{r.type}</Badge></td>
                    <td className="px-4 py-3"><div className="flex gap-1">{r.facilities.slice(0, 2).map(f => <Badge key={f} variant="default">{f}</Badge>)}{r.facilities.length > 2 && <Badge variant="outline">+{r.facilities.length - 2}</Badge>}</div></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/rooms/${r.id}`} className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={13} /></Link>
                        <button className="w-7 h-7 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors"><Edit size={13} /></button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">Menampilkan {filtered.length} dari {ROOMS.length} kamar</p>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={r.image} alt={r.name} className="w-full h-36 object-cover bg-slate-100" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"><Edit size={12} className="text-slate-600" /></button>
                  <button className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"><Trash2 size={12} className="text-red-500" /></button>
                </div>
                <div className="absolute bottom-2 left-2"><StatusBadge status={r.status} /></div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-900 text-sm line-clamp-1 mb-0.5">{r.name}</p>
                <p className="text-xs text-slate-400 mb-2">{r.building} · Lt. {r.floor} · {r.size}m²</p>
                <div className="flex items-center justify-between">
                  <p className="text-indigo-600 font-bold">{fmtShort(r.price)}<span className="text-slate-400 font-normal text-xs">/bln</span></p>
                  <Badge variant="outline">{r.type}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminTenants() {
  const [search, setSearch] = useState("");
  const extTenants = [...TENANTS, ...TENANTS.map((t, i) => ({ ...t, id: t.id + 10, name: ["Rina Kusuma", "Deni Pratama", "Maya Sari", "Eko Nugroho"][i], room: ROOMS[i + 2]?.name.split(" ").slice(0, 3).join(" ") || t.room }))];
  const filtered = extTenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari penghuni..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="outline" size="sm"><Filter size={13} /> Filter</Btn>
        <Btn variant="primary" size="sm"><Plus size={14} /> Tambah Penghuni</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>{["Penghuni", "Kamar", "Mulai Sewa", "Selesai", "Status", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={t.avatar} name={t.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">Penghuni #{t.id.toString().padStart(4, "0")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.room}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.since}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.until}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={13} /></button>
                    <button className="w-7 h-7 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors"><Edit size={13} /></button>
                    <button className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><MessageSquare size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Menampilkan {filtered.length} penghuni</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPayments() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pemasukan" value="Rp 193jt" icon={DollarSign} color="green" change="+11%" />
        <StatCard label="Pending" value="23" icon={Clock} color="amber" />
        <StatCard label="Refund Bulan Ini" value="Rp 2,4jt" icon={RefreshCw} color="red" />
        <StatCard label="Rata-rata Transaksi" value="Rp 2,1jt" icon={BarChart2} color="indigo" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari transaksi..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="w-40">
          <SearchableSelect 
            value="Semua Status"
            onChange={() => {}}
            options={["Semua Status", "Lunas", "Pending", "Gagal"].map(s => ({label: s, value: s}))}
          />
        </div>
        <Btn variant="outline" size="sm"><Download size={13} /> Export PDF</Btn>
        <Btn variant="outline" size="sm"><Download size={13} /> Excel</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>{["ID", "Penghuni", "Kamar", "Jumlah", "Metode", "Tanggal", "Status", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRANSACTIONS.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{t.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.tenant}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.room}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{fmt(t.amount)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{t.method}</td>
                <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={13} /></button>
                    <button className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors"><Download size={13} /></button>
                    {t.status === "Pending" && <button className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors"><Check size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}



export function AdminProperties() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari properti..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="primary" size="sm" href="/rooms/create"><Plus size={14} /> Tambah Properti</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROOMS.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={r.image} alt={r.name} className="w-full h-40 object-cover bg-slate-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-white font-semibold text-sm line-clamp-1">{r.name}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1"><MapPin size={10} />{r.address.split(",")[1]?.trim()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div><p className="text-lg font-bold text-slate-900">{r.floor * 4}</p><p className="text-xs text-slate-400">Kamar</p></div>
                <div><p className="text-lg font-bold text-slate-900">{Math.floor(r.floor * 3.2)}</p><p className="text-xs text-slate-400">Terisi</p></div>
                <div><p className="text-lg font-bold text-indigo-600">{fmtShort(r.price * r.floor * 3)}</p><p className="text-xs text-slate-400">Pendapatan</p></div>
              </div>
              <div className="flex gap-2">
                <Btn variant="outline" size="sm" href={`/rooms/${r.id}`} className="flex-1 justify-center"><Eye size={13} /> Detail</Btn>
                <Btn variant="secondary" size="sm" className="flex-1 justify-center"><Edit size={13} /> Edit</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminWebSettings({ settings }: { settings: any }) {
  const [showForm, setShowForm] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    site_name: settings?.site_name || 'CozQta',
    site_description: settings?.site_description || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    whatsapp: settings?.whatsapp || '',
    address: settings?.address || '',
    smtp_username: settings?.smtp_username || '',
    smtp_password: settings?.smtp_password || '',
    whatsapp_api_key: settings?.whatsapp_api_key || '',
    whatsapp_api_url: settings?.whatsapp_api_url || '',
    admin_fee: settings?.admin_fee || 25000,
    site_logo: null as File | null,
    favicon: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/web', {
      preserveScroll: true,
      preserveState: true,
      forceFormData: true,
      onError: (errs) => {
        const firstErrorKey = Object.keys(errs)[0];
        if (firstErrorKey) {
            showAlert({
                icon: 'error',
                title: 'Validasi Gagal',
                text: 'Harap periksa kembali isian form Anda, terutama pada bagian atas (seperti Nama Situs).'
            });
        }
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Identitas Website</h2>
            <p className="text-sm text-slate-500 mt-1">Ubah identitas dan konfigurasi website Anda</p>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Situs</label>
                  <input type="text" value={data.site_name} onChange={e => setData('site_name', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                  {errors.site_name && <p className="text-red-500 text-xs mt-1">{errors.site_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Kontak</label>
                  <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telepon</label>
                  <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input type="text" value={data.whatsapp} onChange={e => setData('whatsapp', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium">Rp</span>
                    </div>
                    <input 
                      type="text" 
                      value={data.admin_fee || data.admin_fee === 0 ? data.admin_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setData('admin_fee', val ? parseInt(val, 10) : 0);
                      }} 
                      className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Situs</label>
                <textarea value={data.site_description} onChange={e => setData('site_description', e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Logo Utama (Kosongkan jika tidak diubah)</label>
                  <input type="file" onChange={e => setData('site_logo', e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {settings?.site_logo && <p className="text-xs text-slate-400 mt-2">Saat ini: {settings.site_logo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Favicon (Kosongkan jika tidak diubah)</label>
                  <input type="file" onChange={e => setData('favicon', e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {settings?.favicon && <p className="text-xs text-slate-400 mt-2">Saat ini: {settings.favicon}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Pengaturan API Notifikasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2"><Mail size={14} className="text-indigo-600" /> Gmail SMTP / App Password</h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Username SMTP</label>
                      <input type="email" value={data.smtp_username} onChange={e => setData('smtp_username', e.target.value)} placeholder="SMTP Username" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                      {errors.smtp_username && <p className="text-red-500 text-xs mt-1">{errors.smtp_username}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">App Password (Sandi Aplikasi)</label>
                      <input type="password" value={data.smtp_password} onChange={e => setData('smtp_password', e.target.value)} placeholder="SMTP Password" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                      {errors.smtp_password && <p className="text-red-500 text-xs mt-1">{errors.smtp_password}</p>}
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2"><MessageSquare size={14} className="text-emerald-600" /> WhatsApp API</h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp API URL</label>
                      <input type="url" value={data.whatsapp_api_url} onChange={e => setData('whatsapp_api_url', e.target.value)} placeholder="WhatsApp API URL" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                      {errors.whatsapp_api_url && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_api_url}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">API Key / Token</label>
                      <input type="password" value={data.whatsapp_api_key} onChange={e => setData('whatsapp_api_key', e.target.value)} placeholder="WhatsApp API Key" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                      {errors.whatsapp_api_key && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_api_key}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Btn variant="primary" type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Pengaturan'}</Btn>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export function AdminDiscountRules({ rules = [] }: { rules: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    minimum_months: 1,
    discount_percentage: 0,
    is_active: true,
  });

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      minimum_months: item.minimum_months,
      discount_percentage: item.discount_percentage,
      is_active: item.is_active,
    });
  };

  const closeEdit = () => {
    setIsEditing(null);
    setShowForm(false);
    reset();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(`/admin/settings/discount-rules/${isEditing.id}`, { preserveScroll: true, preserveState: true, onSuccess: closeEdit });
    } else {
      post('/admin/settings/discount-rules', { preserveScroll: true, preserveState: true, onSuccess: closeEdit });
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: 'Hapus Aturan?',
      text: 'Yakin ingin menghapus aturan diskon ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/settings/discount-rules/${id}`, { preserveScroll: true, preserveState: true });
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-5 space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            if (showForm && isEditing) {
              closeEdit();
            } else {
              setShowForm(!showForm);
              if (!showForm) reset();
            }
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Aturan Diskon Sewa</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola diskon otomatis berdasarkan lama sewa (dinamis)</p>
          </div>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showForm && !isEditing ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
            {showForm && !isEditing ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        {showForm && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{isEditing ? 'Edit Aturan' : 'Tambah Aturan Baru'}</h3>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Minimal Sewa (Bulan)</label>
                  <input type="number" value={data.minimum_months} onChange={e => setData('minimum_months', parseInt(e.target.value) || 1)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" min="1" required />
                  {errors.minimum_months && <p className="text-red-500 text-xs mt-1">{errors.minimum_months}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Diskon (%)</label>
                  <input 
                    type="text" 
                    value={data.discount_percentage || ''} 
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setData('discount_percentage', val ? parseFloat(val) : 0);
                    }} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="0" 
                    required 
                  />
                  {errors.discount_percentage && <p className="text-red-500 text-xs mt-1">{errors.discount_percentage}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="dr_is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="dr_is_active" className="text-sm text-slate-700">Aktif</label>
              </div>
              <div className="pt-4 flex gap-3">
                <Btn variant="primary" type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Aturan'}</Btn>
                <Btn variant="outline" type="button" onClick={closeEdit}>Batal</Btn>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {rules.length > 0 ? rules.map((r: any) => (
            <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Percent size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Min. {r.minimum_months} Bulan</p>
                  <div className="flex gap-2 items-center text-xs mt-1">
                    <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Diskon: {r.discount_percentage}%</span>
                    <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(r)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Edit size={14} /></button>
                <button onClick={() => handleDelete(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-400">
              Belum ada aturan diskon yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminSocialLinks({ social = [] }: { social: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    platform: '',
    url: '',
    icon: '',
    sort_order: 0,
    is_active: true,
  });

  const platformPresets = [
    { name: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/username', color: 'from-pink-500 to-purple-600' },
    { name: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/username', color: 'from-blue-600 to-blue-700' },
    { name: 'TikTok', icon: 'tiktok', placeholder: 'https://tiktok.com/@username', color: 'from-slate-900 to-slate-800' },
    { name: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@channel', color: 'from-red-600 to-red-700' },
    { name: 'WhatsApp', icon: 'whatsapp', placeholder: 'https://wa.me/628123456789', color: 'from-emerald-500 to-green-600' },
    { name: 'Twitter / X', icon: 'twitter', placeholder: 'https://x.com/username', color: 'from-slate-800 to-slate-900' },
    { name: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/company/name', color: 'from-blue-700 to-blue-800' },
  ];

  const getPlatformIcon = (name: string, iconKey?: string) => {
    const p = (name || '').toLowerCase();
    const k = (iconKey || '').toLowerCase();

    if (p.includes('instagram') || k === 'instagram') {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
          <Instagram size={16} />
        </div>
      );
    }
    if (p.includes('facebook') || k === 'facebook') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <Facebook size={16} />
        </div>
      );
    }
    if (p.includes('tiktok') || k === 'tiktok') {
      return (
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs font-black text-xs">
          <span>TT</span>
        </div>
      );
    }
    if (p.includes('youtube') || k === 'youtube') {
      return (
        <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
          <Youtube size={16} />
        </div>
      );
    }
    if (p.includes('whatsapp') || k === 'whatsapp') {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <MessageSquare size={16} />
        </div>
      );
    }
    if (p.includes('twitter') || p.includes('x') || k === 'twitter') {
      return (
        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs">
          <Twitter size={16} />
        </div>
      );
    }
    if (p.includes('linkedin') || k === 'linkedin') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
          <Linkedin size={16} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
        <Globe size={16} />
      </div>
    );
  };

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      platform: item.platform,
      url: item.url,
      icon: item.icon || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active !== false,
    });
  };

  const closeEdit = () => {
    setIsEditing(null);
    setShowForm(false);
    reset();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        closeEdit();
        showAlert({
          icon: 'success',
          title: 'Berhasil!',
          text: isEditing ? 'Social media berhasil diperbarui!' : 'Social media berhasil ditambahkan!',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (errs: any) => {
        showAlert({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: Object.values(errs).join(', ') || 'Terjadi kesalahan saat menyimpan data.',
        });
      }
    };

    if (isEditing) {
      put(`/admin/settings/social/${isEditing.id}`, options);
    } else {
      post('/admin/settings/social', options);
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: 'Hapus Link?',
      text: 'Yakin ingin menghapus link social media ini dari database dan footer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result: any) => {
      if (result.isConfirmed) {
        destroy(`/admin/settings/social/${id}`, {
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => {
            showAlert({
              icon: 'success',
              title: 'Terhapus!',
              text: 'Social media berhasil dihapus.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            if (showForm && isEditing) {
              closeEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Social Media' : 'Tambah Social Media'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kelola tautan akun media sosial yang tampil di footer website</p>
            </div>
          </div>
          <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={24} />
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            {/* Quick Presets */}
            {!isEditing && (
              <div className="pt-4 pb-2">
                <label className="block text-xs font-semibold text-slate-500 mb-2">Pilih Cepat Platform:</label>
                <div className="flex flex-wrap gap-2">
                  {platformPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setData(d => ({
                          ...d,
                          platform: preset.name,
                          icon: preset.icon,
                          url: d.url || preset.placeholder,
                        }));
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        data.platform === preset.name 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Platform</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="misal: Instagram, TikTok"
                    value={data.platform} 
                    onChange={e => setData('platform', e.target.value)} 
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Profil / Akun</label>
                  <input 
                    required 
                    type="url" 
                    value={data.url} 
                    onChange={e => setData('url', e.target.value)} 
                    placeholder="https://instagram.com/cozqta" 
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan Tampil (Sort)</label>
                  <input 
                    type="number" 
                    value={data.sort_order} 
                    onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} 
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.is_active} 
                      onChange={e => setData('is_active', e.target.checked)} 
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-700">Tampilkan di Footer (Aktif)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 sm:col-span-2 md:col-span-1 pt-3">
                  {isEditing && <Btn type="button" variant="outline" size="sm" onClick={closeEdit}>Batal</Btn>}
                  <Btn type="submit" variant="primary" size="sm" disabled={processing}>{isEditing ? 'Simpan Perubahan' : 'Tambah Social Media'}</Btn>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">Daftar Social Media Terdaftar</h3>
          <span className="text-xs text-slate-400">{social.length} item</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Platform & Icon</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">URL Profil</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Urutan</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {social.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-slate-400">
                  Belum ada link social media. Klik <b>"Tambah Social Media"</b> di atas untuk menambahkan akun media sosial Anda.
                </td>
              </tr>
            ) : social.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(item.platform, item.icon)}
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">{item.platform}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.icon || 'link'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-xs">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    <span className="truncate">{item.url}</span>
                    <Globe size={12} className="flex-shrink-0" />
                  </a>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                    {item.is_active !== false ? 'Aktif' : 'Non-aktif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 text-center font-semibold">{item.sort_order ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={() => openEdit(item)} 
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit size={15}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export function AdminFaqs({ faqs = [] }: { faqs: any[] }) {
  const [isEditing, setIsEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true,
  });

  const openEdit = (item: any) => {
    setIsEditing(item);
    setShowForm(true);
    setData({
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order || 0,
      is_active: item.is_active,
    });
  };

  const closeEdit = () => {
    setIsEditing(null);
    setShowForm(false);
    reset();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(`/admin/settings/faq/${isEditing.id}`, { preserveScroll: true, preserveState: true, onSuccess: closeEdit });
    } else {
      post('/admin/settings/faq', { preserveScroll: true, preserveState: true, onSuccess: closeEdit });
    }
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: 'Hapus FAQ?',
      text: 'Yakin ingin menghapus FAQ ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/admin/settings/faq/${id}`, { preserveScroll: true, preserveState: true });
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => {
            if (showForm && isEditing) {
              closeEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru'}</h2>
            {!showForm && !isEditing && <p className="text-sm text-slate-500 mt-1">Klik untuk menambahkan Pertanyaan Umum (FAQ)</p>}
          </div>
          <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} size={24} />
        </div>

        {showForm && (
          <div className="p-6 pt-0 border-t border-slate-100 animate-fade-in">
            <form onSubmit={submit} className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pertanyaan</label>
                <input required type="text" value={data.question} onChange={e => setData('question', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jawaban</label>
                <textarea required value={data.answer} onChange={e => setData('answer', e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-32">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Urutan</label>
                  <input type="number" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex-1 flex justify-end gap-2 mt-5">
                  {isEditing && <Btn type="button" variant="outline" onClick={closeEdit}>Batal</Btn>}
                  <Btn type="submit" variant="primary" disabled={processing}>{isEditing ? 'Simpan' : 'Tambah FAQ'}</Btn>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center text-slate-400">Belum ada FAQ</div>
        ) : faqs.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {item.sort_order}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{item.question}</h3>
              <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{item.answer}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit size={14}/></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
