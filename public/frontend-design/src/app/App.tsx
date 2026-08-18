import { useState, useEffect, type ReactNode } from "react";
import {
  Home, Star, Heart, MapPin, Search, ChevronDown, ChevronRight, ChevronLeft,
  X, Menu, Bell, User, Settings, LogOut, BarChart2, CreditCard, Calendar,
  Clock, Check, CheckCircle2, Download, Plus, Trash2, Edit, Eye, Filter,
  Grid, List, Wifi, Car, Coffee, Tv, Wind, Shield, Users, DollarSign,
  TrendingUp, TrendingDown, ArrowRight, BedDouble, Timer, Building2,
  Package, Bookmark, LayoutDashboard, Receipt, Layers, MoreHorizontal,
  Phone, Mail, MessageSquare, FileText, HelpCircle, Bath, Globe, Zap,
  AlertCircle, RefreshCw, Lock, Info, Tag, Percent, QrCode, Building,
  ChevronUp
} from "lucide-react";
import {
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const ROOMS = [
  { id: 1, name: "Kost Premium Menteng A1", address: "Jl. Menteng Raya No. 12, Jakarta Pusat", price: 2500000, rating: 4.8, reviews: 127, type: "Campur", owner: "Budi Santoso", ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format", available: true, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir", "TV"], size: 16, floor: 2, building: "Gedung A", status: "Terisi" },
  { id: 2, name: "Kost Exclusive BSD City B3", address: "Jl. Pahlawan Seribu No. 5, Tangerang Selatan", price: 1800000, rating: 4.6, reviews: 89, type: "Putri", owner: "Sari Dewi", ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format", available: true, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Laundry"], size: 14, floor: 1, building: "Gedung B", status: "Tersedia" },
  { id: 3, name: "Kost Modern Kemang C2", address: "Jl. Kemang Raya No. 88, Jakarta Selatan", price: 3200000, rating: 4.9, reviews: 203, type: "Campur", owner: "Rudi Hartanto", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&auto=format", available: false, image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir", "TV", "Kulkas"], size: 20, floor: 3, building: "Gedung C", status: "Terisi" },
  { id: 4, name: "Kost Nyaman Depok D5", address: "Jl. Margonda Raya No. 45, Depok", price: 1200000, rating: 4.4, reviews: 56, type: "Putra", owner: "Agus Wijaya", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format", available: true, image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Luar"], size: 12, floor: 1, building: "Gedung D", status: "Tersedia" },
  { id: 5, name: "Kost Elegan Sudirman E1", address: "Jl. Jend. Sudirman No. 21, Jakarta Pusat", price: 4000000, rating: 4.9, reviews: 312, type: "Campur", owner: "Diana Putri", ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&auto=format", available: true, image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir", "TV", "Gym"], size: 24, floor: 5, building: "Gedung E", status: "Tersedia" },
  { id: 6, name: "Kost Cozy Bogor F3", address: "Jl. Pajajaran No. 7, Bogor Tengah", price: 900000, rating: 4.3, reviews: 41, type: "Putri", owner: "Yuni Saputri", ownerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&auto=format", available: true, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=640&h=420&fit=crop&auto=format", facilities: ["WiFi", "AC", "Kamar Mandi Luar", "Dapur Bersama"], size: 10, floor: 1, building: "Gedung F", status: "Tersedia" },
];

