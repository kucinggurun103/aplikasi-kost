import { Link } from '@inertiajs/react';
import { Building2, ArrowLeft } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-50 p-6 md:p-10 text-slate-900 font-sans antialiased relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent pointer-events-none -z-10" />

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ArrowLeft size={15} /> Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-md my-auto">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Building2 size={24} className="text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Kost<span className="text-indigo-600">Hub</span>
              </span>
            </Link>

            <div className="space-y-1.5 mt-2">
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {children}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} CozQta Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  );
}
