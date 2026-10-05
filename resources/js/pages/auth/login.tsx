import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login({
    status,
    canResetPassword = true,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased">
            <Head title="Masuk ke Akun — CozQta" />

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
                        className="mb-12 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-indigo-600"
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
                            Selamat Datang
                        </h1>
                        <p className="text-sm text-slate-500">
                            Masuk untuk mengelola kost Anda di CozQta.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
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
                                    autoFocus
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

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
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Password"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-12 pl-12 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-indigo-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 flex items-start justify-between">
                                <div className="flex-1">
                                    {errors.password && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="group flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 select-none">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
                                    />
                                    <svg
                                        className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                Ingat saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Masuk ke Akun'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            Belum punya akun?{' '}
                            <Link
                                href="/register"
                                className="font-bold text-indigo-600 transition-all hover:underline"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
