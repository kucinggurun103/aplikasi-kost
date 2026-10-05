import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Phone,
    IdCard,
    Upload,
    LoaderCircle,
    CheckCircle2,
} from 'lucide-react';
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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 py-12 font-sans antialiased">
            <Head title="Lengkapi Profil Anda — CozQta" />

            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-indigo-600 px-8 py-10 text-center text-white">
                    <div className="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
                            Halo, {user?.name}! 👋
                        </h1>
                        <p className="mx-auto max-w-md text-sm text-indigo-100">
                            Sebelum mulai mencari atau mengelola kost, yuk
                            lengkapi data diri Anda terlebih dahulu demi
                            keamanan dan kenyamanan bersama.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="px-8 py-8 sm:px-12">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Phone Number */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                    Nomor Handphone Pribadi (WA)
                                </label>
                                <div className="group relative">
                                    <Phone
                                        size={18}
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                    />
                                    <input
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                'phone_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nomor Telepon (WhatsApp)"
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                    />
                                </div>
                                <InputError
                                    message={errors.phone_number}
                                    className="mt-1"
                                />
                            </div>

                            {/* Emergency Contact Number */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                    Nomor Darurat (Keluarga/Kerabat)
                                </label>
                                <div className="group relative">
                                    <Phone
                                        size={18}
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-red-500"
                                    />
                                    <input
                                        type="tel"
                                        value={data.emergency_contact_number}
                                        onChange={(e) =>
                                            setData(
                                                'emergency_contact_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nomor Telepon Darurat"
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm text-slate-900 shadow-sm transition-all focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                                    />
                                </div>
                                <InputError
                                    message={errors.emergency_contact_number}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Gender - Full width uniformly */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Jenis Kelamin
                            </label>
                            <div className="flex w-full gap-4">
                                <label
                                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border py-3.5 shadow-sm transition-all ${data.gender === 'male' ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className="hidden"
                                        checked={data.gender === 'male'}
                                        onChange={() =>
                                            setData('gender', 'male')
                                        }
                                    />
                                    Laki-laki
                                </label>
                                <label
                                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border py-3.5 shadow-sm transition-all ${data.gender === 'female' ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className="hidden"
                                        checked={data.gender === 'female'}
                                        onChange={() =>
                                            setData('gender', 'female')
                                        }
                                    />
                                    Perempuan
                                </label>
                            </div>
                            <InputError
                                message={errors.gender}
                                className="mt-1"
                            />
                        </div>

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                    Tempat Lahir
                                </label>
                                <input
                                    type="text"
                                    value={data.birth_place}
                                    onChange={(e) =>
                                        setData('birth_place', e.target.value)
                                    }
                                    placeholder="Tempat Lahir"
                                    required
                                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                                <InputError
                                    message={errors.birth_place}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    value={data.birth_day}
                                    onChange={(e) =>
                                        setData('birth_day', e.target.value)
                                    }
                                    required
                                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                                <InputError
                                    message={errors.birth_day}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Address - Full width uniformly */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Alamat Lengkap
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Alamat Lengkap"
                                required
                                rows={3}
                                className="block w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-1"
                            />
                        </div>

                        {/* Identity Number */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Nomor Identitas (KTP)
                            </label>
                            <div className="group relative w-full">
                                <IdCard
                                    size={18}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                                />
                                <input
                                    type="text"
                                    value={data.identity_number}
                                    onChange={(e) =>
                                        setData(
                                            'identity_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Nomor KTP (NIK)"
                                    required
                                    maxLength={16}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                                />
                            </div>
                            <InputError
                                message={errors.identity_number}
                                className="mt-1"
                            />
                        </div>

                        {/* Identity Photo */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Foto KTP Depan
                            </label>
                            <label
                                htmlFor="file-upload"
                                className="group relative mt-1 flex cursor-pointer justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 px-6 pt-8 pb-8 shadow-sm transition-all hover:border-indigo-400 hover:bg-slate-50"
                            >
                                <div className="relative z-10 space-y-2 text-center">
                                    {!photoPreview ? (
                                        <>
                                            <Upload className="mx-auto h-10 w-10 text-slate-400 transition-colors group-hover:text-indigo-500" />
                                            <div className="flex flex-col items-center justify-center text-sm text-slate-600">
                                                <span className="font-bold text-indigo-600 transition-colors group-hover:text-indigo-500">
                                                    Klik untuk upload file
                                                </span>
                                                <p className="mt-1 text-slate-500">
                                                    atau drag & drop ke area ini
                                                </p>
                                            </div>
                                            <p className="text-xs font-medium text-slate-400">
                                                PNG atau JPG (Maks. 2MB)
                                            </p>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/jpg"
                                                required
                                                onChange={handlePhotoChange}
                                            />
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative h-36 w-56 overflow-hidden rounded-xl border border-slate-200 shadow-md">
                                                <img
                                                    src={photoPreview}
                                                    alt="Preview KTP"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <span className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white">
                                                        <Upload size={14} />{' '}
                                                        Ganti Foto
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-green-600">
                                                <CheckCircle2 size={16} /> Foto
                                                berhasil dipilih
                                            </div>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={handlePhotoChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            </label>
                            <InputError
                                message={errors.identity_number_photo}
                                className="mt-1.5"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing && (
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                            )}
                            {processing
                                ? 'Menyimpan Data...'
                                : 'Simpan & Lanjutkan ke Dashboard'}
                        </button>
                        <p className="mt-4 text-center text-xs text-slate-400">
                            Data Anda kami simpan dengan aman dan dienkripsi.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
