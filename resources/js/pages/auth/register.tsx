import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Mail,
    Lock,
    User,
    ArrowLeft,
    ShieldCheck,
    LoaderCircle,
} from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased">
            <Head title="Buat Akun Baru — CozQta" />

            {/* Left Column - Banner (Text & Logo) */}
            <div className="hidden p-4 lg:block lg:w-1/2">
                <div className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-3xl bg-indigo-600 p-12 shadow-2xl lg:p-20">
                    {/* Decorative Pattern / Gradients */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent mix-blend-multiply" />

                    <div className="relative z-10 mb-10">
                        <Link
                            href="/"
                            className="inline-block origin-left transition-transform hover:scale-105"
                        >
                            <img
                                src="/logo.png"
                                alt="Logo CozQta"
                                className="h-14 brightness-0 drop-shadow-sm invert"
                            />
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <h2 className="mb-6 text-4xl leading-tight font-extrabold tracking-tight text-white lg:text-5xl">
                            Platform Sewa Kost Modern
                        </h2>
                        <p className="text-lg leading-relaxed text-indigo-100/90">
                            Temukan dan kelola properti impian Anda. Nikmati
                            pengalaman transaksi yang aman, transparan, dan
                            sangat mudah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 md:px-24 lg:w-1/2">
                <div className="mx-auto w-full max-w-sm">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-indigo-600"
                    >
                        <ArrowLeft size={14} /> Kembali ke Beranda
                    </Link>

                    <div className="mb-10">
                        {/* Logo shown only on mobile since desktop has it on the banner */}
                        <Link href="/" className="mb-6 inline-block lg:hidden">
                            <img
                                src="/logo.png"
                                alt="Logo CozQta"
                                className="h-10 origin-left object-contain transition-transform hover:scale-105"
                            />
                        </Link>
                        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
                            Buat Akun Baru
                        </h1>
                        <p className="text-sm text-slate-500">
                            Daftar sekarang untuk mulai mencari atau menyewa
                            unit impian Anda.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Nama Lengkap
                            </label>
                            <div className="group relative">
                                <User
                                    size={18}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Nama Lengkap"
                                    required
                                    autoFocus
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Email
                            </label>
                            <div className="group relative">
                                <Mail
                                    size={18}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Alamat Email"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Password
                            </label>
                            <div className="group relative">
                                <Lock
                                    size={18}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Password"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Konfirmasi Password
                            </label>
                            <div className="group relative">
                                <ShieldCheck
                                    size={18}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Konfirmasi Password"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            {processing ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Sudah punya akun?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-indigo-600 transition-all hover:underline"
                            >
                                Masuk ke akun Anda
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
