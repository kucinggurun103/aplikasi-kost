import { Link } from '@inertiajs/react';
import { Building2, ArrowLeft } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-slate-50 p-6 font-sans text-slate-900 antialiased md:p-10">
            <div className="pointer-events-none absolute top-0 left-0 -z-10 h-72 w-full bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent" />

            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs transition-all hover:bg-slate-50 hover:text-indigo-600"
                >
                    <ArrowLeft size={15} /> Kembali ke Beranda
                </Link>
            </div>

            <div className="my-auto w-full max-w-md">
                <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
                                <Building2 size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                Kost<span className="text-indigo-600">Hub</span>
                            </span>
                        </Link>

                        <div className="mt-2 space-y-1.5">
                            <h1 className="text-xl font-bold text-slate-900">
                                {title}
                            </h1>
                            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        {children}
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
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
    );
}
