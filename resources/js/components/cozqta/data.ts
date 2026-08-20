export interface Room {
  id: number;
  name: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  owner: string;
  ownerAvatar: string;
  available: boolean;
  image: string;
  facilities: string[];
  size: number;
  floor: number;
  building: string;
  status: string;
  booking_price?: number;
  deposit_type?: string;
  deposit_price?: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  date: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export interface OccupancyData {
  name: string;
  value: number;
  color: string;
}

export interface BookingData {
  day: string;
  bookings: number;
}

export interface Transaction {
  id: string;
  tenant: string;
  room: string;
  amount: number;
  date: string;
  status: string;
  method: string;
}

export interface Tenant {
  id: number;
  name: string;
  room: string;
  since: string;
  until: string;
  status: string;
  avatar: string;
}

export const ROOMS: Room[] = [
  { id: 0, name: "Sedang Memuat Data...", address: "-", price: 0, rating: 0, reviews: 0, type: "-", owner: "-", ownerAvatar: "", available: false, image: "https://via.placeholder.com/640x420?text=No+Image", facilities: [], size: 0, floor: 0, building: "-", status: "-" }
];

export const TESTIMONIALS: Testimonial[] = [];

export const FAQ_ITEMS: FaqItem[] = [];

export const REVENUE_DATA: RevenueData[] = [];

export const OCCUPANCY_DATA = [];

export const PAYMENT_STATUS_DATA = [];

export const BOOKING_DATA: BookingData[] = [];

export const TRANSACTIONS: Transaction[] = [];

export const TENANTS: Tenant[] = [];

export const fmt = (n: number): string => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
export const fmtIDR = fmt;
export const fmtShort = fmt;
export const fmtRevenue = fmt;
