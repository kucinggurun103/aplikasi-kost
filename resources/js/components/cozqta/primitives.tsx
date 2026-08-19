import React, { useState, useEffect, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  Star, Heart, MapPin, Building2, Menu, X, ArrowRight, Eye,
  TrendingUp, TrendingDown, Globe, Mail, Phone, Search, ChevronDown, Check,
  HelpCircle, User, LogOut, BookOpen, Compass, MessageSquare, Instagram, Facebook,
  Youtube, Twitter, Linkedin
} from 'lucide-react';
import { Room, fmtShort, FAQ_ITEMS } from './data';

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'purple';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    success: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    outline: 'bg-white text-slate-600 border-slate-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-100',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  href,
  type = 'button',
  ...props
}: BtnProps) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    secondary: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClassName = `inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-150 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export function Avatar({ src, name, size = 'md' }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return src ? (
    <img src={src} alt={name} loading="lazy" className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold`}>{initials}</div>
  );
}

export function StarRating({ rating, max = 5, size = 12 }: { rating: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={size} className={i + 1 <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Lunas': 'success', 'Paid': 'success', 'Aktif': 'success', 'Tersedia': 'success',
    'Pending': 'warning', 'Terisi': 'default',
    'Gagal': 'danger', 'Expired': 'danger', 'Nonaktif': 'danger',
    'Maintenance': 'warning',
  };
  return <Badge variant={(map[status] as any) || 'outline'}>{status}</Badge>;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  className = "",
  disabled = false
}: {
  value: string | number;
  onChange: (val: string) => void;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = query === '' 
    ? options 
    : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  const selectedOption = options.find(o => String(o.value) === String(value));

  return (
    <div ref={wrapperRef} className={`relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 border border-slate-200 rounded-xl bg-white cursor-pointer hover:border-indigo-300 transition-colors ${className}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-900'} text-sm`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col animate-fade-in" style={{ maxHeight: '300px' }}>
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-xl">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-8 pr-3 py-2 text-sm border-none bg-slate-50 rounded-lg focus:ring-0 focus:outline-none"
                placeholder="Cari..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto p-1 scrollbar-thin flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-center text-slate-500">Tidak ada hasil ditemukan</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(String(option.value));
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer rounded-lg transition-colors ${String(value) === String(option.value) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {option.label}
                  {String(value) === String(option.value) && <Check size={14} className="text-indigo-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOM CARD ──────────────────────────────────────────────────────────────────

export function RoomCard({
  room,
  onView,
  wishlist = new Set(),
  toggleWish = () => {},
}: {
  room: Room | any;
  onView?: () => void;
  wishlist?: Set<number>;
  toggleWish?: (id: number) => void;
}) {
  const detailUrl = `/rooms/${room.id}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img src={room.image} alt={room.name} loading="lazy" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {room.status === 'Available' ? (
            <Badge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Tersedia
            </Badge>
          ) : room.status === 'Reserved' ? (
            <Badge variant="warning">Di-booking</Badge>
          ) : room.status === 'Occupied' ? (
            <Badge variant="danger">Terisi</Badge>
          ) : room.status === 'Maintenance' ? (
            <Badge variant="default">Perbaikan</Badge>
          ) : (
            <Badge variant="outline">{room.status}</Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline">{room.type}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 mb-1">{room.name}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
          <MapPin size={11} /><span className="line-clamp-1">{room.address}</span>
        </div>
        
        {room.description && (
          <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {room.size > 0 && (
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-medium border border-indigo-100">
              {room.size} m²
            </span>
          )}
          {room.facilities?.slice(0, 3).map((f: any, i: number) => {
            const name = typeof f === 'string' ? f : f.name;
            return (
              <span key={i} className="text-slate-500 text-xs px-2.5 py-1 bg-slate-100/80 border border-slate-200/50 rounded-lg whitespace-nowrap">
                {name}
              </span>
            );
          })}
          {room.facilities?.length > 3 && (
            <span className="text-slate-400 text-[10px] font-medium">+{room.facilities.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-indigo-600 font-bold text-base">{fmtShort(room.price)}</span>
            <span className="text-slate-400 text-xs">/ bulan</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={14} className="text-indigo-600" />
          <span className="text-xs text-slate-500">Cabang: <span className="text-slate-700 font-medium">{room.building || 'Utama'}</span></span>
        </div>
        <div className="flex gap-2">
          {onView ? (
            <Btn variant="outline" size="sm" onClick={onView} className="flex-1 justify-center">
              <Eye size={14} /> Detail
            </Btn>
          ) : (
            <Btn variant="outline" size="sm" href={detailUrl} className="flex-1 justify-center">
              <Eye size={14} /> Detail
            </Btn>
          )}
          <Btn variant="primary" size="sm" href={detailUrl} className="flex-1 justify-center">
            Pesan <ArrowRight size={14} />
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color = 'indigo',
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
  color?: string;
}) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-violet-50 text-violet-600',
  };
  const positive = change && change.startsWith('+');
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color] || colors.indigo}`}>
          <Icon size={20} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
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

export function Navbar({ activePage }: { activePage?: string } = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);



  const page = usePage();
  const url = page.url;
  const isLanding = url === '/' || url === '';
  const auth = (page.props as any).auth;
  const user = auth?.user;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileOpen(false);
    setLocationOpen(false);
    setAuthOpen(false);
  }, [url]);

  const global_branches = (page.props as any).global_branches || [];

  const filteredFaqs = FAQ_ITEMS.filter(faq =>
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const navClass = scrolled || !isLanding
    ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    : 'text-white/80 hover:bg-white/10 hover:text-white';

  const activeNavClass = scrolled || !isLanding
    ? 'bg-indigo-50 text-indigo-600 font-bold'
    : 'bg-white/20 text-white font-bold backdrop-blur-xs';

  const isRoomsActive = url.startsWith('/rooms');

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MOBILE NAVBAR HEADER */}
          <div className="flex items-center justify-between h-16 md:hidden w-full relative">
            <Link href="/" className="flex items-center h-16 w-32 relative">
              <img src="/logo.png" alt="Logo" className="absolute top-1/2 -translate-y-1/2 left-0 w-28 h-28 object-contain hover:scale-105 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-2">
              <button 
                className={`p-2 rounded-lg ${scrolled || !isLanding ? 'text-slate-700' : 'text-white'}`} 
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* DESKTOP NAVBAR HEADER (balanced & mathematically centered via grid) */}
          <div className="hidden md:grid grid-cols-3 items-center h-16 w-full gap-4">
            
            {/* Column 1: Logo (Left aligned) */}
            <div className="flex justify-start items-center h-16 relative">
              <Link href="/" className="flex items-center h-16 w-32 relative">
                <img src="/logo.png" alt="Logo" className="absolute top-1/2 -translate-y-1/2 left-0 w-28 h-28 object-contain hover:scale-105 transition-transform" />
              </Link>
            </div>

            {/* Column 2: Nav Items (Exactly Centered in the middle of the screen) */}
            <nav className="flex items-center justify-center gap-1.5 md:gap-3 w-full">
              {/* Beranda */}
              <Link 
                href="/" 
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${isLanding ? activeNavClass : navClass}`}
              >
                Beranda
              </Link>

              {/* Cari Kamar */}
              <Link 
                href="/rooms" 
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${isRoomsActive && !url.includes('lokasi=') && !url.includes('/branches') ? activeNavClass : navClass}`}
              >
                Cari Kamar
              </Link>

              {/* Lokasi Cabang Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${url.includes('lokasi=') ? activeNavClass : navClass}`}
                >
                  Lokasi Cabang
                  <ChevronDown size={14} className={`transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`} />
                </button>

                {locationOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLocationOpen(false)} />
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 text-center mb-1">Pilih Cabang</div>
                      {global_branches.map((b: any) => (
                        <Link 
                          key={b.id} 
                          href={`/rooms?lokasi=${b.slug}`}
                          onClick={() => setLocationOpen(false)}
                          className={`block px-4 py-2 text-sm text-center transition-colors ${url.includes(`lokasi=${b.slug}`) ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bantuan / FAQ Trigger */}
              <button
                onClick={() => setFaqOpen(true)}
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${navClass}`}
              >
                Bantuan / FAQ
              </button>
            </nav>

            {/* Column 3: Auth Buttons (Right aligned) */}
            <div className="flex justify-end items-center gap-2">

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAuthOpen(!authOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      scrolled || !isLanding
                        ? 'hover:bg-slate-100 text-slate-800'
                        : 'hover:bg-white/10 text-white'
                    } ${authOpen ? (scrolled || !isLanding ? 'bg-slate-100' : 'bg-white/10') : ''}`}
                  >
                    <Avatar name={user.name} size="sm" />
                    <span className="text-sm font-semibold max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="opacity-70" />
                  </button>

                  {authOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setAuthOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-150 py-2.5 z-50 text-slate-800 animate-fade-in">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-400">Masuk sebagai</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setAuthOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { setAuthOpen(false); router.post('/logout'); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-650 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          Keluar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all flex items-center justify-center whitespace-nowrap shadow-sm hover:scale-102 duration-200 cursor-pointer ${
                    scrolled || !isLanding
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      : 'border-white/30 bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* MOBILE MENU PANELS */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/rooms"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm rounded-xl transition-all ${isRoomsActive && !url.includes('location=') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Cari Kamar
              </Link>
              
              {/* Lokasi Cabang Collapsible in Mobile */}
              <div>
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <span>Lokasi Cabang</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`} />
                </button>
                {locationOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                    {global_branches.map((b: any) => (
                      <Link 
                        key={b.id} 
                        href={`/rooms?lokasi=${b.slug}`}
                        className={`py-1.5 text-sm transition-colors ${url.includes(`lokasi=${b.slug}`) ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-indigo-600'}`}
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setFaqOpen(true);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Bantuan / FAQ
              </button>

              <div className="pt-2 border-t border-slate-100 mt-2">
                {user ? (
                  <div className="space-y-1.5">
                    <div className="px-3 py-2">
                      <p className="text-xs text-slate-400">Masuk sebagai</p>
                      <p className="text-sm font-bold text-slate-850 truncate">{user.name}</p>
                    </div>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileOpen(false)} 
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm bg-indigo-50 text-indigo-700 font-semibold rounded-xl"
                    >
                      Ke Dashboard
                    </Link>
                    <button 
                      onClick={() => router.post('/logout')}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm bg-red-50 text-red-600 font-semibold rounded-xl"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileOpen(false)} 
                      className="block text-center py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* DYNAMIC BANTUAN / FAQ SLIDE-OVER DRAWER */}
      {faqOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in" 
              onClick={() => setFaqOpen(false)} 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Sliding panel */}
              <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl border-l border-slate-100 flex flex-col justify-between">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Pusat Bantuan & FAQ</h2>
                      <p className="text-[11px] text-slate-400">Pertanyaan umum seputar CozQta</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFaqOpen(false)} 
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Search & List Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="relative mb-5">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Cari solusi atau pertanyaan..."
                      value={faqSearch}
                      onChange={e => setFaqSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-3.5">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, index) => {
                        const isOpen = activeFaqIndex === index;
                        return (
                          <div key={index} className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                            <button
                              onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                              className="w-full px-4 py-3.5 text-left font-medium text-sm text-slate-800 hover:bg-slate-50/50 flex items-center justify-between gap-3"
                            >
                              <span>{faq.q}</span>
                              <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-relaxed bg-slate-50/20 border-t border-slate-50/50">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10">
                        <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-400">Tidak ada hasil ditemukan</p>
                        <p className="text-xs text-slate-400">Coba gunakan kata kunci lainnya</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer/Contact support */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-800 mb-2">Masih butuh bantuan?</p>
                  <p className="text-[11px] text-slate-500 mb-4">Hubungi tim customer service kami yang siap melayani 24/7</p>
                  <a 
                    href="https://wa.me/628123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                  >
                    <MessageSquare size={16} />
                    Hubungi WhatsApp Kami
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// ─── FOOTER ─────────────────────────────────────────────────────────────────────

export function Footer() {
  const props = usePage().props as any;
  const webSettings = props.global_settings?.web_settings || props.web_settings || {};
  const dbSocial = props.global_settings?.social_media || props.social_media || [];

  const rawWhatsapp = webSettings?.whatsapp || webSettings?.phone;
  const cleanWhatsapp = rawWhatsapp ? rawWhatsapp.replace(/\D/g, '') : '';
  const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';
  const emailUrl = webSettings?.email ? `mailto:${webSettings.email}` : '';

  const getPlatformIcon = (name: string, iconKey?: string) => {
    const p = (name || '').toLowerCase();
    const k = (iconKey || '').toLowerCase();

    if (p.includes('instagram') || k === 'instagram') {
      return <Instagram size={15} className="text-pink-400 group-hover:text-pink-300 transition-colors flex-shrink-0" />;
    }
    if (p.includes('facebook') || k === 'facebook') {
      return <Facebook size={15} className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />;
    }
    if (p.includes('tiktok') || k === 'tiktok') {
      return (
        <span className="font-black text-[9px] w-4 h-4 rounded bg-slate-800 text-white inline-flex items-center justify-center group-hover:bg-slate-700 transition-colors flex-shrink-0">
          TT
        </span>
      );
    }
    if (p.includes('youtube') || k === 'youtube') {
      return <Youtube size={15} className="text-red-400 group-hover:text-red-300 transition-colors flex-shrink-0" />;
    }
    if (p.includes('whatsapp') || k === 'whatsapp') {
      return <MessageSquare size={15} className="text-emerald-400 group-hover:text-emerald-300 transition-colors flex-shrink-0" />;
    }
    if (p.includes('twitter') || p.includes('x') || k === 'twitter') {
      return <Twitter size={15} className="text-sky-400 group-hover:text-sky-300 transition-colors flex-shrink-0" />;
    }
    if (p.includes('linkedin') || k === 'linkedin') {
      return <Linkedin size={15} className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />;
    }
    return <Globe size={15} className="text-slate-400 group-hover:text-indigo-400 transition-colors flex-shrink-0" />;
  };

  const socialLinks = dbSocial
    .filter((s: any) => s.is_active !== false)
    .map((s: any) => ({
      name: s.platform,
      href: s.url,
      icon: getPlatformIcon(s.platform, s.icon),
    }));

  const contactButtons: Array<{ Icon: any; href: string }> = [];
  if (emailUrl) {
    contactButtons.push({ Icon: Mail, href: emailUrl });
  }
  if (whatsappUrl) {
    contactButtons.push({ Icon: Phone, href: whatsappUrl });
  }

  const supportLinks: Array<{ name: string; href: string; icon?: React.ReactNode }> = [
    { name: 'Bantuan / FAQ', href: '/#faq', icon: <HelpCircle size={15} className="text-indigo-400 flex-shrink-0" /> }
  ];
  if (whatsappUrl) {
    supportLinks.push({
      name: 'Kontak WhatsApp',
      href: whatsappUrl,
      icon: <MessageSquare size={15} className="text-emerald-400 flex-shrink-0" />
    });
  }

  const columns: Array<{ title: string; links: Array<{ name: string; href: string; icon?: React.ReactNode }> }> = [
    { 
      title: 'Platform', 
      links: [
        { name: 'Beranda', href: '/' }, 
        { name: 'Cari Kamar', href: '/rooms' }, 
        { name: 'Dashboard', href: '/dashboard' }
      ] 
    },
    { 
      title: 'Dukungan', 
      links: supportLinks
    },
  ];

  if (socialLinks.length > 0) {
    columns.push({
      title: 'Sosial Media',
      links: socialLinks,
    });
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800/60 text-white relative overflow-hidden">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          
          {/* Column 1: Branding */}
          <div className="space-y-4 text-left max-w-md w-full">
            <div className="flex items-center h-16">
              <img 
                src={webSettings?.site_logo ? `/storage/${webSettings.site_logo}` : '/logo.png'} 
                alt={webSettings?.site_name || "Logo"} 
                className="w-24 h-24 object-contain hover:scale-105 transition-transform -ml-2" 
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {webSettings?.site_description || 'Platform manajemen kost terpercaya di Indonesia. Temukan, pesan, dan kelola hunian kost dengan mudah.'}
            </p>
            {contactButtons.length > 0 && (
              <div className="flex gap-2.5 pt-2">
                {contactButtons.map((item, i) => (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/80 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer">
                    <item.Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Columns 2, 3: Closely grouped Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-20 text-left w-full lg:w-auto">
            {columns.map(col => (
              <div key={col.title} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-200 uppercase tracking-widest h-16 flex items-center">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link: any) => (
                    <li key={link.name}>
                      {link.href.startsWith('http') || link.href.startsWith('mailto:') || link.href.includes('#') ? (
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
                        >
                          {link.icon}
                          <span className="group-hover:text-indigo-300 transition-colors">{link.name}</span>
                        </a>
                      ) : (
                        <Link 
                          href={link.href} 
                          className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
                        >
                          {link.icon}
                          <span className="group-hover:text-indigo-300 transition-colors">{link.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Copyright & Info */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} <a href="https://growigo.biz.id" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400 transition-colors">Growigo Indonesia</a>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
