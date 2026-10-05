import React, {
    useState,
    useEffect,
    type ReactNode,
    type ButtonHTMLAttributes,
} from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Star,
    Heart,
    MapPin,
    Building2,
    Menu,
    X,
    ArrowRight,
    Eye,
    TrendingUp,
    TrendingDown,
    Globe,
    Mail,
    Phone,
    Search,
    ChevronDown,
    Check,
    HelpCircle,
    User,
    LogOut,
    BookOpen,
    Compass,
    MessageSquare,
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    Linkedin,
} from 'lucide-react';
import { Room, fmtShort, FAQ_ITEMS } from './data';

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────

export interface BadgeProps {
    children: ReactNode;
    variant?:
        | 'default'
        | 'success'
        | 'warning'
        | 'danger'
        | 'outline'
        | 'purple'
        | 'primary';
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    const variants = {
        default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        primary: 'bg-blue-50 text-blue-700 border-blue-100',
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
        outline: 'bg-white text-slate-600 border-slate-200',
        purple: 'bg-violet-50 text-violet-700 border-violet-100',
    };
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
        >
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
        outline:
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
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

export function Avatar({
    src,
    name,
    size = 'md',
}: {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    return src ? (
        <img
            src={src}
            alt={name}
            loading="lazy"
            className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
        />
    ) : (
        <div
            className={`${sizes[size]} flex items-center justify-center rounded-full bg-indigo-600 font-semibold text-white`}
        >
            {initials}
        </div>
    );
}

export function StarRating({
    rating,
    max = 5,
    size = 12,
}: {
    rating: number;
    max?: number;
    size?: number;
}) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={
                        i + 1 <= Math.round(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                    }
                />
            ))}
        </div>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        Lunas: 'success',
        Paid: 'success',
        Aktif: 'success',
        Tersedia: 'success',
        Pending: 'warning',
        Terisi: 'default',
        Gagal: 'danger',
        Expired: 'danger',
        Nonaktif: 'danger',
        Maintenance: 'warning',
    };
    return <Badge variant={(map[status] as any) || 'outline'}>{status}</Badge>;
}

