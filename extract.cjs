const fs = require('fs');
const code = fs.readFileSync('resources/js/pages/dashboard.tsx', 'utf8');
const match = code.match(/function AdminDashboardHome[\s\S]*?\n}\n/);
if (match) {
  const imports = `import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import {
  Building2, BedDouble, Users, Package, DollarSign, Clock, Calendar, Download, Eye, Plus, FileText
} from 'lucide-react';
import {
  TRANSACTIONS, REVENUE_DATA, OCCUPANCY_DATA, BOOKING_DATA, TENANTS,
  fmtShort, fmt, fmtRevenue
} from '@/components/cozqta/data';
import { StatCard, StatusBadge, Btn, Avatar } from '@/components/cozqta/primitives';

`;
  const newCode = imports + match[0].replace('function AdminDashboardHome', 'export default function AdminDashboardHome');
  fs.writeFileSync('resources/js/components/admin/AdminDashboardHome.tsx', newCode, 'utf8');
  console.log("Success");
}
