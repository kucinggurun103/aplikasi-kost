import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Login({ status, canResetPassword = true }: { status?: string; canResetPassword?: boolean }) {
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
    <div className="min-h-screen bg-white flex font-sans antialiased">
      <Head title="Masuk ke Akun — CozQta" />

      {/* Left Column - Banner (Text & Logo) */}
      <div className="hidden lg:block lg:w-1/2 p-4">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-indigo-600 flex flex-col justify-center p-12 lg:p-20">
          {/* Decorative Pattern / Gradients */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent mix-blend-multiply" />
          
          <div className="relative z-10 mb-10">
            <Link href="/" className="inline-block hover:scale-105 transition-transform origin-left">
              <img src="/logo.png" alt="Logo CozQta" className="h-14 brightness-0 invert drop-shadow-sm" />
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Platform Sewa Kost Modern
            </h2>
            <p className="text-indigo-100/90 text-lg leading-relaxed">
              Temukan dan kelola properti impian Anda. Nikmati pengalaman transaksi yang aman, transparan, dan sangat mudah.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>

          <div className="mb-10">
            {/* Logo shown only on mobile since desktop has it on the banner */}
            <Link href="/" className="inline-block mb-6 lg:hidden">
              <img
                src="/logo.png"
                alt="Logo CozQta"
                className="h-10 object-contain hover:scale-105 transition-transform origin-left"
              />
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Selamat Datang</h1>
            <p className="text-slate-500 text-sm">Masuk untuk mengelola kost Anda di CozQta.</p>
          </div>

          {status && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm font-semibold text-green-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="Alamat Email"
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">Password</label>
                {canResetPassword && (
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-semibold transition-colors">
                    Lupa password?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center cursor-pointer mt-4"
            >
              {processing ? 'Memproses...' : 'Masuk ke Akun'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline transition-all">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
