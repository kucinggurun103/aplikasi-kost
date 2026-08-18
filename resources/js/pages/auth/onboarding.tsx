import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Phone, IdCard, Upload, LoaderCircle, CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';

export default function Onboarding({ user }: { user: any }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    phone_number: '',
    emergency_contact_number: '',
    address: '',
    gender: 'male',
    birth_place: '',
    birth_day: '',
    identity_number: '',
    identity_number_photo: null as File | null,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('identity_number_photo', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/onboarding', {
      forceFormData: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans antialiased">
      <Head title="Lengkapi Profil Anda — CozQta" />

      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-indigo-600 px-8 py-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Halo, {user?.name}! 👋</h1>
            <p className="text-indigo-100 text-sm max-w-md mx-auto">
              Sebelum mulai mencari atau mengelola kost, yuk lengkapi data diri Anda terlebih dahulu demi keamanan dan kenyamanan bersama.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8 sm:px-12">
          <form onSubmit={submit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Nomor Handphone Pribadi (WA)</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="tel"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="Nomor Telepon (WhatsApp)"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                  />
                </div>
                <InputError message={errors.phone_number} className="mt-1" />
              </div>

              {/* Emergency Contact Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Nomor Darurat (Keluarga/Kerabat)</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="tel"
                    value={data.emergency_contact_number}
                    onChange={(e) => setData('emergency_contact_number', e.target.value)}
                    placeholder="Nomor Telepon Darurat"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                  />
                </div>
                <InputError message={errors.emergency_contact_number} className="mt-1" />
              </div>
            </div>

            {/* Gender - Full width uniformly */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Jenis Kelamin</label>
              <div className="flex gap-4 w-full">
                <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 border rounded-2xl cursor-pointer transition-all shadow-sm ${data.gender === 'male' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  <input type="radio" name="gender" value="male" className="hidden" checked={data.gender === 'male'} onChange={() => setData('gender', 'male')} />
                  Laki-laki
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 border rounded-2xl cursor-pointer transition-all shadow-sm ${data.gender === 'female' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  <input type="radio" name="gender" value="female" className="hidden" checked={data.gender === 'female'} onChange={() => setData('gender', 'female')} />
                  Perempuan
                </label>
              </div>
              <InputError message={errors.gender} className="mt-1" />
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Tempat Lahir</label>
                <input
                  type="text"
                  value={data.birth_place}
                  onChange={(e) => setData('birth_place', e.target.value)}
                  placeholder="Tempat Lahir"
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm block"
                />
                <InputError message={errors.birth_place} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Tanggal Lahir</label>
                <input
                  type="date"
                  value={data.birth_day}
                  onChange={(e) => setData('birth_day', e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm block"
                />
                <InputError message={errors.birth_day} className="mt-1" />
              </div>
            </div>

            {/* Address - Full width uniformly */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Alamat Lengkap</label>
              <textarea
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                placeholder="Alamat Lengkap"
                required
                rows={3}
                className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all resize-none shadow-sm block"
              />
              <InputError message={errors.address} className="mt-1" />
            </div>

            {/* Identity Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Nomor Identitas (KTP)</label>
              <div className="relative group w-full">
                <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  value={data.identity_number}
                  onChange={(e) => setData('identity_number', e.target.value)}
                  placeholder="Nomor KTP (NIK)"
                  required
                  maxLength={16}
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 text-slate-900 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <InputError message={errors.identity_number} className="mt-1" />
            </div>

            {/* Identity Photo */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide">Foto KTP Depan</label>
              <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-2xl hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden group shadow-sm">
                <div className="space-y-2 text-center relative z-10">
                  {!photoPreview ? (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <div className="flex flex-col items-center text-sm text-slate-600 justify-center">
                        <span className="font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                          Klik untuk upload file
                        </span>
                        <p className="mt-1 text-slate-500">atau drag & drop ke area ini</p>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">PNG atau JPG (Maks. 2MB)</p>
                      <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" required onChange={handlePhotoChange} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-56 h-36 rounded-xl overflow-hidden shadow-md border border-slate-200">
                        <img src={photoPreview} alt="Preview KTP" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 rounded-full flex items-center gap-1">
                            <Upload size={14} /> Ganti Foto
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm font-semibold text-green-600 gap-1.5">
                        <CheckCircle2 size={16} /> Foto berhasil dipilih
                      </div>
                      <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoChange} />
                    </div>
                  )}
                </div>
              </label>
              <InputError message={errors.identity_number_photo} className="mt-1.5" />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
            >
              {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
              {processing ? 'Menyimpan Data...' : 'Simpan & Lanjutkan ke Dashboard'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Data Anda kami simpan dengan aman dan dienkripsi.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
