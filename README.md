<div align="center">

# 🏠 CozQta — Modern Boarding House & Property Management Platform

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)

<p align="center">
  <b>Sistem Manajemen & Reservasi Kost Terintegrasi Berbasis Web Modern, Cepat, dan Skalabel.</b><br>
  Dikembangkan oleh <b><a href="https://growigo.id">Growigo Indonesia</a></b> & <b><a href="https://github.com/fazrianbaryfikri">Fazrian Baryfikri</a></b>.
</p>

[Fitur Utama](#-fitur-utama) • [Teknologi](#-teknologi) • [Instalasi](#-panduan-instalasi) • [Deployment](#-deployment) • [Pengembang](#-tim-pengembang)

---

</div>

## 🌟 Tentang CozQta

**CozQta** adalah platform All-in-One manajemen properti kost dan hunian sewa yang dirancang untuk memberikan kemudahan bagi pemilik kos (*Administrator*), pengelola cabang (*Operator Cabang*), maupun calon penghuni (*Tenant*).

Dengan arsitektur SPA (*Single Page Application*) yang ditenagai oleh **Laravel**, **Inertia.js React**, dan **Tailwind CSS v4**, CozQta menghadirkan performa super cepat tanpa reload, antarmuka elegan, serta sistem operasional yang lengkap mulai dari pemesanan, kontrak sewa digital, tagihan, hingga ticketing komplain fasilitas.

---

## ✨ Fitur Utama

### 1. 🏢 Multi-Branch & Properti Management
- **Dukungan Multi-Cabang**: Kelola banyak lokasi cabang kost dalam satu dasbor pusat.
- **Katalog Tipe Kamar & Kategori**: Kustomisasi ukuran kamar, harga bulanan, deposit, jenis kelamin penghuni (Pria, Wanita, Campur), serta fasilitas (WiFi, AC, TV, Kulkas, Listrik, Air, dsb).
- **Auto-Generate Unit Kamar**: Penomoran unit kamar otomatis dengan format fleksibel (Angka/Abjad) dan kustomisasi awalan (*prefix*).
- **Multi-Upload Gambar Kamar**: Dukungan upload gambar bertahap atau sekaligus dengan pratinjau otomatis dan kompresi gambar cerdas.

### 2. 👥 Role-Based Access Control (RBAC) 3 Tingkat
- **Administrator**: Hak akses penuh ke seluruh cabang, keuangan, laporan analitik pendapatan, manajemen pengguna, dan pengaturan sistem web.
- **Operator Cabang**: Didesain khusus untuk staf lapangan dalam mengelola operasional cabang yang ditugaskan, verifikasi pembayaran, maintenance unit, dan tiket bantuan penghuni.
- **Penghuni (Tenant)**: Portal mandiri untuk melihat kontrak sewa aktif, riwayat invoice, pembayaran tagihan, ulasan kost, dan pelaporan kendala kamar.

### 3. 💳 Pembayaran & Tagihan (Billing Automation)
- Manajemen deposit (*Upfront / At End / None*).
- Riwayat transaksi terperinci dan unduh struk / invoice.
- Konfigurasi Payment Gateway per cabang atau global.

### 4. 🛠️ Operasional & Ticketing
- **Kontrak Sewa Digital**: Pengawasan status masa sewa dan tanggal jatuh tempo sewa penghuni.
- **Helpdesk / Ticketing Maintenance**: Pelaporan kerusakan fasilitas kamar secara real-time dengan status penanganan.
- **Notifikasi Terintegrasi**: Log notifikasi sistem dan template pesan.

### 5. 🔍 Katalog Publik & Pencarian Kamar
- Filter pencarian kamar interaktif berdasarkan cabang lokasi, range harga, tipe kelamin, dan ketersediaan.
- Desain antarmuka publik responsif, modern, dan SEO-friendly.

---

## 🛠️ Teknologi & Stack

| Layer | Teknologi |
|---|---|
| **Backend Framework** | Laravel 12.x / PHP 8.2+ |
| **Frontend Framework** | React 19 + Inertia.js React v2 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Type-Safe Routing** | Laravel Wayfinder |
| **UI Components & Icons** | Lucide React, SweetAlert2, Recharts |
| **Database** | MySQL / MariaDB / PostgreSQL |
| **Bundler & Build Tool** | Vite |

---

## 🚀 Panduan Instalasi Lokal

### Prasyarat:
- **PHP** >= 8.2 (dengan ekstensi `pdo_mysql`, `fileinfo`, `gd`, `mbstring`, `curl`)
- **Composer** >= 2.x
- **Node.js** >= 18.x & **NPM**
- **MySQL** / MariaDB Server

### Langkah-Langkah:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/growigo-id/kost-cozqta.git
   cd kost-cozqta
   ```

2. **Install PHP Dependencies**:
   ```bash
   composer install
   ```

3. **Install JavaScript Dependencies**:
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Buka file `.env` dan sesuaikan koneksi database Anda (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).*

5. **Migrasi Database & Seeder**:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Buat Symlink Storage**:
   ```bash
   php artisan storage:link
   ```

7. **Jalankan Server Development**:
   Jalankan Vite dan server Laravel secara bersamaan:
   ```bash
   # Terminal 1:
   php artisan serve

   # Terminal 2:
   npm run dev
   ```
   Akses aplikasi di browser: **`http://localhost:8000`**

---

## 📦 Panduan Build & Production

Untuk membangun aset produksi:
```bash
npm run build
php artisan optimize
```

---

## 👨‍💻 Tim Pengembang & Kontributor

Aplikasi ini dikembangkan dan dipelihara dengan dedikasi oleh:

<div align="center">

| **Growigo Indonesia** | **Fazrian Baryfikri** |
| :---: | :---: |
| 🏢 **Digital Solutions & Software House** | 💻 **Lead Developer & Software Engineer** |
| 🌐 [growigo.id](https://growigo.id) | 🐙 [@fazrianbaryfikri](https://github.com/fazrianbaryfikri) |

</div>

---

## 📄 Lisensi

Proyek ini dilindungi di bawah lisensi hak cipta proprietary oleh **Growigo Indonesia** & **Fazrian Baryfikri**. Seluruh hak cipta dilindungi undang-undang.

<div align="center">
  <sub>Made with ❤️ in Indonesia by <b>Growigo Indonesia</b> & <b>Fazrian Baryfikri</b>.</sub>
</div>
