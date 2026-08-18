import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import {
  LayoutDashboard, Calendar, CreditCard, Heart, Bell, MessageSquare, User as UserIcon,
  Settings, LogOut, Building2, Star, CheckCircle2, AlertCircle, RefreshCw, Clock,
  BedDouble, Users, Package, DollarSign, BarChart2, Receipt, FileText, Globe, Plus,
  ChevronLeft, ChevronRight, Download, Sparkles, Shield, Search, Filter, List, Grid, Eye, Edit, Trash2, Check, Menu, X, MapPin,
  Folder, Wrench, HelpCircle, AlertTriangle, ChevronDown, Mail, Percent
} from 'lucide-react';
import {
  ROOMS, TRANSACTIONS, REVENUE_DATA, OCCUPANCY_DATA, BOOKING_DATA, TENANTS,
  fmtShort, fmtIDR, fmtRevenue, fmt
} from '@/components/cozqta/data';
import { StatCard, StatusBadge, Badge, Btn, Avatar, SearchableSelect } from '@/components/cozqta/primitives';

// Dynamic (lazy) imports — loaded only when needed
const showAlert = async (opts: any) => {
  const { default: Swal } = await import('sweetalert2');
  return Swal.fire(opts);
};
const TicketDashboard = lazy(() => import('@/components/tickets/TicketDashboard'));
const AdminDashboardHome = lazy(() => import('@/components/admin/AdminDashboardHome'));
const AdminBranches = lazy(() => import('@/components/admin/AdminBranches'));
const AdminCategories = lazy(() => import('@/components/admin/AdminCategories'));
const AdminFacilities = lazy(() => import('@/components/admin/AdminFacilities'));
const AdminRoomTypes = lazy(() => import('@/components/admin/AdminRoomTypes'));
const AdminRBAC = lazy(() => import('@/components/admin/AdminRBAC'));
const AdminDeposits = lazy(() => import('@/components/admin/AdminDeposits'));
const AdminBookings = lazy(() => import('@/components/admin/AdminBookings'));
const AdminContracts = lazy(() => import('@/components/admin/AdminContracts'));
const AdminMaintenance = lazy(() => import('@/components/admin/AdminMaintenance'));
const AdminInvoices = lazy(() => import('@/components/admin/AdminInvoices'));
const AdminTransactions = lazy(() => import('@/components/admin/AdminTransactions'));
const AdminPaymentConfig = lazy(() => import('@/components/admin/AdminPaymentConfig'));
const AdminNotificationTemplates = lazy(() => import('@/components/admin/AdminNotificationTemplates'));
const AdminNotificationLogs = lazy(() => import('@/components/admin/AdminNotificationLogs'));
const AdminActivityLogs = lazy(() => import('@/components/admin/AdminActivityLogs'));
const AdminOccupancy = lazy(() => import('@/components/admin/AdminOccupancy'));
const AdminReviews = lazy(() => import('@/components/admin/AdminReviews'));
const ActiveContract = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.ActiveContract })));
const RoomDetails = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.RoomDetails })));
const BookingHistory = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.BookingHistory })));
const PendingInvoices = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PendingInvoices })));
const PaymentHistory = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PaymentHistory })));
const AdminRooms = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminRooms })));
const AdminTenants = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminTenants })));
const AdminPayments = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminPayments })));
const AdminProperties = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminProperties })));
const AdminWebSettings = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminWebSettings })));
const AdminDiscountRules = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminDiscountRules })));
const AdminSocialLinks = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminSocialLinks })));
const AdminFaqs = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminFaqs })));


const getRoleLabel = (roles: string[] | undefined) => {
  const code = roles?.[0];
  if (code === 'admin') return 'Administrator';
  if (code === 'operator') return 'Operator Cabang';
  if (code === 'tenant') return 'Penghuni';
  return 'Penghuni';
};