export function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    className = '',
    disabled = false,
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
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  option.label.toLowerCase().includes(query.toLowerCase()),
              );

    const selectedOption = options.find(
        (o) => String(o.value) === String(value),
    );

    return (
        <div
            ref={wrapperRef}
            className={`relative w-full ${disabled ? 'pointer-events-none opacity-60' : ''}`}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 transition-colors hover:border-indigo-300 ${className}`}
            >
                <span
                    className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-900'} text-sm`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div
                    className="animate-fade-in absolute z-50 mt-1 flex w-full flex-col rounded-xl border border-slate-200 bg-white shadow-lg"
                    style={{ maxHeight: '300px' }}
                >
                    <div className="sticky top-0 z-10 rounded-t-xl border-b border-slate-100 bg-white p-2">
                        <div className="relative">
                            <Search
                                size={14}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                className="w-full rounded-lg border-none bg-slate-50 py-2 pr-3 pl-8 text-sm focus:ring-0 focus:outline-none"
                                placeholder="Cari..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="flex-1 scrollbar-thin overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-center text-sm text-slate-500">
                                Tidak ada hasil ditemukan
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(String(option.value));
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${String(value) === String(option.value) ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {option.label}
                                    {String(value) === String(option.value) && (
                                        <Check
                                            size={14}
                                            className="text-indigo-600"
                                        />
                                    )}
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
        <div className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="relative overflow-hidden">
                <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="h-52 w-full bg-slate-100 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                    {room.status === 'Available' ? (
                        <Badge variant="success">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />{' '}
                            Tersedia
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
                <h3 className="mb-1 line-clamp-1 text-sm leading-snug font-semibold text-slate-900">
                    {room.name}
                </h3>
                <div className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={11} />
                    <span className="line-clamp-1">{room.address}</span>
                </div>

                {room.description && (
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {room.description}
                    </p>
                )}

                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {room.size > 0 && (
                        <span className="rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                            {room.size} m²
                        </span>
                    )}
                    {room.facilities?.slice(0, 3).map((f: any, i: number) => {
                        const name = typeof f === 'string' ? f : f.name;
                        return (
                            <span
                                key={i}
                                className="rounded-lg border border-slate-200/50 bg-slate-100/80 px-2.5 py-1 text-xs whitespace-nowrap text-slate-500"
                            >
                                {name}
                            </span>
                        );
                    })}
                    {room.facilities?.length > 3 && (
                        <span className="text-[10px] font-medium text-slate-400">
                            +{room.facilities.length - 3}
                        </span>
                    )}
                </div>

                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-indigo-600">
                            {fmtShort(room.price)}
                        </span>
                        <span className="text-xs text-slate-400">/ bulan</span>
                    </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <Building2 size={14} className="text-indigo-600" />
                    <span className="text-xs text-slate-500">
                        Cabang:{' '}
                        <span className="font-medium text-slate-700">
                            {room.building || 'Utama'}
                        </span>
                    </span>
                </div>
                <div className="flex gap-2">
                    {onView ? (
                        <Btn
                            variant="outline"
                            size="sm"
                            onClick={onView}
                            className="flex-1 justify-center"
                        >
                            <Eye size={14} /> Detail
                        </Btn>
                    ) : (
                        <Btn
                            variant="outline"
                            size="sm"
                            href={detailUrl}
                            className="flex-1 justify-center"
                        >
                            <Eye size={14} /> Detail
                        </Btn>
                    )}
                    <Btn
                        variant="primary"
                        size="sm"
                        href={detailUrl}
                        className="flex-1 justify-center"
                    >
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
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color] || colors.indigo}`}
                >
                    <Icon size={20} />
                </div>
                {change && (
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}
                    >
                        {positive ? (
                            <TrendingUp size={12} />
                        ) : (
                            <TrendingDown size={12} />
                        )}
                        {change}
                    </div>
                )}
            </div>
            <p className="mb-0.5 text-2xl font-bold text-slate-900">{value}</p>
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

    const filteredFaqs = FAQ_ITEMS.filter(
        (faq) =>
            faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
            faq.a.toLowerCase().includes(faqSearch.toLowerCase()),
    );

    const navClass =
        scrolled || !isLanding
            ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            : 'text-white/80 hover:bg-white/10 hover:text-white';

    const activeNavClass =
        scrolled || !isLanding
            ? 'bg-indigo-50 text-indigo-600 font-bold'
            : 'bg-white/20 text-white font-bold backdrop-blur-xs';

    const isRoomsActive = url.startsWith('/rooms');

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${scrolled ? 'border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* MOBILE NAVBAR HEADER */}
                    <div className="relative flex h-16 w-full items-center justify-between md:hidden">
                        <Link
                            href="/"
                            className="relative flex h-16 w-32 items-center"
                        >
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="absolute top-1/2 left-0 h-28 w-28 -translate-y-1/2 object-contain transition-transform hover:scale-105"
                            />
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                className={`rounded-lg p-2 ${scrolled || !isLanding ? 'text-slate-700' : 'text-white'}`}
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* DESKTOP NAVBAR HEADER (balanced & mathematically centered via grid) */}
                    <div className="hidden h-16 w-full grid-cols-3 items-center gap-4 md:grid">
                        {/* Column 1: Logo (Left aligned) */}
                        <div className="relative flex h-16 items-center justify-start">
                            <Link
                                href="/"
                                className="relative flex h-16 w-32 items-center"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="absolute top-1/2 left-0 h-28 w-28 -translate-y-1/2 object-contain transition-transform hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Column 2: Nav Items (Exactly Centered in the middle of the screen) */}
                        <nav className="flex w-full items-center justify-center gap-1.5 md:gap-3">
                            {/* Beranda */}
                            <Link
                                href="/"
                                className={`rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all ${isLanding ? activeNavClass : navClass}`}
                            >
                                Beranda
                            </Link>

                            {/* Cari Kamar */}
                            <Link
                                href="/rooms"
                                className={`rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all ${isRoomsActive && !url.includes('lokasi=') && !url.includes('/branches') ? activeNavClass : navClass}`}
                            >
                                Cari Kamar
                            </Link>

                            {/* Lokasi Cabang Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setLocationOpen(!locationOpen)
                                    }
                                    className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all ${url.includes('lokasi=') ? activeNavClass : navClass}`}
                                >
                                    Lokasi Cabang
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {locationOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setLocationOpen(false)
                                            }
                                        />
                                        <div className="animate-fade-in absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                                            <div className="mb-1 px-3 py-1.5 text-center text-xs font-semibold text-slate-400">
                                                Pilih Cabang
                                            </div>
                                            {global_branches.map((b: any) => (
                                                <Link
                                                    key={b.id}
                                                    href={`/rooms?lokasi=${b.slug}`}
                                                    onClick={() =>
                                                        setLocationOpen(false)
                                                    }
                                                    className={`block px-4 py-2 text-center text-sm transition-colors ${url.includes(`lokasi=${b.slug}`) ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
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
                                className={`rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all ${navClass}`}
                            >
                                Bantuan / FAQ
                            </button>
                        </nav>

                        {/* Column 3: Auth Buttons (Right aligned) */}
                        <div className="flex items-center justify-end gap-2">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setAuthOpen(!authOpen)}
                                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                                            scrolled || !isLanding
                                                ? 'text-slate-800 hover:bg-slate-100'
                                                : 'text-white hover:bg-white/10'
                                        } ${authOpen ? (scrolled || !isLanding ? 'bg-slate-100' : 'bg-white/10') : ''}`}
                                    >
                                        <Avatar name={user.name} size="sm" />
                                        <span className="max-w-[120px] truncate text-sm font-semibold">
                                            {user.name}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className="opacity-70"
                                        />
                                    </button>

                                    {authOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-30"
                                                onClick={() =>
                                                    setAuthOpen(false)
                                                }
                                            />
                                            <div className="border-slate-150 animate-fade-in absolute right-0 z-50 mt-2 w-56 rounded-2xl border bg-white py-2.5 text-slate-800 shadow-xl">
                                                <div className="border-b border-slate-100 px-4 py-2">
                                                    <p className="text-xs text-slate-400">
                                                        Masuk sebagai
                                                    </p>
                                                    <p className="truncate text-sm font-bold text-slate-800">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() =>
                                                        setAuthOpen(false)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setAuthOpen(false);
                                                        router.post('/logout');
                                                    }}
                                                    className="text-red-650 flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-red-50"
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
                                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-sm transition-all duration-200 hover:scale-102 ${
                                        scrolled || !isLanding
                                            ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                            : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
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
                    <div className="animate-fade-in max-h-[85vh] overflow-y-auto border-t border-slate-100 bg-white shadow-lg md:hidden">
                        <div className="space-y-1 px-4 py-3">
                            <Link
                                href="/rooms"
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-xl px-3 py-2.5 text-sm transition-all ${isRoomsActive && !url.includes('location=') ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                Cari Kamar
                            </Link>

                            {/* Lokasi Cabang Collapsible in Mobile */}
                            <div>
                                <button
                                    onClick={() =>
                                        setLocationOpen(!locationOpen)
                                    }
                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    <span>Lokasi Cabang</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {locationOpen && (
                                    <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                                        {global_branches.map((b: any) => (
                                            <Link
                                                key={b.id}
                                                href={`/rooms?lokasi=${b.slug}`}
                                                className={`py-1.5 text-sm transition-colors ${url.includes(`lokasi=${b.slug}`) ? 'font-medium text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
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
                                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Bantuan / FAQ
                            </button>

                            <div className="mt-2 border-t border-slate-100 pt-2">
                                {user ? (
                                    <div className="space-y-1.5">
                                        <div className="px-3 py-2">
                                            <p className="text-xs text-slate-400">
                                                Masuk sebagai
                                            </p>
                                            <p className="text-slate-850 truncate text-sm font-bold">
                                                {user.name}
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700"
                                        >
                                            Ke Dashboard
                                        </Link>
                                        <button
                                            onClick={() =>
                                                router.post('/logout')
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="block rounded-xl bg-indigo-600 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700"
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
                <div
                    className="fixed inset-0 z-50 overflow-hidden"
                    aria-labelledby="slide-over-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Backdrop overlay */}
                        <div
                            className="animate-fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                            onClick={() => setFaqOpen(false)}
                        />

                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            {/* Sliding panel */}
                            <div className="pointer-events-auto flex w-screen max-w-md transform flex-col justify-between border-l border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <HelpCircle size={18} />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900">
                                                Pusat Bantuan & FAQ
                                            </h2>
                                            <p className="text-[11px] text-slate-400">
                                                Pertanyaan umum seputar CozQta
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFaqOpen(false)}
                                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Search & List Content */}
                                <div className="flex-1 overflow-y-auto px-6 py-5">
                                    <div className="relative mb-5">
                                        <Search
                                            size={16}
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cari solusi atau pertanyaan..."
                                            value={faqSearch}
                                            onChange={(e) =>
                                                setFaqSearch(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-3.5">
                                        {filteredFaqs.length > 0 ? (
                                            filteredFaqs.map((faq, index) => {
                                                const isOpen =
                                                    activeFaqIndex === index;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="overflow-hidden rounded-xl border border-slate-100 shadow-2xs"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setActiveFaqIndex(
                                                                    isOpen
                                                                        ? null
                                                                        : index,
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50/50"
                                                        >
                                                            <span>{faq.q}</span>
                                                            <ChevronDown
                                                                size={16}
                                                                className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                            />
                                                        </button>
                                                        {isOpen && (
                                                            <div className="border-t border-slate-50/50 bg-slate-50/20 px-4 pt-1 pb-4 text-xs leading-relaxed text-slate-500">
                                                                {faq.a}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-10 text-center">
                                                <BookOpen
                                                    size={32}
                                                    className="mx-auto mb-2 text-slate-300"
                                                />
                                                <p className="text-sm font-medium text-slate-400">
                                                    Tidak ada hasil ditemukan
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Coba gunakan kata kunci
                                                    lainnya
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer/Contact support */}
                                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                                    <p className="mb-2 text-xs font-semibold text-slate-800">
                                        Masih butuh bantuan?
                                    </p>
                                    <p className="mb-4 text-[11px] text-slate-500">
                                        Hubungi tim customer service kami yang
                                        siap melayani 24/7
                                    </p>
                                    <a
                                        href="https://wa.me/628123456789"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-600"
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
    const webSettings =
        props.global_settings?.web_settings || props.web_settings || {};
    const dbSocial =
        props.global_settings?.social_media || props.social_media || [];

    const rawWhatsapp = webSettings?.whatsapp || webSettings?.phone;
    const cleanWhatsapp = rawWhatsapp ? rawWhatsapp.replace(/\D/g, '') : '';
    const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';
    const emailUrl = webSettings?.email ? `mailto:${webSettings.email}` : '';

    const getPlatformIcon = (name: string, iconKey?: string) => {
        const p = (name || '').toLowerCase();
        const k = (iconKey || '').toLowerCase();

        if (p.includes('instagram') || k === 'instagram') {
            return (
                <Instagram
                    size={15}
                    className="flex-shrink-0 text-pink-400 transition-colors group-hover:text-pink-300"
                />
            );
        }
        if (p.includes('facebook') || k === 'facebook') {
            return (
                <Facebook
                    size={15}
                    className="flex-shrink-0 text-blue-400 transition-colors group-hover:text-blue-300"
                />
            );
        }
        if (p.includes('tiktok') || k === 'tiktok') {
            return (
                <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-slate-800 text-[9px] font-black text-white transition-colors group-hover:bg-slate-700">
                    TT
                </span>
            );
        }
        if (p.includes('youtube') || k === 'youtube') {
            return (
                <Youtube
                    size={15}
                    className="flex-shrink-0 text-red-400 transition-colors group-hover:text-red-300"
                />
            );
        }
        if (p.includes('whatsapp') || k === 'whatsapp') {
            return (
                <MessageSquare
                    size={15}
                    className="flex-shrink-0 text-emerald-400 transition-colors group-hover:text-emerald-300"
                />
            );
        }
        if (p.includes('twitter') || p.includes('x') || k === 'twitter') {
            return (
                <Twitter
                    size={15}
                    className="flex-shrink-0 text-sky-400 transition-colors group-hover:text-sky-300"
                />
            );
        }
        if (p.includes('linkedin') || k === 'linkedin') {
            return (
                <Linkedin
                    size={15}
                    className="flex-shrink-0 text-blue-400 transition-colors group-hover:text-blue-300"
                />
            );
        }
        return (
            <Globe
                size={15}
                className="flex-shrink-0 text-slate-400 transition-colors group-hover:text-indigo-400"
            />
        );
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

    const supportLinks: Array<{
        name: string;
        href: string;
        icon?: React.ReactNode;
    }> = [
        {
            name: 'Bantuan / FAQ',
            href: '/#faq',
            icon: (
                <HelpCircle
                    size={15}
                    className="flex-shrink-0 text-indigo-400"
                />
            ),
        },
    ];
    if (whatsappUrl) {
        supportLinks.push({
            name: 'Kontak WhatsApp',
            href: whatsappUrl,
            icon: (
                <MessageSquare
                    size={15}
                    className="flex-shrink-0 text-emerald-400"
                />
            ),
        });
    }

    const columns: Array<{
        title: string;
        links: Array<{ name: string; href: string; icon?: React.ReactNode }>;
    }> = [
        {
            title: 'Platform',
            links: [
                { name: 'Beranda', href: '/' },
                { name: 'Cari Kamar', href: '/rooms' },
                { name: 'Dashboard', href: '/dashboard' },
            ],
        },
        {
            title: 'Dukungan',
            links: supportLinks,
        },
    ];

    if (socialLinks.length > 0) {
        columns.push({
            title: 'Sosial Media',
            links: socialLinks,
        });
    }

    return (
        <footer className="relative overflow-hidden border-t border-slate-800/60 bg-slate-900 text-white">
            {/* Decorative subtle ambient glows */}
            <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col items-start justify-between gap-12 lg:flex-row">
                    {/* Column 1: Branding */}
                    <div className="w-full max-w-md space-y-4 text-left">
                        <div className="flex h-16 items-center">
                            <img
                                src={
                                    webSettings?.site_logo
                                        ? `/storage/${webSettings.site_logo}`
                                        : '/logo.png'
                                }
                                alt={webSettings?.site_name || 'Logo'}
                                className="-ml-2 h-24 w-24 object-contain transition-transform hover:scale-105"
                            />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">
                            {webSettings?.site_description ||
                                'Platform manajemen kost terpercaya di Indonesia. Temukan, pesan, dan kelola hunian kost dengan mudah.'}
                        </p>
                        {contactButtons.length > 0 && (
                            <div className="flex gap-2.5 pt-2">
                                {contactButtons.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        <item.Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Columns 2, 3: Closely grouped Links */}
                    <div className="grid w-full grid-cols-2 gap-8 text-left sm:gap-12 md:grid-cols-3 lg:w-auto lg:gap-20">
                        {columns.map((col) => (
                            <div key={col.title} className="space-y-4">
                                <h4 className="flex h-16 items-center text-sm font-bold tracking-widest text-slate-200 uppercase">
                                    {col.title}
                                </h4>
                                <ul className="space-y-3">
                                    {col.links.map((link: any) => (
                                        <li key={link.name}>
                                            {link.href.startsWith('http') ||
                                            link.href.startsWith('mailto:') ||
                                            link.href.includes('#') ? (
                                                <a
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-white"
                                                >
                                                    {link.icon}
                                                    <span className="transition-colors group-hover:text-indigo-300">
                                                        {link.name}
                                                    </span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-white"
                                                >
                                                    {link.icon}
                                                    <span className="transition-colors group-hover:text-indigo-300">
                                                        {link.name}
                                                    </span>
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
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()}{' '}
                        <a
                            href="https://growigo.biz.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline transition-colors hover:text-indigo-400"
                        >
                            Growigo Indonesia
                        </a>
                        . All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
