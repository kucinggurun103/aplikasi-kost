import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User, ArrowLeft, ShieldCheck, LoaderCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex font-sans antialiased">
      <Head title="Buat Akun Baru — CozQta" />

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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8"
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Buat Akun Baru</h1>
            <p className="text-slate-500 text-sm">Daftar sekarang untuk mulai mencari atau menyewa unit impian Anda.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Nama Lengkap</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
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
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Password</label>
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

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Konfirmasi Password</label>
              <div className="relative group">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Konfirmasi Password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              {errors.password_confirmation && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password_confirmation}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {processing ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline transition-all">
                Masuk ke akun Anda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
