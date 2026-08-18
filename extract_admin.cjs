const fs = require('fs');

const code = fs.readFileSync('resources/js/pages/dashboard.tsx', 'utf8');

// Extract all inline admin component functions
const fnNames = ['AdminRooms', 'AdminTenants', 'AdminPayments', 'AdminProperties', 
  'AdminWebSettings', 'AdminDiscountRules', 'AdminSocialLinks', 'AdminFaqs'];

// We'll extract the entire tail of the file from AdminRooms onwards to a separate file
// Find start of AdminRooms
const adminRoomsStart = code.indexOf('\n\nfunction AdminRooms(');
const mainCode = code.substring(0, adminRoomsStart);
const adminCode = code.substring(adminRoomsStart + 2); // skip leading \n\n

// Build the admin inline module file
const adminInlineHeader = `import React, { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import {
  Building2, Star, CheckCircle2, AlertCircle, Clock,
  BedDouble, Users, Package, DollarSign, Receipt, FileText, Globe, Plus,
  ChevronLeft, ChevronRight, Download, Sparkles, Shield, Search, Filter, List, Grid, Eye, Edit, Trash2, Check,
  Folder, Wrench, HelpCircle, AlertTriangle, ChevronDown, Mail, Percent,
  RefreshCw, MapPin, Calendar, Bell, X
} from 'lucide-react';
import {
  ROOMS, TRANSACTIONS, TENANTS,
  fmtShort, fmtIDR, fmt
} from '@/components/cozqta/data';
import { StatCard, StatusBadge, Badge, Btn, Avatar, SearchableSelect } from '@/components/cozqta/primitives';

`;

// Convert function declarations to exports
let adminCodeFixed = adminCode
  .replace(/^function AdminRooms/, 'export function AdminRooms')
  .replace(/\nfunction AdminTenants/, '\nexport function AdminTenants')
  .replace(/\nfunction AdminPayments/, '\nexport function AdminPayments')
  .replace(/\nfunction AdminProperties/, '\nexport function AdminProperties')
  .replace(/\nfunction AdminWebSettings/, '\nexport function AdminWebSettings')
  .replace(/\nfunction AdminDiscountRules/, '\nexport function AdminDiscountRules')
  .replace(/\nfunction AdminSocialLinks/, '\nexport function AdminSocialLinks')
  .replace(/\nfunction AdminFaqs/, '\nexport function AdminFaqs');

fs.writeFileSync('resources/js/components/admin/AdminInlineModules.tsx', adminInlineHeader + adminCodeFixed, 'utf8');

// Now update dashboard.tsx: remove adminCode and add lazy imports
let newMain = mainCode;

// Add lazy imports for the inline modules
const lazyImports = `
const AdminRooms = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminRooms })));
const AdminTenants = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminTenants })));
const AdminPayments = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminPayments })));
const AdminProperties = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminProperties })));
const AdminWebSettings = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminWebSettings })));
const AdminDiscountRules = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminDiscountRules })));
const AdminSocialLinks = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminSocialLinks })));
const AdminFaqs = lazy(() => import('@/components/admin/AdminInlineModules').then(m => ({ default: m.AdminFaqs })));
`;

// Insert after the last lazy import line
newMain = newMain.replace(
  "const PaymentHistory = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PaymentHistory })));",
  "const PaymentHistory = lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PaymentHistory })));" + lazyImports
);

fs.writeFileSync('resources/js/pages/dashboard.tsx', newMain, 'utf8');
console.log('Done! dashboard lines:', newMain.split('\n').length, '| adminInline lines:', adminCodeFixed.split('\n').length);