const TESTIMONIALS = [
  { id: 1, name: "Anisa Rahayu", role: "Mahasiswa UI", avatar: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=64&h=64&fit=crop&auto=format", text: "KostHub sangat membantu saya menemukan kost idaman dekat kampus. Prosesnya mudah, cepat, dan transparan. Sangat recommended!", rating: 5, date: "Desember 2024" },
  { id: 2, name: "Rizky Firmansyah", role: "Karyawan Swasta", avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=64&h=64&fit=crop&auto=format", text: "Fitur pencarian dan filter sangat membantu. Bisa pilih berdasarkan fasilitas dan harga. Admin juga responsif dan profesional.", rating: 5, date: "November 2024" },
  { id: 3, name: "Putri Handayani", role: "Fresh Graduate", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&auto=format", text: "Booking kost jadi jauh lebih mudah dengan KostHub. Pembayaran aman, bisa pakai berbagai metode. Pemilik kost juga terpercaya.", rating: 5, date: "Oktober 2024" },
];

const FAQ_ITEMS = [
  { q: "Bagaimana cara memesan kost di KostHub?", a: "Pilih kost yang Anda suka, klik 'Pesan Sekarang', isi form pemesanan, pilih metode pembayaran, dan konfirmasi. Proses hanya 5 menit!" },
  { q: "Apakah ada biaya admin untuk pemesanan?", a: "Kami mengenakan biaya admin sebesar Rp 25.000 per transaksi untuk menjamin keamanan dan kelancaran proses pemesanan Anda." },
  { q: "Metode pembayaran apa saja yang tersedia?", a: "Kami mendukung QRIS, Virtual Account, Kartu Kredit/Debit, GoPay, OVO, DANA, ShopeePay, dan Transfer Bank." },
  { q: "Bisakah saya melihat kost sebelum booking?", a: "Ya! Anda bisa menghubungi pemilik kost melalui fitur Chat Owner untuk mengatur jadwal kunjungan sebelum melakukan pemesanan." },
  { q: "Apa yang terjadi jika saya ingin membatalkan pesanan?", a: "Kebijakan pembatalan tergantung pada ketentuan pemilik kost. Sebagian besar kost kami menawarkan pembatalan gratis dalam 24 jam pertama." },
];

const REVENUE_DATA = [
  { month: "Jul", revenue: 128000000, target: 110000000 },
  { month: "Agu", revenue: 142000000, target: 125000000 },
  { month: "Sep", revenue: 135000000, target: 130000000 },
  { month: "Okt", revenue: 168000000, target: 150000000 },
  { month: "Nov", revenue: 174000000, target: 160000000 },
  { month: "Des", revenue: 193000000, target: 175000000 },
  { month: "Jan", revenue: 187000000, target: 180000000 },
];

const OCCUPANCY_DATA = [
  { name: "Terisi", value: 847, color: "#4F46E5" },
  { name: "Tersedia", value: 213, color: "#22C55E" },
  { name: "Maintenance", value: 32, color: "#F59E0B" },
];

const BOOKING_DATA = [
  { day: "Sen", bookings: 24 },
  { day: "Sel", bookings: 31 },
  { day: "Rab", bookings: 28 },
  { day: "Kam", bookings: 42 },
  { day: "Jum", bookings: 38 },
  { day: "Sab", bookings: 55 },
  { day: "Min", bookings: 19 },
];

const TRANSACTIONS = [
  { id: "TRX-2024-001", tenant: "Anisa Rahayu", room: "Menteng A1", amount: 2500000, date: "25 Jan 2025", status: "Lunas", method: "GoPay" },
  { id: "TRX-2024-002", tenant: "Rizky Firmansyah", room: "Kemang C2", amount: 3200000, date: "24 Jan 2025", status: "Pending", method: "Transfer Bank" },
  { id: "TRX-2024-003", tenant: "Dewi Anggraeni", room: "BSD B3", amount: 1800000, date: "23 Jan 2025", status: "Lunas", method: "QRIS" },
  { id: "TRX-2024-004", tenant: "Hendra Kusuma", room: "Sudirman E1", amount: 4000000, date: "22 Jan 2025", status: "Gagal", method: "Credit Card" },
  { id: "TRX-2024-005", tenant: "Siti Nurhaliza", room: "Depok D5", amount: 1200000, date: "21 Jan 2025", status: "Lunas", method: "OVO" },
];

const TENANTS = [
  { id: 1, name: "Anisa Rahayu", room: "Menteng A1", since: "Jan 2025", until: "Jan 2026", status: "Aktif", avatar: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=40&h=40&fit=crop&auto=format" },
  { id: 2, name: "Rizky Firmansyah", room: "Kemang C2", since: "Des 2024", until: "Des 2025", status: "Aktif", avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=40&h=40&fit=crop&auto=format" },
  { id: 3, name: "Dewi Anggraeni", room: "BSD B3", since: "Nov 2024", until: "Nov 2025", status: "Aktif", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format" },
  { id: 4, name: "Hendra Kusuma", room: "Sudirman E1", since: "Okt 2024", until: "Okt 2025", status: "Aktif", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const fmtShort = (n: number) => n >= 1000000 ? `Rp ${(n / 1000000).toFixed(1)}jt` : `Rp ${(n / 1000).toFixed(0)}rb`;
const fmtRevenue = (n: number) => `Rp ${(n / 1000000).toFixed(0)}jt`;

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "warning" | "danger" | "outline" | "purple" }) {
  const variants = {
    default: "bg-indigo-50 text-indigo-700 border-indigo-100",
    success: "bg-green-50 text-green-700 border-green-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-red-50 text-red-700 border-red-100",
    outline: "bg-white text-slate-600 border-slate-200",
    purple: "bg-violet-50 text-violet-700 border-violet-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, className = "", disabled = false }: {
  children: ReactNode; variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg"; onClick?: () => void; className?: string; disabled?: boolean;
}) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "hover:bg-slate-100 text-slate-600",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-150 ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      {children}
    </button>
  );
}

function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold`}>{initials}</div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Lunas": "success", "Paid": "success", "Aktif": "success", "Tersedia": "success",
    "Pending": "warning", "Terisi": "default",
    "Gagal": "danger", "Expired": "danger", "Nonaktif": "danger",
    "Maintenance": "warning",
  };
  return <Badge variant={(map[status] as any) || "outline"}>{status}</Badge>;
}

// ─── ROOM CARD ──────────────────────────────────────────────────────────────────

function RoomCard({ room, onView, wishlist, toggleWish }: { room: typeof ROOMS[0]; onView: () => void; wishlist: Set<number>; toggleWish: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img src={room.image} alt={room.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button onClick={() => toggleWish(room.id)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all">
          <Heart size={16} className={wishlist.has(room.id) ? "text-red-500 fill-red-500" : "text-slate-500"} />
        </button>
        <div className="absolute top-3 left-3 flex gap-2">
          {room.available ? <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Tersedia</Badge> : <Badge variant="danger">Terisi</Badge>}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline">{room.type}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 mb-1">{room.name}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <MapPin size={11} /><span className="line-clamp-1">{room.address}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-indigo-600 font-bold text-base">{fmtShort(room.price)}</p>
            <p className="text-slate-400 text-xs">/ bulan</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-800">{room.rating}</span>
              <span className="text-xs text-slate-400">({room.reviews})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Avatar src={room.ownerAvatar} name={room.owner} size="sm" />
          <span className="text-xs text-slate-500">oleh <span className="text-slate-700 font-medium">{room.owner}</span></span>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm" onClick={onView} className="flex-1 justify-center">
            <Eye size={14} /> Detail
          </Btn>
          <Btn variant="primary" size="sm" onClick={onView} className="flex-1 justify-center">
            Pesan <ArrowRight size={14} />
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, change, icon: Icon, color = "indigo" }: { label: string; value: string; change?: string; icon: any; color?: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-violet-50 text-violet-600",
  };
  const positive = change && change.startsWith("+");
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────

function Navbar({ view, setView }: { view: string; setView: (v: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const nav = ["Home", "Kamar", "Fasilitas", "Harga", "Kontak"];
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setView("landing")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className={`font-bold text-xl ${scrolled || view !== "landing" ? "text-slate-900" : "text-white"}`}>KostHub</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(item => (
              <button key={item} className={`px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors ${scrolled ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900" : "text-white/80 hover:text-white"}`}>
                {item}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Btn variant="outline" size="sm" onClick={() => setView("login")}>Masuk</Btn>
            <Btn variant="primary" size="sm" onClick={() => setView("register")}>Daftar</Btn>
          </div>
          <button className={`md:hidden p-2 rounded-lg ${scrolled ? "text-slate-700" : "text-white"}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {nav.map(item => <button key={item} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">{item}</button>)}
            <div className="flex gap-2 pt-2">
              <Btn variant="outline" size="sm" onClick={() => { setView("login"); setMobileOpen(false); }} className="flex-1 justify-center">Masuk</Btn>
              <Btn variant="primary" size="sm" onClick={() => { setView("register"); setMobileOpen(false); }} className="flex-1 justify-center">Daftar</Btn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────────

function HeroSection({ setView, searchState, setSearchState }: {
  setView: (v: string) => void;
  searchState: any; setSearchState: (s: any) => void;
}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const roomTypes = ["Semua", "Putra", "Putri", "Campur"];
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=900&fit=crop&auto=format" alt="Modern apartment interior" className="w-full h-full object-cover bg-slate-800" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-slate-900/75 to-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">1.200+ kamar tersedia sekarang</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Temukan Kost<br />
            <span className="text-indigo-300">Impianmu</span> Sekarang
          </h1>
          <p className="text-lg text-white/70 max-w-xl leading-relaxed">
            Platform terpercaya untuk mencari dan mengelola kost di seluruh Indonesia. Mudah, aman, dan transparan.
          </p>
        </div>
        <div className="flex gap-8 mb-10">
          {[{ v: "10K+", l: "Kamar Terdaftar" }, { v: "50K+", l: "Penghuni Puas" }, { v: "4.8", l: "Rating Rata-rata" }, { v: "500+", l: "Properti" }].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold text-white">{s.v}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl">
          <h2 className="text-slate-900 font-semibold text-base mb-4 flex items-center gap-2">
            <Search size={18} className="text-indigo-600" /> Cari Kamar Kost
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Lokasi</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={searchState.location} onChange={e => setSearchState({ ...searchState, location: e.target.value })}
                  placeholder="Jakarta, Bandung, Surabaya..." className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Harga Maks</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={searchState.maxPrice} onChange={e => setSearchState({ ...searchState, maxPrice: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Semua Harga</option>
                  <option value="1000000">s/d Rp 1jt</option>
                  <option value="2000000">s/d Rp 2jt</option>
                  <option value="3000000">s/d Rp 3jt</option>
                  <option value="5000000">s/d Rp 5jt</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Tipe Kamar</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={searchState.type} onChange={e => setSearchState({ ...searchState, type: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Fasilitas</label>
              <div className="relative">
                <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={searchState.facility} onChange={e => setSearchState({ ...searchState, facility: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Semua Fasilitas</option>
                  <option value="wifi">WiFi</option>
                  <option value="ac">AC</option>
                  <option value="parkir">Parkir</option>
                  <option value="dapur">Dapur</option>
                  <option value="gym">Gym</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors ${searchState.available ? "bg-indigo-600" : "bg-slate-200"}`}
                onClick={() => setSearchState({ ...searchState, available: !searchState.available })}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ${searchState.available ? "translate-x-5.5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-600 font-medium">Tersedia Sekarang</span>
            </label>
            <Btn variant="primary" size="md" onClick={() => setView("rooms")} className="px-8">
              <Search size={16} /> Cari Kamar
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED ROOMS ─────────────────────────────────────────────────────────────

function FeaturedRooms({ setView, wishlist, toggleWish }: { setView: (v: string) => void; wishlist: Set<number>; toggleWish: (id: number) => void }) {
  const [filter, setFilter] = useState("Semua");
  const types = ["Semua", "Putra", "Putri", "Campur"];
  const filtered = filter === "Semua" ? ROOMS : ROOMS.filter(r => r.type === filter);
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-indigo-600 text-sm font-semibold mb-2 uppercase tracking-wide">Kamar Pilihan</p>
            <h2 className="text-3xl font-bold text-slate-900">Kost Terfavorit</h2>
            <p className="text-slate-500 mt-2">Dipilih berdasarkan rating tertinggi dan ulasan terbaik</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === t ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(room => <RoomCard key={room.id} room={room} onView={() => setView("room-detail")} wishlist={wishlist} toggleWish={toggleWish} />)}
        </div>
        <div className="text-center mt-10">
          <Btn variant="outline" size="lg" onClick={() => setView("rooms")}>
            Lihat Semua Kamar <ArrowRight size={18} />
          </Btn>
        </div>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ──────────────────────────────────────────────────────────────

function WhyChooseUs() {
  const items = [
    { icon: Shield, color: "indigo", title: "100% Terverifikasi", desc: "Setiap properti diverifikasi langsung oleh tim KostHub untuk memastikan keamanan dan kenyamanan." },
    { icon: Zap, color: "amber", title: "Booking Instan", desc: "Proses pemesanan hanya 5 menit. Konfirmasi langsung, tidak perlu menunggu lama." },
    { icon: CreditCard, color: "green", title: "Pembayaran Aman", desc: "Transaksi terlindungi dengan enkripsi SSL. Mendukung 8+ metode pembayaran terpopuler." },
    { icon: MessageSquare, color: "purple", title: "Dukungan 24/7", desc: "Tim support kami siap membantu kapan saja melalui chat, telepon, atau email." },
  ];
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-violet-50 text-violet-600",
  };
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-indigo-600 text-sm font-semibold mb-2 uppercase tracking-wide">Keunggulan Kami</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Mengapa Pilih KostHub?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Platform manajemen kost terlengkap dengan teknologi terkini untuk kenyamanan Anda</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.title} className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className={`w-14 h-14 rounded-2xl ${colorMap[item.color]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-20 bg-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-indigo-200 text-sm font-semibold mb-2 uppercase tracking-wide">Testimoni</p>
          <h2 className="text-3xl font-bold text-white mb-3">Kata Mereka Tentang KostHub</h2>
          <p className="text-indigo-200 max-w-xl mx-auto">Ribuan penghuni puas telah menemukan rumah kedua mereka melalui KostHub</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="text-amber-300 fill-amber-300" />)}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar src={t.avatar} name={t.name} size="md" />
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-indigo-200 text-xs">{t.role} · {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PAYMENT PARTNERS ───────────────────────────────────────────────────────────

function PaymentPartners() {
  const partners = ["QRIS", "Visa", "Mastercard", "GoPay", "OVO", "DANA", "ShopeePay", "Transfer Bank"];
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-400 text-sm font-medium mb-8 uppercase tracking-widest">Metode Pembayaran Tersedia</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {partners.map(p => (
            <div key={p} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-indigo-600 text-sm font-semibold mb-2 uppercase tracking-wide">FAQ</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Pertanyaan Umum</h2>
          <p className="text-slate-500">Semua yang perlu Anda ketahui tentang KostHub</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4">
                <span className="font-medium text-slate-900 text-sm">{item.q}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────────

function Footer({ setView }: { setView: (v: string) => void }) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <span className="font-bold text-xl">KostHub</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">Platform manajemen kost terpercaya di Indonesia. Temukan, pesan, dan kelola kost dengan mudah.</p>
            <div className="flex gap-3">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: ["Cari Kamar", "Daftarkan Properti", "Harga", "Blog"] },
            { title: "Dukungan", links: ["Pusat Bantuan", "Panduan Booking", "Hubungi Kami", "Status Sistem"] },
            { title: "Legal", links: ["Syarat & Ketentuan", "Kebijakan Privasi", "Kebijakan Cookie"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}><button className="text-slate-400 hover:text-white text-sm transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2025 KostHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("admin-dashboard")} className="text-slate-500 hover:text-indigo-400 text-xs transition-colors">Admin Dashboard</button>
            <span className="text-slate-700">·</span>
            <button onClick={() => setView("user-dashboard")} className="text-slate-500 hover:text-indigo-400 text-xs transition-colors">User Dashboard</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────────

function LandingPage({ setView, wishlist, toggleWish }: { setView: (v: string) => void; wishlist: Set<number>; toggleWish: (id: number) => void }) {
  const [searchState, setSearchState] = useState({ location: "", maxPrice: "", type: "Semua", facility: "", available: true });
  return (
    <div>
      <HeroSection setView={setView} searchState={searchState} setSearchState={setSearchState} />
      <FeaturedRooms setView={setView} wishlist={wishlist} toggleWish={toggleWish} />
      <WhyChooseUs />
      <Testimonials />
      <PaymentPartners />
      <FAQSection />
      <Footer setView={setView} />
    </div>
  );
}

// ─── ROOM DETAIL ────────────────────────────────────────────────────────────────

function RoomDetailPage({ setView }: { setView: (v: string) => void }) {
  const room = ROOMS[0];
  const [activeImg, setActiveImg] = useState(0);
  const imgs = [room.image, ROOMS[1].image, ROOMS[2].image, ROOMS[3].image];
  const facilityIcons: Record<string, any> = { WiFi: Wifi, AC: Wind, TV: Tv, Parkir: Car, Kulkas: Package, Gym: Zap, "Kamar Mandi Dalam": Bath, "Kamar Mandi Luar": Bath, Laundry: RefreshCw, "Dapur Bersama": Coffee };
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => setView("landing")} className="hover:text-indigo-600">Home</button>
          <ChevronRight size={14} />
          <span>Kamar</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{room.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img src={imgs[activeImg]} alt={room.name} className="w-full h-72 sm:h-96 object-cover bg-slate-100" />
              <div className="p-4 flex gap-2 overflow-x-auto">
                {imgs.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                    className={`w-20 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 bg-slate-100 transition-all ${activeImg === i ? "ring-2 ring-indigo-600" : "opacity-70 hover:opacity-100"}`} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="success"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Tersedia</Badge>
                    <Badge variant="outline">{room.type}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{room.name}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm"><MapPin size={14} />{room.address}</div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">{fmtShort(room.price)}</p>
                  <p className="text-slate-400 text-sm">/ bulan</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-800">{room.rating}</span>
                    <span className="text-slate-400 text-sm">({room.reviews} ulasan)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 my-4">
                {[{ icon: BedDouble, label: "Ukuran", val: `${room.size} m²` }, { icon: Layers, label: "Lantai", val: `Lantai ${room.floor}` }, { icon: Building, label: "Gedung", val: room.building }].map(info => (
                  <div key={info.label} className="text-center">
                    <info.icon size={20} className="mx-auto text-indigo-500 mb-1" />
                    <p className="text-xs text-slate-400">{info.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{info.val}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Fasilitas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.facilities.map(f => {
                  const Icon = facilityIcons[f] || Package;
                  return (
                    <div key={f} className="flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl text-sm text-indigo-700">
                      <Icon size={14} />{f}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Lokasi</h3>
              <div className="bg-slate-100 rounded-xl h-52 flex items-center justify-center text-slate-400 border border-slate-200">
                <div className="text-center"><MapPin size={32} className="mx-auto mb-2 text-slate-300" /><p className="text-sm">Google Maps</p><p className="text-xs text-slate-400">{room.address}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Kamar Serupa</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROOMS.slice(1, 3).map(r => (
                  <div key={r.id} className="flex gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer" onClick={() => setView("room-detail")}>
                    <img src={r.image} alt={r.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-slate-100" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm line-clamp-1">{r.name}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{r.address}</p>
                      <p className="text-indigo-600 font-semibold text-sm mt-1">{fmtShort(r.price)}/bln</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                <Avatar src={room.ownerAvatar} name={room.owner} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900">{room.owner}</p>
                  <p className="text-xs text-slate-400">Pemilik Kost · Bergabung 2022</p>
                  <div className="flex items-center gap-1 mt-0.5"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-xs font-medium text-slate-700">4.9 · 312 ulasan</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <Btn variant="primary" size="lg" onClick={() => setView("booking")} className="w-full justify-center">
                  <Calendar size={18} /> Pesan Sekarang
                </Btn>
                <Btn variant="outline" size="lg" className="w-full justify-center">
                  <MessageSquare size={18} /> Chat Pemilik
                </Btn>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2">
                <Shield size={14} className="text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">Properti ini telah diverifikasi oleh KostHub</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING FLOW ───────────────────────────────────────────────────────────────

function BookingPage({ setView }: { setView: (v: string) => void }) {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(1);
  const steps = ["Pilih Kamar", "Durasi Sewa", "Pembayaran", "Konfirmasi", "Selesai"];
  const room = ROOMS[0];
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
            <div className="absolute top-5 left-0 h-0.5 bg-indigo-600 -z-10 transition-all" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${i + 1 < step ? "bg-indigo-600 border-indigo-600 text-white" : i + 1 === step ? "bg-white border-indigo-600 text-indigo-600" : "bg-white border-slate-200 text-slate-400"}`}>
                  {i + 1 < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? "text-indigo-600" : "text-slate-400"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Kamar yang Dipilih</h2>
              <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                <img src={room.image} alt={room.name} className="w-24 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{room.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} />{room.address}</p>
                  <p className="text-indigo-600 font-bold mt-2">{fmtShort(room.price)}/bulan</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tanggal Masuk</label>
                  <input type="date" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="2025-02-01" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nama Lengkap</label>
                  <input placeholder="Masukkan nama lengkap" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <Btn variant="primary" size="lg" onClick={() => setStep(2)} className="w-full justify-center">Lanjutkan <ChevronRight size={18} /></Btn>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Pilih Durasi Sewa</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 3, 6, 12, 18, 24].map(m => (
                  <button key={m} onClick={() => setDuration(m)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${duration === m ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-slate-200"}`}>
                    <p className="text-lg font-bold text-slate-900">{m}</p>
                    <p className="text-xs text-slate-500">bulan</p>
                    {m >= 6 && <p className="text-xs text-green-600 font-medium mt-1">Hemat {m >= 12 ? "15%" : "10%"}</p>}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Harga per bulan</span><span className="font-medium">{fmtShort(room.price)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Durasi</span><span className="font-medium">{duration} bulan</span></div>
                {duration >= 6 && <div className="flex justify-between text-sm text-green-600"><span>Diskon {duration >= 12 ? "15%" : "10%"}</span><span>-{fmtShort(room.price * duration * (duration >= 12 ? 0.15 : 0.1))}</span></div>}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-indigo-600">{fmtShort(room.price * duration * (duration >= 12 ? 0.85 : duration >= 6 ? 0.9 : 1))}</span></div>
              </div>
              <div className="flex gap-3">
                <Btn variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1 justify-center"><ChevronLeft size={18} /> Kembali</Btn>
                <Btn variant="primary" size="lg" onClick={() => setView("payment")} className="flex-1 justify-center">Bayar Sekarang <ChevronRight size={18} /></Btn>
              </div>
            </div>
          )}
          {(step === 3 || step === 4 || step === 5) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Booking Berhasil!</h2>
              <p className="text-slate-500 mb-6">Pesanan Anda telah diterima dan sedang diproses</p>
              <Btn variant="primary" size="lg" onClick={() => setView("landing")} className="justify-center">Kembali ke Beranda</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT PAGE ───────────────────────────────────────────────────────────────

function PaymentPage({ setView }: { setView: (v: string) => void }) {
  const [method, setMethod] = useState("qris");
  const [status, setStatus] = useState<"pending" | "paid" | "failed">("pending");
  const [countdown, setCountdown] = useState(900);
  useEffect(() => {
    if (status !== "pending") return;
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [status]);
  const mins = Math.floor(countdown / 60).toString().padStart(2, "0");
  const secs = (countdown % 60).toString().padStart(2, "0");
  const room = ROOMS[0];
  const methods = [
    { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan QR Code" },
    { id: "va", label: "Virtual Account", icon: Building, desc: "BCA, Mandiri, BNI" },
    { id: "cc", label: "Kartu Kredit", icon: CreditCard, desc: "Visa / Mastercard" },
    { id: "gopay", label: "GoPay", icon: Zap, desc: "Dompet Digital" },
    { id: "ovo", label: "OVO", icon: Zap, desc: "Dompet Digital" },
    { id: "dana", label: "DANA", icon: Zap, desc: "Dompet Digital" },
    { id: "shopee", label: "ShopeePay", icon: Tag, desc: "Dompet Digital" },
    { id: "transfer", label: "Transfer Bank", icon: Receipt, desc: "Manual Transfer" },
  ];
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Pembayaran</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Pilih Metode Pembayaran</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {methods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${method === m.id ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-slate-200"}`}>
                    <m.icon size={18} className={`mx-auto mb-1 ${method === m.id ? "text-indigo-600" : "text-slate-500"}`} />
                    <p className={`text-xs font-medium ${method === m.id ? "text-indigo-700" : "text-slate-700"}`}>{m.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              {method === "qris" && (
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900 mb-1">Scan QR Code</h3>
                  <p className="text-sm text-slate-500 mb-4">Gunakan aplikasi e-wallet apapun untuk scan QR ini</p>
                  <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <div className="grid grid-cols-5 grid-rows-5 gap-1 w-32 h-32">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? "bg-slate-900" : "bg-white"}`} />
                      ))}
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${countdown > 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                    <Timer size={14} /> Kadaluarsa dalam {mins}:{secs}
                  </div>
                </div>
              )}
              {method === "va" && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Virtual Account</h3>
                  {["BCA", "Mandiri", "BNI", "BRI"].map(bank => (
                    <div key={bank} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl mb-2">
                      <span className="font-medium text-sm text-slate-700">{bank}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-slate-900">8877 0012 3456 789</span>
                        <button className="text-indigo-600 text-xs hover:underline">Salin</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!["qris", "va"].includes(method) && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CreditCard size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-slate-600 text-sm">Lanjutkan ke halaman {methods.find(m => m.id === method)?.label}</p>
                  <Btn variant="primary" size="md" className="mt-3" onClick={() => setStatus("paid")}>Bayar Sekarang</Btn>
                </div>
              )}
            </div>
            {status === "paid" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                <CheckCircle2 size={32} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Pembayaran Berhasil!</p>
                  <p className="text-sm text-green-600">Konfirmasi dikirim ke email Anda</p>
                </div>
                <Btn variant="outline" size="sm" className="ml-auto flex-shrink-0"><Download size={14} /> Invoice</Btn>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
              <h3 className="font-semibold text-slate-900 mb-4">Ringkasan Pesanan</h3>
              <div className="flex gap-3 mb-4 pb-4 border-b border-slate-100">
                <img src={room.image} alt={room.name} className="w-16 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 text-sm line-clamp-1">{room.name}</p>
                  <p className="text-xs text-slate-400">3 bulan · Feb–Apr 2025</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between"><span className="text-slate-500">Sewa 3 bulan</span><span>Rp 7.500.000</span></div>
                <div className="flex justify-between text-green-600"><span className="flex items-center gap-1"><Tag size={12} /> Voucher KOST10</span><span>-Rp 250.000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Biaya Admin</span><span>Rp 25.000</span></div>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-indigo-600">Rp 7.275.000</span>
              </div>
              <div className="mt-4">
                <div className="flex gap-2">
                  <input placeholder="Kode voucher" className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <Btn variant="secondary" size="sm">Pakai</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ─────────────────────────────────────────────────────────────────

function LoginPage({ setView }: { setView: (v: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang Kembali</h1>
          <p className="text-slate-500 text-sm">Masuk ke akun KostHub Anda</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
              <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="email@example.com" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded" /> Ingat saya
              </label>
              <button className="text-sm text-indigo-600 hover:underline">Lupa password?</button>
            </div>
            <Btn variant="primary" size="lg" onClick={() => setView("user-dashboard")} className="w-full justify-center">Masuk</Btn>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Belum punya akun? <button onClick={() => setView("register")} className="text-indigo-600 font-medium hover:underline">Daftar sekarang</button></p>
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => setView("admin-dashboard")} className="text-xs text-slate-400 hover:text-slate-600">→ Login sebagai Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ setView }: { setView: (v: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm">Bergabung dengan ribuan pengguna KostHub</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nama Depan</label>
                <input placeholder="Budi" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nama Belakang</label>
                <input placeholder="Santoso" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
              <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="email@example.com" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nomor HP</label>
              <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="+62 812 3456 7890" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="Min. 8 karakter" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <Btn variant="primary" size="lg" onClick={() => setView("user-dashboard")} className="w-full justify-center">Daftar Sekarang</Btn>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Sudah punya akun? <button onClick={() => setView("login")} className="text-indigo-600 font-medium hover:underline">Masuk</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ─────────────────────────────────────────────────────────────

function UserDashboard({ setView }: { setView: (v: string) => void }) {
  const [tab, setTab] = useState("dashboard");
  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "bookings", icon: Calendar, label: "Pemesanan Saya" },
    { id: "payments", icon: CreditCard, label: "Riwayat Bayar" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "notifications", icon: Bell, label: "Notifikasi" },
    { id: "messages", icon: MessageSquare, label: "Pesan" },
    { id: "profile", icon: User, label: "Profil" },
    { id: "settings", icon: Settings, label: "Pengaturan" },
  ];
  return (
    <div className="min-h-screen bg-slate-50 flex pt-0">
      <aside className="w-64 bg-white border-r border-slate-100 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-4 border-b border-slate-100">
          <button onClick={() => setView("landing")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={16} className="text-white" /></div>
            <span className="font-bold text-slate-900">KostHub</span>
          </button>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar src="https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=40&h=40&fit=crop&auto=format" name="Anisa Rahayu" size="md" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Anisa Rahayu</p>
              <p className="text-xs text-slate-400">anisa@email.com</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <item.icon size={16} />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button onClick={() => setView("landing")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-900">
              {sidebarItems.find(s => s.id === tab)?.label || "Dashboard"}
            </h1>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 relative">
                <Bell size={16} className="text-slate-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center">3</span>
              </button>
              <Avatar src="https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=40&h=40&fit=crop&auto=format" name="Anisa Rahayu" size="sm" />
            </div>
          </div>
          {tab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Pemesanan Aktif" value="1" icon={Calendar} color="indigo" change="+1 bulan ini" />
                <StatCard label="Total Dibayar" value="Rp 7,5jt" icon={CreditCard} color="green" />
                <StatCard label="Wishlist" value="4 kamar" icon={Heart} color="purple" />
                <StatCard label="Poin Reward" value="1.250" icon={Star} color="amber" change="+250 pts" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Sewa Aktif</h3>
                <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <img src={ROOMS[0].image} alt={ROOMS[0].name} className="w-20 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{ROOMS[0].name}</p>
                    <p className="text-sm text-slate-500">{ROOMS[0].address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={11} /> 1 Feb – 1 Mei 2025</span>
                      <Badge variant="success">Aktif</Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-indigo-600">{fmtShort(ROOMS[0].price)}/bln</p>
                    <p className="text-xs text-slate-400 mt-0.5">65 hari tersisa</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Pembayaran Terkini</h3>
                  <div className="space-y-3">
                    {TRANSACTIONS.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CreditCard size={14} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{t.room}</p>
                          <p className="text-xs text-slate-400">{t.date} · {t.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{fmtShort(t.amount)}</p>
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Favorit Saya</h3>
                  <div className="space-y-3">
                    {ROOMS.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                        <img src={r.image} alt={r.name} className="w-12 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{r.name}</p>
                          <p className="text-xs text-indigo-600 font-semibold">{fmtShort(r.price)}/bln</p>
                        </div>
                        <Heart size={14} className="text-red-400 fill-red-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab !== "dashboard" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {(() => { const Item = sidebarItems.find(s => s.id === tab); return Item ? <Item.icon size={24} className="text-slate-400" /> : null; })()}
              </div>
              <p className="font-semibold text-slate-700 mb-1">{sidebarItems.find(s => s.id === tab)?.label}</p>
              <p className="text-slate-400 text-sm">Konten sedang disiapkan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN DASHBOARD ────────────────────────────────────────────────────────────

function AdminDashboard({ setView }: { setView: (v: string) => void }) {
  const [tab, setTab] = useState("dashboard");
  const [roomView, setRoomView] = useState<"grid" | "list">("list");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarGroups = [
    { label: "Utama", items: [{ id: "dashboard", icon: LayoutDashboard, label: "Dashboard" }, { id: "analytics", icon: BarChart2, label: "Analitik" }] },
    { label: "Manajemen", items: [{ id: "properties", icon: Building2, label: "Properti" }, { id: "rooms", icon: BedDouble, label: "Kamar" }, { id: "tenants", icon: Users, label: "Penghuni" }, { id: "bookings", icon: Calendar, label: "Pemesanan" }, { id: "payments", icon: Receipt, label: "Pembayaran" }] },
    { label: "Sistem", items: [{ id: "reports", icon: FileText, label: "Laporan" }, { id: "cms", icon: Globe, label: "CMS" }, { id: "users", icon: User, label: "Pengguna" }, { id: "settings", icon: Settings, label: "Pengaturan" }] },
  ];
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-white border-r border-slate-100 flex-shrink-0 flex flex-col h-screen sticky top-0 transition-all duration-200`}>
        <div className={`p-4 border-b border-slate-100 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}>
          {sidebarOpen && (
            <button onClick={() => setView("landing")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={16} className="text-white" /></div>
              <span className="font-bold text-slate-900">KostHub</span>
            </button>
          )}
          {!sidebarOpen && <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={16} className="text-white" /></div>}
          {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600"><ChevronLeft size={18} /></button>}
        </div>
        {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-3 flex justify-center"><ChevronRight size={18} className="text-slate-400" /></button>}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sidebarGroups.map(group => (
            <div key={group.label}>
              {sidebarOpen && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1">{group.label}</p>}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <button key={item.id} onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"} ${!sidebarOpen ? "justify-center" : ""}`}
                    title={!sidebarOpen ? item.label : undefined}>
                    <item.icon size={16} className="flex-shrink-0" />
                    {sidebarOpen && item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className={`p-3 border-t border-slate-100 ${!sidebarOpen ? "flex flex-col items-center" : ""}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format" name="Admin KostHub" size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">Super Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@kosthub.id</p>
              </div>
            </div>
          )}
          <button onClick={() => setView("landing")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 ${!sidebarOpen ? "justify-center" : ""}`} title="Keluar">
            <LogOut size={16} /> {sidebarOpen && "Keluar"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{sidebarGroups.flatMap(g => g.items).find(i => i.id === tab)?.label || "Dashboard"}</h1>
            <p className="text-xs text-slate-400">KostHub Admin · {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 relative">
              <Bell size={16} className="text-slate-500" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">5</span>
            </button>
            <Btn variant="primary" size="sm" onClick={() => {}}><Plus size={14} /> Tambah Baru</Btn>
          </div>
        </div>

        <div className="p-6">
          {tab === "dashboard" && <AdminDashboardHome />}
          {tab === "rooms" && <AdminRooms roomView={roomView} setRoomView={setRoomView} />}
          {tab === "tenants" && <AdminTenants />}
          {tab === "payments" && <AdminPayments />}
          {tab === "bookings" && <AdminBookings />}
          {tab === "properties" && <AdminProperties />}
          {!["dashboard", "rooms", "tenants", "payments", "bookings", "properties"].includes(tab) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {(() => { const Item = sidebarGroups.flatMap(g => g.items).find(i => i.id === tab); return Item ? <Item.icon size={24} className="text-indigo-400" /> : null; })()}
              </div>
              <p className="font-semibold text-slate-700 mb-1">{sidebarGroups.flatMap(g => g.items).find(i => i.id === tab)?.label}</p>
              <p className="text-slate-400 text-sm">Modul sedang dikembangkan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminDashboardHome() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Properti" value="48" icon={Building2} color="indigo" change="+3 bulan ini" />
        <StatCard label="Total Kamar" value="1.092" icon={BedDouble} color="purple" change="+24 baru" />
        <StatCard label="Kamar Terisi" value="847" icon={Users} color="green" change="+12%" />
        <StatCard label="Kamar Kosong" value="213" icon={Package} color="amber" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pendapatan Bulan Ini" value="Rp 193jt" icon={DollarSign} color="green" change="+11%" />
        <StatCard label="Pembayaran Pending" value="23" icon={Clock} color="amber" change="-5 hari ini" />
        <StatCard label="Booking Hari Ini" value="18" icon={Calendar} color="indigo" change="+6" />
        <StatCard label="Pengguna Baru" value="142" icon={Users} color="purple" change="+31%" />
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
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtRevenue} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(val: number) => [fmtRevenue(val), ""]} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 3" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Tingkat Hunian</h3>
          <p className="text-xs text-slate-400 mb-2">Total 1.092 kamar</p>
          <ResponsiveContainer width="100%" height={160}>
            <RechartsPieChart>
              <Pie data={OCCUPANCY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {OCCUPANCY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {OCCUPANCY_DATA.map(d => (
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
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={BOOKING_DATA} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Bar dataKey="bookings" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Transaksi Terkini</h3>
            <Btn variant="outline" size="sm"><Eye size={13} /> Lihat Semua</Btn>
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
              {[{ icon: Plus, label: "Tambah Kamar" }, { icon: Users, label: "Tambah Penghuni" }, { icon: Download, label: "Export Data" }, { icon: FileText, label: "Buat Laporan" }].map(a => (
                <button key={a.label} className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors">
                  <a.icon size={13} className="flex-shrink-0" /><span className="truncate">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRooms({ roomView, setRoomView }: { roomView: "grid" | "list"; setRoomView: (v: "grid" | "list") => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const filtered = ROOMS.filter(r =>
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "Semua" || r.status === statusFilter)
  );
  return (
    <div className="space-y-5 max-w-7xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kamar..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {["Semua", "Tersedia", "Terisi", "Maintenance"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setRoomView("list")} className={`p-2 ${roomView === "list" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-500"}`}><List size={16} /></button>
          <button onClick={() => setRoomView("grid")} className={`p-2 ${roomView === "grid" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-500"}`}><Grid size={16} /></button>
        </div>
        <Btn variant="primary" size="sm"><Plus size={14} /> Tambah Kamar</Btn>
      </div>
      {roomView === "list" ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                      <button className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors"><Edit size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function AdminTenants() {
  const [search, setSearch] = useState("");
  const extTenants = [...TENANTS, ...TENANTS.map((t, i) => ({ ...t, id: t.id + 10, name: ["Rina Kusuma", "Deni Pratama", "Maya Sari", "Eko Nugroho"][i], room: ROOMS[i + 2]?.name.split(" ").slice(0, 3).join(" ") || t.room }))];
  const filtered = extTenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5 max-w-7xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari penghuni..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="outline" size="sm"><Filter size={13} /> Filter</Btn>
        <Btn variant="primary" size="sm"><Plus size={14} /> Tambah Penghuni</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>{["Penghuni", "Kamar", "Mulai Sewa", "Selesai", "Status", "Aksi"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
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

function AdminPayments() {
  return (
    <div className="space-y-5 max-w-7xl">
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
        <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none">
          {["Semua Status", "Lunas", "Pending", "Gagal"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Btn variant="outline" size="sm"><Download size={13} /> Export PDF</Btn>
        <Btn variant="outline" size="sm"><Download size={13} /> Excel</Btn>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
  );
}

function AdminBookings() {
  const [calView, setCalView] = useState<"list" | "calendar">("list");
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const calDays = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="space-y-5 max-w-7xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setCalView("list")} className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${calView === "list" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}><List size={14} /> Daftar</button>
          <button onClick={() => setCalView("calendar")} className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${calView === "calendar" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}><Calendar size={14} /> Kalender</button>
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari pemesanan..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="primary" size="sm"><Plus size={14} /> Booking Manual</Btn>
      </div>
      {calView === "list" ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>{["Penghuni", "Kamar", "Check-in", "Check-out", "Durasi", "Total", "Status", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TENANTS.map((t, i) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar src={t.avatar} name={t.name} size="sm" />
                      <span className="text-sm font-medium text-slate-900">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.room}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">1 {["Jan", "Feb", "Mar", "Apr"][i]} 2025</td>
                  <td className="px-4 py-3 text-sm text-slate-600">1 {["Jan", "Feb", "Mar", "Apr"][i]} 2026</td>
                  <td className="px-4 py-3 text-sm text-slate-600">12 bulan</td>
                  <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{fmtShort(ROOMS[i].price * 12)}</td>
                  <td className="px-4 py-3"><Badge variant="success">Aktif</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">Check-in</button>
                      <button className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">Check-out</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Januari 2025</h3>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center"><ChevronLeft size={16} className="text-slate-500" /></button>
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center"><ChevronRight size={16} className="text-slate-500" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 3 }).map((_, i) => <div key={`e${i}`} />)}
            {calDays.map(d => {
              const hasBooking = [1, 5, 12, 15, 20, 22, 25, 28].includes(d);
              return (
                <div key={d} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium cursor-pointer transition-all
                  ${d === 25 ? "bg-indigo-600 text-white" : hasBooking ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "hover:bg-slate-50 text-slate-700"}`}>
                  {d}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-600" /><span className="text-slate-500">Hari Ini</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-50 border border-indigo-200" /><span className="text-slate-500">Ada Booking</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminProperties() {
  return (
    <div className="space-y-5 max-w-7xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari properti..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="primary" size="sm"><Plus size={14} /> Tambah Properti</Btn>
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
                <Btn variant="outline" size="sm" className="flex-1 justify-center"><Eye size={13} /> Detail</Btn>
                <Btn variant="secondary" size="sm" className="flex-1 justify-center"><Edit size={13} /> Edit</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("landing");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const toggleWish = (id: number) => setWishlist(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const showNavbar = ["landing", "room-detail", "rooms"].includes(view);

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {showNavbar && <Navbar view={view} setView={setView} />}
      {view === "landing" && <LandingPage setView={setView} wishlist={wishlist} toggleWish={toggleWish} />}
      {view === "room-detail" && <RoomDetailPage setView={setView} />}
      {view === "booking" && <BookingPage setView={setView} />}
      {view === "payment" && <PaymentPage setView={setView} />}
      {view === "login" && <LoginPage setView={setView} />}
      {view === "register" && <RegisterPage setView={setView} />}
      {view === "user-dashboard" && <UserDashboard setView={setView} />}
      {view === "admin-dashboard" && <AdminDashboard setView={setView} />}
      {view === "rooms" && (
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Semua Kamar</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROOMS.map(r => <RoomCard key={r.id} room={r} onView={() => setView("room-detail")} wishlist={wishlist} toggleWish={toggleWish} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
