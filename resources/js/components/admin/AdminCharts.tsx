import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { REVENUE_DATA, OCCUPANCY_DATA, BOOKING_DATA } from '@/components/cozqta/data';
import { fmtRevenue } from '@/components/cozqta/data';

export function RevenueChart() {
  return (
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
        <Tooltip formatter={(val: any) => [fmtRevenue(val as number), ""]} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#revenueGrad)" />
        <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 3" fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BookingChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={BOOKING_DATA} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
        <Bar dataKey="bookings" fill="#4F46E5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RechartsPieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