export default function Dashboard() {
  const { props, url } = usePage();
  const auth = (props as any).auth;
  const user = auth?.user || { name: 'Penghuni CozQta', email: 'penghuni@cozqta.id' };
  
  // Ambil stats dari controller
  const stats = (props as any).stats || {
    active_bookings: 0,
    total_paid: 0,
    reward_points: 0,
    new_notifications: 0,
    active_lease: null,
    profile_photo_url: null
  };

  const [mode] = useState<'user' | 'operator' | 'admin'>(() => {
    if (user?.roles?.includes('admin')) return 'admin';
    if (user?.roles?.includes('operator')) return 'operator';
    return 'user';
  });

  // Toast handler using SweetAlert2
  useEffect(() => {
    const flash = (props as any).flash;
    if (flash?.success || flash?.error) {
      import('sweetalert2').then(({ default: Swal }) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        if (flash?.success) {
          Toast.fire({
            icon: 'success',
            title: flash.success
          });
        }
        if (flash?.error) {
          Toast.fire({
            icon: 'error',
            title: flash.error
          });
        }
      });
    }
  }, [props]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Head title={mode === 'admin' ? 'Admin Dashboard — CozQta' : mode === 'operator' ? 'Operator Dashboard — CozQta' : 'User Dashboard — CozQta'} />

      {mode === 'user' ? (
        <UserDashboardView user={user} stats={stats} />
      ) : mode === 'operator' ? (
        <OperatorDashboardView user={user} stats={stats} />
      ) : (
        <AdminDashboardView user={user} stats={stats} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER DASHBOARD VIEW (100% matched to React template)
───────────────────────────────────────────────────────────────────────────── */
function UserDashboardView({ user, stats }: { user: any; stats: any }) {
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) return tabParam;
      const saved = sessionStorage.getItem('user_tab');
      if (saved) return saved;
    }
    return "dashboard";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user_tab', newTab);
      const newUrl = newTab === 'dashboard' ? '/dashboard' : `/dashboard?tab=${newTab}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const { data: profileData, setData: setProfileData, post: postProfile, processing: profileProcessing } = useForm({
    full_name: stats.profile?.full_name || user?.name || '',
    phone_number: stats.profile?.phone_number || '',
    emergency_contact_number: stats.profile?.emergency_contact_number || '',
    identity_number: stats.profile?.identity_number || '',
    gender: stats.profile?.gender || 'male',
    birth_place: stats.profile?.birth_place || '',
    birth_day: stats.profile?.birth_day || '',
    address: stats.profile?.address || '',
    profile_photo: null as File | null,
    identity_number_photo: null as File | null,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    postProfile('/profile/update', {
      preserveScroll: true,
      onSuccess: () => {
        showAlert({ icon: 'success', title: 'Berhasil', text: 'Profil berhasil diperbarui!' });
      },
    });
  };

  const { auth } = usePage().props as any;
  const hasActiveContract = user.email !== "guest@cozqta.id"; // Demo conditional check
  
  const sidebarGroups = [
    {
      label: "Utama",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard Penghuni" },
        { id: "catalog", icon: Search, label: "Cari Kamar / Katalog", url: "/rooms" }
      ]
    },
    {
      label: "Sewa Saya",
      items: [
        { id: "active_contract", icon: FileText, label: "Kontrak Sewa Aktif" },
        { id: "my_room", icon: BedDouble, label: "Detail Unit Kamar" },
        { id: "my_bookings", icon: Calendar, label: "Riwayat Booking" }
      ]
    },
    {
      label: "Keuangan",
      items: [
        { id: "my_invoices", icon: Receipt, label: "Tagihan Bulan Ini", badge: (stats?.pending_invoices?.length || 0) > 0 ? stats.pending_invoices.length.toString() : undefined },
        { id: "payment_history", icon: CreditCard, label: "Riwayat Bayar & Invoice" }
      ]
    },
    {
      label: "Aktivitas & Dukungan",
      items: [
        { id: "give_review", icon: Star, label: "Beri Ulasan Cabang" },
        { id: "tickets", icon: AlertTriangle, label: "Laporan & Bantuan (Tiket)" }
      ]
    },
    {
      label: "Akun",
      items: [
        { id: "profile", icon: UserIcon, label: "Profil Saya" },
        { id: "password", icon: Settings, label: "Ubah Kata Sandi" }
      ]
    }
  ];

  const filteredGroups = sidebarGroups.map(group => {
    if (group.label === "Sewa Saya") {
      return {
        ...group,
        items: group.items.filter(item => {
          if (!hasActiveContract && (item.id === "active_contract" || item.id === "my_room")) {
            return false;
          }
          return true;
        })
      };
    }
    return group;
  }).filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex pt-0 relative">
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-fade-in" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"} ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        {mobileOpen && (
          <div className="p-3 flex justify-end md:hidden border-b border-slate-100">
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-4">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <Avatar src={stats.profile_photo_url || "https://ui-avatars.com/api/?name="+encodeURIComponent(user.name)+"&background=random"} name={user.name} size="md" />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider mb-0.5">{getRoleLabel(user.roles)}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {filteredGroups.map(group => (
            <div key={group.label} className="space-y-1">
              {!sidebarCollapsed ? (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1">{group.label}</p>
              ) : (
                <div className="border-t border-slate-100 my-2 pt-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const commonProps = {
                    className: `w-full flex items-center justify-between rounded-xl text-sm font-medium transition-colors ${
                      sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                    } ${tab === item.id ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`,
                    title: sidebarCollapsed ? item.label : undefined
                  };
                  
                  const content = (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon size={16} className={`flex-shrink-0 ${tab === item.id ? "text-indigo-600" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && (item as any).badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {(item as any).badge}
                        </span>
                      )}
                    </>
                  );

                  if ((item as any).url) {
                    return (
                      <Link key={item.id} href={(item as any).url} {...commonProps}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                     <button key={item.id} onClick={() => { setTab(item.id); setMobileOpen(false); }} {...commonProps}>
                       {content}
                     </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100 flex justify-between items-center">
          <Link
            href="/logout"
            method="post"
            as="button"
            className={`w-full flex items-center rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
              sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            }`}
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar User (Clean, Premium, Sticky) */}
        <div className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4 backdrop-blur-md sticky top-0 z-30 text-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile trigger using ChevronRight (>) instead of burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title="Buka Menu"
            >
              <ChevronRight size={20} />
            </button>

            {/* Desktop toggle for collapsing sidebar using > / < */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title={sidebarCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative">
              <button 
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 relative transition-all duration-150 cursor-pointer"
              >
                <Bell size={15} className="text-slate-500" />
                {auth?.user?.unread_notifications_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                    {auth.user.unread_notifications_count > 9 ? '9+' : auth.user.unread_notifications_count}
                  </span>
                )}
              </button>

              {showNotifPopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPopup(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-150 shadow-lg rounded-xl p-4 z-50 animate-fade-in text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-bold text-xs text-slate-700">Notifikasi Terbaru</span>
                      <div className="flex gap-2">
                        {auth?.user?.unread_notifications_count > 0 && (
                           <button 
                            onClick={() => {
                                router.post('/notifications/mark-all-as-read', {}, { preserveScroll: true });
                            }}
                            className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 hover:underline"
                           >
                            Tandai Dibaca
                           </button>
                        )}
                        <button 
                          onClick={() => { setTab('notifications'); setShowNotifPopup(false); }}
                          className="text-[10px] font-semibold text-indigo-650 hover:underline"
                        >
                          Lihat Semua
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-500">Tidak ada notifikasi</div>
                      ) : (
                          auth.user.notifications.map((notif: any) => (
                              <div key={notif.id} className={`flex gap-2.5 items-start text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer ${notif.read_at ? 'opacity-70' : ''}`}>
                                {!notif.read_at && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <p className={`text-slate-800 ${notif.read_at ? '' : 'font-semibold'}`}>
                                      {notif.data?.message || 'Ada notifikasi baru'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                {!notif.read_at && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.post(`/notifications/${notif.id}/mark-as-read`, {}, { preserveScroll: true });
                                        }}
                                        className="text-[10px] text-indigo-500 hover:underline flex-shrink-0"
                                    >
                                        Tandai
                                    </button>
                                )}
                              </div>
                          ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content area with scrolling and padding */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page title inside content body (not in navbar) */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              {filteredGroups.flatMap(g => g.items).find(i => i.id === tab)?.label || "Dashboard"}
            </h1>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
            {tab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Pemesanan Aktif" value={stats.active_bookings.toString()} icon={Calendar} color="indigo" />
                <StatCard label="Total Dibayar" value={fmtShort(stats.total_paid)} icon={CreditCard} color="green" />
                <StatCard label="Notifikasi Baru" value={stats.new_notifications.toString()} icon={Bell} color="purple" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                    <ActiveContract contract={stats.active_contract} />
                 </div>
                 <div>
                    <PendingInvoices invoices={stats.pending_invoices || []} />
                 </div>
              </div>
            </div>
          )}



          {tab === "active_contract" && <ActiveContract contract={stats.active_contract} />}
          {tab === "my_room" && <RoomDetails contract={stats.active_contract} />}
          {tab === "my_bookings" && <BookingHistory bookings={stats.booking_history || []} />}
          {tab === "my_invoices" && <PendingInvoices invoices={stats.pending_invoices || []} />}
          {tab === "payment_history" && <PaymentHistory payments={stats.payment_history || []} />}
          {tab === "tickets" && (
            <TicketDashboard user={user} />
          )}

          {tab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in">
              <h3 className="font-semibold text-slate-900 text-lg mb-6">Semua Notifikasi</h3>
              <div className="space-y-4">
                {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">Belum ada notifikasi.</div>
                ) : (
                  auth.user.notifications.map((notif: any) => (
                    <div key={notif.id} className={`p-4 rounded-xl border ${notif.read_at ? 'bg-slate-50 border-slate-100' : 'bg-white border-indigo-100 shadow-sm'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          {!notif.read_at && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                          <div>
                            <p className={`text-sm ${notif.read_at ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>{notif.data?.message || 'Ada notifikasi baru'}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
              <h3 className="font-semibold text-slate-900 text-lg">Profil Saya</h3>
              <form className="space-y-6 w-full" onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Avatar Upload */}
                  <div className="md:col-span-2 flex items-center gap-4">
                    <img src={profileData.profile_photo ? URL.createObjectURL(profileData.profile_photo) : (stats.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-slate-200" />
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Foto Profil</label>
                      <input type="file" accept="image/*" onChange={e => setProfileData('profile_photo', e.target.files ? e.target.files[0] : null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Nama Lengkap</label>
                    <input type="text" value={profileData.full_name} onChange={e => setProfileData('full_name', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email</label>
                    <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 outline-none" readOnly />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Nomor HP (WA)</label>
                    <input type="tel" value={profileData.phone_number} onChange={e => setProfileData('phone_number', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Nomor Darurat (Keluarga)</label>
                    <input type="tel" value={profileData.emergency_contact_number} onChange={e => setProfileData('emergency_contact_number', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Nomor KTP (NIK)</label>
                    <input type="text" value={profileData.identity_number} onChange={e => setProfileData('identity_number', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Foto KTP</label>
                    <input type="file" accept="image/*" onChange={e => setProfileData('identity_number_photo', e.target.files ? e.target.files[0] : null)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Jenis Kelamin</label>
                    <SearchableSelect 
                      value={profileData.gender}
                      onChange={val => setProfileData('gender', val)}
                      options={[
                        {label: 'Laki-laki', value: 'male'},
                        {label: 'Perempuan', value: 'female'}
                      ]}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tempat & Tanggal Lahir</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Tempat" value={profileData.birth_place} onChange={e => setProfileData('birth_place', e.target.value)} className="w-1/2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      <input type="date" value={profileData.birth_day} onChange={e => setProfileData('birth_day', e.target.value)} className="w-1/2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Alamat Lengkap (Sesuai KTP)</label>
                    <textarea rows={3} value={profileData.address} onChange={e => setProfileData('address', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500/50"></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Btn variant="primary" type="submit" disabled={profileProcessing}>Simpan Perubahan Profil</Btn>
                </div>
              </form>
            </div>
          )}

          {tab === "password" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-fade-in max-w-2xl mx-auto">
              <h3 className="font-semibold text-slate-900 text-lg mb-4">Ubah Kata Sandi</h3>
              <form className="space-y-4 w-full" onSubmit={(e) => { e.preventDefault(); showAlert({ icon: 'success', title: 'Berhasil', text: 'Kata sandi berhasil diubah!' }); }}>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Kata Sandi Saat Ini</label>
                  <input type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Kata Sandi Baru</label>
                  <input type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Konfirmasi Kata Sandi</label>
                  <input type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div className="flex justify-end pt-2">
                  <Btn variant="primary" type="submit">Perbarui Kata Sandi</Btn>
                </div>
              </form>
            </div>
          )}

          {tab === "give_review" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-fade-in max-w-2xl mx-auto">
              <h3 className="font-semibold text-slate-900 text-lg mb-4">Beri Ulasan Cabang</h3>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4 w-full mb-6">
                <Star className="text-indigo-600 flex-shrink-0" size={24} />
                <p className="text-sm text-indigo-900">Ulasan Anda sangat berarti untuk membantu kami terus meningkatkan kualitas layanan dan fasilitas cabang CozQta.</p>
              </div>
              <form className="space-y-4 w-full" onSubmit={(e) => { 
                  e.preventDefault(); 
                  const form = e.target as HTMLFormElement;
                  const branchId = (form.elements.namedItem('branch_id') as HTMLSelectElement)?.value;
                  const reviewText = (form.elements.namedItem('review_text') as HTMLTextAreaElement)?.value;
                  
                  // if no branch_id selected, default to first rental history if available
                  const finalBranchId = branchId || (stats.rental_history && stats.rental_history.length > 0 ? String(stats.rental_history[0].branch_id) : '');
                  
                  if (!finalBranchId) {
                      showAlert({ icon: 'error', title: 'Oops', text: 'Pilih cabang terlebih dahulu' });
                      return;
                  }

                  router.post('/reviews', {
                      branch_id: finalBranchId,
                      rating: reviewRating || 5,
                      review_text: reviewText
                  }, {
                      onSuccess: () => {
                          setTab('dashboard');
                          setReviewRating(0);
                          setReviewHoverRating(0);
                          form.reset();
                      }
                  });
              }}>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Pilih Cabang (Sewa Terakhir)</label>
                  <select name="branch_id" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none bg-white">
                    {stats.rental_history && stats.rental_history.length > 0 ? (
                        stats.rental_history.map((h: any) => (
                            <option key={h.id} value={h.branch_id}>{h.branch_name} - Kamar {h.unit_number}</option>
                        ))
                    ) : (
                        <option value="" disabled selected>Belum ada riwayat sewa kamar</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button 
                        type="button" 
                        key={s} 
                        onClick={() => setReviewRating(s)}
                        onMouseEnter={() => setReviewHoverRating(s)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className={`p-2 rounded-lg transition-colors ${
                          s <= (reviewHoverRating || reviewRating) 
                          ? 'text-amber-400 hover:bg-amber-50' 
                          : 'text-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Star size={32} className="fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Ulasan Anda</label>
                  <textarea name="review_text" rows={4} required placeholder="Isi Ulasan" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500/50"></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <Btn variant="primary" type="submit">Kirim Ulasan</Btn>
                </div>
              </form>
            </div>
          )}

          {!["dashboard", "active_contract", "my_room", "my_bookings", "my_invoices", "payment_history", "profile", "password", "give_review", "tickets", "notifications"].includes(tab) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {(() => { const Item = sidebarGroups.flatMap(g => g.items).find(s => s.id === tab); return Item ? <Item.icon size={24} className="text-slate-400" /> : null; })()}
              </div>
              <p className="font-semibold text-slate-700 mb-1">{sidebarGroups.flatMap(g => g.items).find(s => s.id === tab)?.label}</p>
              <p className="text-slate-400 text-sm">Konten sedang disiapkan</p>
            </div>
          )}
            </Suspense>
        </div>
      </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN DASHBOARD VIEW (100% matched to React template)
───────────────────────────────────────────────────────────────────────────── */
const VALID_ADMIN_TABS = [
  "dashboard", "branches", "categories", "facilities", "room_types", "rooms", "tenants", "payments",
  "bookings", "contracts", "maintenance", "invoices", "transactions", "deposits", "payment_config",
  "properties", "web_settings", "social_links", "faqs", "rbac", "templates", "queues", "audit",
  "occupancy", "reviews", "tickets", "notifications"
];

function AdminDashboardView({ user, stats }: { user: any; stats: any }) {
  const { url } = usePage();
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && VALID_ADMIN_TABS.includes(tabParam)) {
        return tabParam;
      }
      const saved = sessionStorage.getItem('admin_tab');
      if (saved && VALID_ADMIN_TABS.includes(saved)) {
        return saved;
      }
    }
    return "dashboard";
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        if (VALID_ADMIN_TABS.includes(tabParam)) {
          setTab(tabParam);
          sessionStorage.setItem('admin_tab', tabParam);
        } else {
          setTab("dashboard");
          sessionStorage.setItem('admin_tab', 'dashboard');
          // Clean invalid query from URL bar
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [url]);

  const [roomView, setRoomView] = useState<"grid" | "list">("list");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_tab', newTab);
      const newUrl = newTab === 'dashboard' ? '/dashboard' : `/dashboard?tab=${newTab}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const activeTab = VALID_ADMIN_TABS.includes(tab) ? tab : "dashboard";


  const { auth } = usePage().props as any;
  const adminStats = (usePage().props as any).admin_stats || { branches: [] };
  const actualBranches = adminStats.branches || [];
  const [selectedBranch, setSelectedBranch] = useState("all");

  const sidebarGroups = [
    {
      label: "Dashboard",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Analytics Utama" }
      ]
    },
    {
      label: "Master Data Properti",
      items: [
        { id: "branches", icon: MapPin, label: "Daftar Cabang" },
        { id: "categories", icon: Folder, label: "Kategori Kamar" },
        { id: "facilities", icon: Star, label: "Fasilitas Kamar" },
        { id: "room_types", icon: Building2, label: "Tipe Kamar" }
      ]
    },
    {
      label: "Operasional & Sewa",
      items: [
        { id: "bookings", icon: Calendar, label: "Semua Data Booking", badge: (adminStats?.pending_bookings > 0) ? adminStats.pending_bookings.toString() : undefined },
        { id: "contracts", icon: FileText, label: "Kontrak Sewa Aktif" },
        { id: "maintenance", icon: Wrench, label: "Manajemen Maintenance" }
      ]
    },
    {
      label: "Keuangan & Transaksi",
      items: [
        { id: "invoices", icon: Receipt, label: "Tagihan & Invoice", badge: (adminStats?.pending_payments > 0) ? adminStats.pending_payments.toString() : undefined },
        { id: "deposits", icon: DollarSign, label: "Manajemen Deposit" },
        { id: "transactions", icon: DollarSign, label: "Laporan Transaksi Global" },
        ...(actualBranches.length > 0 ? [{ id: "payment_config", icon: CreditCard, label: "Payment Gateway Config" }] : [])
      ]
    },
    {
      label: "Komunikasi & Notifikasi",
      items: [
        { id: "tickets", icon: MessageSquare, label: "Laporan & Bantuan (Tiket)", badge: (adminStats?.open_tickets > 0) ? adminStats.open_tickets.toString() : undefined },
        { id: "templates", icon: MessageSquare, label: "Template Notifikasi" },
        { id: "queues", icon: Clock, label: "Antrean Notifikasi", badge: (adminStats?.pending_notification_queues > 0) ? adminStats.pending_notification_queues.toString() : undefined },
        { id: "reviews", icon: Star, label: "Moderasi Review Cabang" }
      ]
    },
    {
      label: "Integrasi & Audit",
      items: [
        { id: "occupancy", icon: BarChart2, label: "Ringkasan Okupansi" },
        { id: "audit", icon: Shield, label: "Activity / Audit Logs" }
      ]
    },
    {
      label: "Pengaturan Sistem",
      items: [
        { id: "web_settings", icon: Globe, label: "Pengaturan Website" },
        { id: "social_links", icon: Globe, label: "Social Media Links" },
        { id: "faqs", icon: HelpCircle, label: "Manajemen FAQ" },
        { id: "rbac", icon: Users, label: "User & Role (RBAC)" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex pt-0 relative">
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-fade-in" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"} ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        {mobileOpen && (
          <div className="p-3 flex justify-end md:hidden border-b border-slate-100">
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-4">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <Avatar src={stats?.profile_photo_url || "https://ui-avatars.com/api/?name="+encodeURIComponent(user?.name || 'User')+"&background=random"} name={user?.name} size="md" />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider mb-0.5">{getRoleLabel(user?.roles)}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Switch Cabang Dropdown */}
        {!sidebarCollapsed ? (
          <div className="px-3 mb-4">
            <div className="relative p-2 flex items-center justify-between">
              <div className="w-full">
                <SearchableSelect 
                  value={selectedBranch}
                  onChange={val => setSelectedBranch(val)}
                  options={[
                    {label: 'Semua Cabang (Global)', value: 'all'},
                    ...actualBranches.map((b: any) => ({ label: b.name, value: String(b.id) }))
                  ]}
                  className="!border-slate-200/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4" title={selectedBranch === "all" ? "Semua Cabang" : actualBranches.find((b: any) => b.id.toString() === selectedBranch)?.name}>
            <MapPin size={18} className="text-indigo-600 mx-auto" />
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {sidebarGroups.map(group => (
            <div key={group.label}>
              {!sidebarCollapsed ? (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1">{group.label}</p>
              ) : (
                <div className="border-t border-slate-100 my-2 pt-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const commonProps = {
                    className: `w-full flex items-center justify-between rounded-xl text-sm font-medium transition-colors ${
                      sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                    } ${tab === item.id ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`,
                    title: sidebarCollapsed ? item.label : undefined
                  };
                  
                  const content = (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon size={16} className={`flex-shrink-0 ${tab === item.id ? "text-indigo-600" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  );

                  if ((item as any).url) {
                    return (
                      <Link key={item.id} href={(item as any).url} {...commonProps}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                     <button key={item.id} onClick={() => handleTabChange(item.id)} {...commonProps}>
                       {content}
                     </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <Link
            href="/logout"
            method="post"
            as="button"
            className={`w-full flex items-center rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
              sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            }`}
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar Admin (Clean, Premium, Sticky) */}
        <div className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4 backdrop-blur-md sticky top-0 z-30 text-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile trigger using ChevronRight (>) instead of burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title="Buka Menu"
            >
              <ChevronRight size={20} />
            </button>

            {/* Desktop toggle for collapsing sidebar using > / < */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title={sidebarCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 relative transition-all duration-150 cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={15} className="text-slate-500" />
                {auth?.user?.unread_notifications_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                    {auth.user.unread_notifications_count > 9 ? '9+' : auth.user.unread_notifications_count}
                  </span>
                )}
              </button>

              {showNotifPopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPopup(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-150 shadow-lg rounded-xl p-4 z-50 animate-fade-in text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-bold text-xs text-slate-700">Notifikasi Admin</span>
                      <div className="flex gap-2">
                        {auth?.user?.unread_notifications_count > 0 && (
                           <button 
                            onClick={() => {
                                router.post('/notifications/mark-all-as-read', {}, { preserveScroll: true });
                            }}
                            className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 hover:underline"
                           >
                            Tandai Dibaca
                           </button>
                        )}
                        <button 
                          onClick={() => { setTab('notifications'); setShowNotifPopup(false); }}
                          className="text-[10px] font-semibold text-indigo-650 hover:underline"
                        >
                          Lihat Semua
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-500">Tidak ada notifikasi</div>
                      ) : (
                          auth.user.notifications.map((notif: any) => (
                              <div key={notif.id} className={`flex gap-2.5 items-start text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer ${notif.read_at ? 'opacity-70' : ''}`}>
                                {!notif.read_at && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <p className={`text-slate-800 ${notif.read_at ? '' : 'font-semibold'}`}>
                                      {notif.data?.message || 'Ada notifikasi baru'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                {!notif.read_at && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.post(`/notifications/${notif.id}/mark-as-read`, {}, { preserveScroll: true });
                                        }}
                                        className="text-[10px] text-indigo-500 hover:underline flex-shrink-0"
                                    >
                                        Tandai
                                    </button>
                                )}
                              </div>
                          ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content area with scrolling and padding */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page title inside content body (not in navbar) */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || "Dashboard"}
            </h1>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
            {activeTab === "dashboard" && <AdminDashboardHome stats={stats} />}
          {activeTab === "branches" && <AdminBranches branches={selectedBranch === "all" ? adminStats?.branches || [] : (adminStats?.branches || []).filter((b:any) => b.id.toString() === selectedBranch)} operators={adminStats?.operators || []} />}
          {activeTab === "categories" && <AdminCategories categories={selectedBranch === "all" ? adminStats?.room_categories || [] : (adminStats?.room_categories || []).filter((c:any) => !c.branch_id || c.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} />}
          {activeTab === "facilities" && <AdminFacilities facilities={selectedBranch === "all" ? adminStats?.facilities || [] : (adminStats?.facilities || []).filter((f:any) => !f.branch_id || f.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} />}
          {activeTab === "room_types" && <AdminRoomTypes roomTypes={selectedBranch === "all" ? adminStats?.room_types || [] : (adminStats?.room_types || []).filter((r:any) => r.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} categories={adminStats?.room_categories || []} facilities={adminStats?.facilities || []} />}
          {activeTab === "rooms" && <AdminRooms roomView={roomView} setRoomView={setRoomView} />}
          {activeTab === "tenants" && <AdminTenants />}
          {activeTab === "payments" && <AdminPayments />}
          {activeTab === "bookings" && <AdminBookings bookings={selectedBranch === "all" ? adminStats?.bookings || [] : (adminStats?.bookings || []).filter((b:any) => b.branch_id?.toString() === selectedBranch)} branches={adminStats?.branches || []} roomTypes={adminStats?.room_types || []} users={adminStats?.users || []} />}
          {activeTab === "contracts" && <AdminContracts contracts={selectedBranch === "all" ? adminStats?.contracts || [] : (adminStats?.contracts || []).filter((c:any) => c.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "maintenance" && <AdminMaintenance units={selectedBranch === "all" ? adminStats?.room_units || [] : (adminStats?.room_units || []).filter((u:any) => u.room_type?.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "invoices" && <AdminInvoices invoices={selectedBranch === "all" ? adminStats?.transactions || [] : (adminStats?.transactions || []).filter((i:any) => i.booking?.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "deposits" && <AdminDeposits deposits={selectedBranch === "all" ? adminStats?.deposits || [] : (adminStats?.deposits || []).filter((d:any) => d.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "transactions" && <AdminTransactions transactions={selectedBranch === "all" ? adminStats?.transactions || [] : (adminStats?.transactions || []).filter((t:any) => t.booking?.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "payment_config" && <AdminPaymentConfig gateways={adminStats?.payment_gateways || []} branches={actualBranches || []} />}
          {activeTab === "properties" && <AdminProperties />}
          {activeTab === "web_settings" && (
            <>
              <AdminWebSettings settings={adminStats?.web_settings} />
              <AdminDiscountRules rules={adminStats?.discount_rules || []} />
            </>
          )}
          {activeTab === "social_links" && <AdminSocialLinks social={adminStats?.social_media} />}
          {activeTab === "faqs" && <AdminFaqs faqs={adminStats?.faqs} />}
          {activeTab === "rbac" && <AdminRBAC roles={adminStats?.roles || []} users={adminStats?.users || []} />}
          {activeTab === "templates" && <AdminNotificationTemplates templates={adminStats?.notification_templates || []} />}
          {activeTab === "queues" && <AdminNotificationLogs logs={adminStats?.notification_logs || []} />}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in">
              <h3 className="font-semibold text-slate-900 text-lg mb-6">Semua Notifikasi</h3>
              <div className="space-y-4">
                {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">Belum ada notifikasi.</div>
                ) : (
                  auth.user.notifications.map((notif: any) => (
                    <div key={notif.id} className={`p-4 rounded-xl border ${notif.read_at ? 'bg-slate-50 border-slate-100' : 'bg-white border-indigo-100 shadow-sm'}`}>
                      <div className="flex gap-3">
                        {!notif.read_at && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                        <div>
                          <p className={`text-sm ${notif.read_at ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>{notif.data?.message || 'Ada notifikasi baru'}</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "audit" && <AdminActivityLogs logs={adminStats?.activity_logs || []} />}
          {activeTab === "occupancy" && <AdminOccupancy branches={adminStats?.branches || []} units={selectedBranch === "all" ? adminStats?.room_units || [] : (adminStats?.room_units || []).filter((u:any) => u.room_type?.branch_id?.toString() === selectedBranch)} />}
          {activeTab === "reviews" && <AdminReviews reviews={selectedBranch === "all" ? adminStats?.reviews || [] : (adminStats?.reviews || []).filter((r:any) => r.branch_id?.toString() === selectedBranch)} branches={adminStats?.branches || []} />}
          {activeTab === "tickets" && <TicketDashboard user={user} />}
            </Suspense>
        </div>
      </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   OPERATOR DASHBOARD VIEW (Multi-Branch & Single-Branch)
 ───────────────────────────────────────────────────────────────────────────── */
const VALID_OPERATOR_TABS = [
  "dashboard", "branches", "categories", "facilities", "room_types", "room_map",
  "bookings", "contracts", "maintenance", "invoices", "transactions", "occupancy",
  "reviews", "tickets", "notifications", "templates", "queues"
];

function OperatorDashboardView({ user, stats }: { user: any; stats: any }) {
  const { url } = usePage();
  const { auth } = usePage().props as any;
  const adminStats = (usePage().props as any).admin_stats || {};
  const actualBranches = adminStats.branches || [];
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && VALID_OPERATOR_TABS.includes(tabParam)) {
        return tabParam;
      }
      const saved = sessionStorage.getItem('operator_tab');
      if (saved && VALID_OPERATOR_TABS.includes(saved)) {
        return saved;
      }
    }
    return "dashboard";
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        if (VALID_OPERATOR_TABS.includes(tabParam)) {
          setTab(tabParam);
          sessionStorage.setItem('operator_tab', tabParam);
        } else {
          setTab("dashboard");
          sessionStorage.setItem('operator_tab', 'dashboard');
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [url]);

  const [selectedBranch, setSelectedBranch] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('operator_tab', newTab);
      const newUrl = newTab === 'dashboard' ? '/dashboard' : `/dashboard?tab=${newTab}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const activeTab = VALID_OPERATOR_TABS.includes(tab) ? tab : "dashboard";



  const sidebarGroups = [
    {
      label: "Dashboard",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Analytics Utama" }
      ]
    },
    {
      label: "Master Data Properti",
      items: [
        { id: "categories", icon: Folder, label: "Kategori Kamar" },
        { id: "facilities", icon: Star, label: "Fasilitas Kamar" },
        { id: "room_types", icon: Building2, label: "Tipe Kamar" }
      ]
    },
    {
      label: "Operasional & Sewa",
      items: [
        { id: "bookings", icon: Calendar, label: "Semua Data Booking", badge: (adminStats?.pending_bookings > 0) ? adminStats.pending_bookings.toString() : undefined },
        { id: "contracts", icon: FileText, label: "Kontrak Sewa Aktif" },
        { id: "maintenance", icon: Wrench, label: "Manajemen Maintenance" }
      ]
    },
    {
      label: "Keuangan & Transaksi",
      items: [
        { id: "invoices", icon: Receipt, label: "Tagihan & Invoice", badge: (adminStats?.pending_payments > 0) ? adminStats.pending_payments.toString() : undefined },
        { id: "deposits", icon: DollarSign, label: "Manajemen Deposit" },
        { id: "transactions", icon: DollarSign, label: "Laporan Transaksi Global" }
      ]
    },
    {
      label: "Komunikasi & Notifikasi",
      items: [
        { id: "tickets", icon: MessageSquare, label: "Laporan & Bantuan (Tiket)", badge: (adminStats?.open_tickets > 0) ? adminStats.open_tickets.toString() : undefined },
        { id: "reviews", icon: Star, label: "Moderasi Review Cabang" }
      ]
    },
    {
      label: "Integrasi & Audit",
      items: [
        { id: "occupancy", icon: BarChart2, label: "Ringkasan Okupansi" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex pt-0 relative">
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-fade-in" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"} ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        {mobileOpen && (
          <div className="p-3 flex justify-end md:hidden border-b border-slate-100">
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-4">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <Avatar src={stats?.profile_photo_url || "https://ui-avatars.com/api/?name="+encodeURIComponent(user?.name || 'User')+"&background=random"} name={user?.name} size="md" />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider mb-0.5">{getRoleLabel(user?.roles)}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Switch Cabang Dropdown */}
        {!sidebarCollapsed ? (
          <div className="px-3 mb-4">
            <div className="relative p-2 flex items-center justify-between">
              <div className="w-full">
                <SearchableSelect 
                  value={selectedBranch}
                  onChange={val => setSelectedBranch(val)}
                  options={[
                    {label: 'Semua Cabang', value: 'all'},
                    ...(adminStats?.branches?.map((b: any) => ({ label: b.name, value: b.id.toString() })) || [])
                  ]}
                  className="!border-slate-200/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4" title={`Cabang: ${selectedBranch}`}>
            <MapPin size={18} className="text-indigo-600 mx-auto" />
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {sidebarGroups.map(group => (
            <div key={group.label} className="space-y-1">
              {!sidebarCollapsed ? (
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1">{group.label}</p>
              ) : (
                <div className="border-t border-slate-100 my-2 pt-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const commonProps = {
                    className: `w-full flex items-center justify-between rounded-xl text-sm font-medium transition-colors ${
                      sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
                    } ${tab === item.id ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`,
                    title: sidebarCollapsed ? item.label : undefined
                  };
                  
                  const content = (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon size={16} className={`flex-shrink-0 ${tab === item.id ? "text-indigo-600" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  );

                  if ((item as any).url) {
                    return (
                      <Link key={item.id} href={(item as any).url} {...commonProps}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button key={item.id} onClick={() => handleTabChange(item.id)} {...commonProps}>
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <Link
            href="/logout"
            method="post"
            as="button"
            className={`w-full flex items-center rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
              sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            }`}
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Keluar</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar Operator */}
        <div className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4 backdrop-blur-md sticky top-0 z-30 text-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile trigger using ChevronRight (>) instead of burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title="Buka Menu"
            >
              <ChevronRight size={20} />
            </button>

            {/* Desktop toggle for collapsing sidebar using > / < */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all duration-150 active:scale-95"
              title={sidebarCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 relative transition-all duration-150 cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={15} className="text-slate-500" />
                {auth?.user?.unread_notifications_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                    {auth.user.unread_notifications_count > 9 ? '9+' : auth.user.unread_notifications_count}
                  </span>
                )}
              </button>

              {showNotifPopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPopup(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-150 shadow-lg rounded-xl p-4 z-50 animate-fade-in text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-bold text-xs text-slate-700">Notifikasi Operator</span>
                      <div className="flex gap-2">
                        {auth?.user?.unread_notifications_count > 0 && (
                           <button 
                            onClick={() => {
                                router.post('/notifications/mark-all-as-read', {}, { preserveScroll: true });
                            }}
                            className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 hover:underline"
                           >
                            Tandai Dibaca
                           </button>
                        )}
                        <button 
                          onClick={() => { setTab('queues'); setShowNotifPopup(false); }}
                          className="text-[10px] font-semibold text-indigo-650 hover:underline"
                        >
                          Lihat Semua
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-500">Tidak ada notifikasi</div>
                      ) : (
                          auth.user.notifications.map((notif: any) => (
                              <div key={notif.id} className={`flex gap-2.5 items-start text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer ${notif.read_at ? 'opacity-70' : ''}`}>
                                {!notif.read_at && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <p className={`text-slate-800 ${notif.read_at ? '' : 'font-semibold'}`}>
                                      {notif.data?.message || 'Ada notifikasi baru'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                {!notif.read_at && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.post(`/notifications/${notif.id}/mark-as-read`, {}, { preserveScroll: true });
                                        }}
                                        className="text-[10px] text-indigo-500 hover:underline flex-shrink-0"
                                    >
                                        Tandai
                                    </button>
                                )}
                              </div>
                          ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || "Dashboard"}
            </h1>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
            
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const totalRooms = adminStats?.total_rooms || 0;
                    const filledRooms = adminStats?.filled_rooms || 0;
                    const vacantRooms = adminStats?.vacant_rooms || 0;
                    const occupancy = totalRooms > 0 ? Math.round((filledRooms / totalRooms) * 100) : 0;
                    const pendingBookings = adminStats?.bookings?.filter((b: any) => b.status === 'Pending')?.length || 0;
                    const maintenanceCount = 0;

                    return (
                      <>
                        <StatCard label="Tingkat Okupansi" value={`${occupancy}%`} icon={BarChart2} color="indigo" />
                        <StatCard label="Status Kamar" value={`${filledRooms} / ${totalRooms}`} icon={BedDouble} color="green" />
                        <StatCard label="Booking Pending" value={pendingBookings.toString()} icon={Calendar} color="amber" />
                        <StatCard label="Perlu Perbaikan" value={maintenanceCount.toString()} icon={Wrench} color="red" />
                      </>
                    )
                  })()}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Aktivitas Harian Terakhir</h3>
                  <div className="space-y-3">
                    {adminStats?.recent_transactions?.length > 0 ? (
                      adminStats.recent_transactions.slice(0, 3).map((trx: any) => (
                        <div key={trx.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-800">Pembayaran Kamar {trx.room_name}</p>
                            <p className="text-slate-400 mt-0.5">Penghuni: {trx.tenant_name} • {trx.method}</p>
                          </div>
                          <Badge variant={trx.status === 'paid' ? 'success' : trx.status === 'pending' ? 'warning' : 'default'}>
                            {trx.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-slate-400 py-4">Belum ada aktivitas harian</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "branches" && <AdminBranches branches={selectedBranch === "all" ? adminStats?.branches || [] : (adminStats?.branches || []).filter((b:any) => b.id.toString() === selectedBranch)} operators={adminStats?.operators || []} />}
            {activeTab === "categories" && <AdminCategories categories={selectedBranch === "all" ? adminStats?.room_categories || [] : (adminStats?.room_categories || []).filter((c:any) => !c.branch_id || c.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} />}
            {activeTab === "facilities" && <AdminFacilities facilities={selectedBranch === "all" ? adminStats?.facilities || [] : (adminStats?.facilities || []).filter((f:any) => !f.branch_id || f.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} />}
            {activeTab === "room_types" && <AdminRoomTypes roomTypes={selectedBranch === "all" ? adminStats?.room_types || [] : (adminStats?.room_types || []).filter((r:any) => r.branch_id?.toString() === selectedBranch)} branches={actualBranches || []} categories={adminStats?.room_categories || []} facilities={adminStats?.facilities || []} />}
            {activeTab === "bookings" && <AdminBookings bookings={selectedBranch === "all" ? adminStats?.bookings || [] : (adminStats?.bookings || []).filter((b:any) => b.branch_id?.toString() === selectedBranch)} branches={adminStats?.branches || []} roomTypes={adminStats?.room_types || []} users={adminStats?.users || []} />}
            {activeTab === "contracts" && <AdminContracts contracts={selectedBranch === "all" ? adminStats?.contracts || [] : (adminStats?.contracts || []).filter((c:any) => c.branch_id?.toString() === selectedBranch)} />}
            {activeTab === "maintenance" && <AdminMaintenance units={selectedBranch === "all" ? adminStats?.room_units || [] : (adminStats?.room_units || []).filter((u:any) => u.room_type?.branch_id?.toString() === selectedBranch)} />}

            {activeTab === "room_map" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in">
                <h3 className="font-semibold text-slate-900 text-lg mb-4">Peta Status Unit Kamar ({selectedBranch})</h3>
                <div className="flex gap-4 mb-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded" /> Available (8)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded" /> Occupied (40)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded" /> Maintenance (2)</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {Array.from({ length: 50 }).map((_, i) => {
                    const status = i === 12 || i === 34 ? 'maintenance' : i % 6 === 0 ? 'available' : 'occupied';
                    const colors = {
                      available: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                      occupied: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                      maintenance: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    };
                    return (
                      <div 
                        key={i} 
                        className={`border rounded-xl p-3 text-center text-xs font-bold transition-colors cursor-pointer ${colors[status]}`}
                        title={`Kamar ${i + 101} - Status: ${status}`}
                      >
                        {i + 101}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "invoices" && <AdminInvoices invoices={selectedBranch === "all" ? adminStats?.invoices || [] : (adminStats?.invoices || []).filter((i:any) => i.booking?.branch_id?.toString() === selectedBranch)} />}
            {activeTab === "transactions" && <AdminTransactions transactions={selectedBranch === "all" ? adminStats?.transactions || [] : (adminStats?.transactions || []).filter((t:any) => t.booking?.branch_id?.toString() === selectedBranch)} />}
            {activeTab === "occupancy" && <AdminOccupancy branches={adminStats?.branches || []} units={selectedBranch === "all" ? adminStats?.room_units || [] : (adminStats?.room_units || []).filter((u:any) => u.room_type?.branch_id?.toString() === selectedBranch)} />}
            {activeTab === "reviews" && <AdminReviews reviews={selectedBranch === "all" ? adminStats?.reviews || [] : (adminStats?.reviews || []).filter((r:any) => r.branch_id?.toString() === selectedBranch)} branches={adminStats?.branches || []} />}
            {activeTab === "tickets" && <TicketDashboard user={user} />}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in">
                <h3 className="font-semibold text-slate-900 text-lg mb-6">Semua Notifikasi</h3>
                <div className="space-y-4">
                  {!auth?.user?.notifications || auth.user.notifications.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">Belum ada notifikasi.</div>
                  ) : (
                    auth.user.notifications.map((notif: any) => (
                      <div key={notif.id} className={`p-4 rounded-xl border ${notif.read_at ? 'bg-slate-50 border-slate-100' : 'bg-white border-indigo-100 shadow-sm'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            {!notif.read_at && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                            <div>
                              <p className={`text-sm ${notif.read_at ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>{notif.data?.message || 'Ada notifikasi baru'}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!["dashboard", "branches", "categories", "facilities", "room_types", "room_map", "bookings", "contracts", "maintenance", "invoices", "transactions", "occupancy", "reviews", "tickets", "notifications", "templates", "queues"].includes(activeTab) && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center animate-fade-in">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {(() => { const Item = sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab); return Item ? <Item.icon size={24} className="text-slate-400" /> : null; })()}
                </div>
                <p className="text-slate-400 text-sm">Modul sedang disiapkan oleh tim pengembang CozQta.</p>
              </div>
            )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
