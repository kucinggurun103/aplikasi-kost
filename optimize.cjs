const fs = require('fs');

const code = fs.readFileSync('resources/js/pages/dashboard.tsx', 'utf8');

// 1. Remove eager Swal import
// We'll replace usages with dynamic import(() => import('sweetalert2'))
// For now just convert to dynamic import
let newCode = code.replace(
  "import Swal from 'sweetalert2';\n",
  ""
);

// 2. Replace each Swal.fire( usage with a dynamic import pattern
// We'll wrap Swal calls: Swal.fire( -> (await import('sweetalert2')).default.fire(
// But we need to make those functions async - let's just do a simpler approach
// Replace: Swal.fire({  with: const {default:_Swal} = await import('sweetalert2'); _Swal.fire({
// Actually, let's use a simpler approach - just make all Swal usages go through a helper
newCode = newCode.replace(
  "const TicketDashboard = lazy(() => import('@/components/tickets/TicketDashboard'));\n",
  `const TicketDashboard = lazy(() => import('@/components/tickets/TicketDashboard'));
const showAlert = async (opts: any) => {
  const { default: Swal } = await import('sweetalert2');
  return Swal.fire(opts);
};
`
);

// 3. Replace all Swal.fire( with showAlert(
newCode = newCode.replace(/Swal\.fire\(/g, 'showAlert(');

// 4. Make TenantFeatures lazy
newCode = newCode.replace(
  "import { ActiveContract, RoomDetails, BookingHistory, PendingInvoices, PaymentHistory } from '@/components/tenant/TenantFeatures';\n",
  `const TenantFeaturesModule = {
  ActiveContract: lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.ActiveContract }))),
  RoomDetails: lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.RoomDetails }))),
  BookingHistory: lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.BookingHistory }))),
  PendingInvoices: lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PendingInvoices }))),
  PaymentHistory: lazy(() => import('@/components/tenant/TenantFeatures').then(m => ({ default: m.PaymentHistory }))),
};
const ActiveContract = TenantFeaturesModule.ActiveContract;
const RoomDetails = TenantFeaturesModule.RoomDetails;
const BookingHistory = TenantFeaturesModule.BookingHistory;
const PendingInvoices = TenantFeaturesModule.PendingInvoices;
const PaymentHistory = TenantFeaturesModule.PaymentHistory;
`
);

fs.writeFileSync('resources/js/pages/dashboard.tsx', newCode, 'utf8');
console.log('Done! Lines:', newCode.split('\n').length);
