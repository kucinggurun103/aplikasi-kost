const fs = require('fs');
let code = fs.readFileSync('resources/js/pages/dashboard.tsx', 'utf8');

// Remove Recharts import
code = code.replace(/import\s*\{\s*ResponsiveContainer[\s\S]*?\}\s*from\s*'recharts';\n?/, '');

// Add AdminDashboardHome lazy import right after AdminBranches lazy import
code = code.replace(/const AdminBranches = lazy/, "const AdminDashboardHome = lazy(() => import('@/components/admin/AdminDashboardHome'));\nconst AdminBranches = lazy");

// Delete AdminDashboardHome function definition
code = code.replace(/function AdminDashboardHome[\s\S]*?\n}\n/, '');

fs.writeFileSync('resources/js/pages/dashboard.tsx', code, 'utf8');
console.log("Success");
