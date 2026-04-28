# 🚢 Shipyard Management System - Frontend Client

Repositori ini berisi antarmuka pengguna (*Client/Frontend*) untuk **Shipyard Management System** (Sistem ERP Inventaris Galangan Kapal). Dibangun untuk memberikan pengalaman operasional (*User Experience*) yang reaktif, mulus, dan *real-time* kepada para pekerja galangan.

## 🛠️ Teknologi (Tech Stack)

* **Framework**: React 18
* **Build Tool**: Vite (Sangat cepat)
* **Styling**: Tailwind CSS (Modern Utility-First)
* **Routing**: React Router DOM v6
* **HTTP Client**: Axios
* **Icons**: Lucide React

## ✨ Fitur Utama (Core UI Features)

1. **Reaktivitas Tanpa Reload (Seamless UX)**: 
   Menggunakan manajemen *State* React sedemikian rupa sehingga ketika Supervisor menekan persetujuan atau Admin menambah Gudang, tabel akan langsung berubah detik itu juga tanpa perlu me-refresh halaman!
2. **Dashboard Peringatan Cerdas (Low-Stock Alert)**:
   Modul pintar yang memonitor seluruh barang di inventaris. Jika suatu onderdil jumlahnya sekarat di bawah ambang batas minimum, UI akan langsung menerbitkan kotak Sirine Merah kepada Admin.
3. **Form Component Interaktif (Glassmorphism Modal)**:
   Jendela pop-up (Modal) elegan yang memberikan perlindungan *form validation* sehingga pengguna tidak bisa merusak data (misal: meminta kuantitas 10 padahal stok hanya sisa 2).
4. **Role-Based UI Rendering**:
   Tombol *Tolak/Setujui*, tombol *Master Data*, dan tombol *Audit Log* secara gaib akan disembunyikan dan dihilangkan kemampuannya dari Staff biasa.

## 🚀 Panduan Instalasi (Setup Guide)

Ikuti langkah-langkah berikut untuk menjalankan antarmuka (*website*) ini di mesin lokal Anda.

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME_ANDA/NAMA_REPO_FRONTEND_ANDA.git
cd NAMA_REPO_FRONTEND_ANDA
```

### 2. Konfigurasi API (Environment Variables)
Mintalah file `.env` kepada pemilik repositori ini (atau buat file bernama `.env` di folder utama frontend). Isinya wajib menunjuk ke alamat *Backend Golang*:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Mengunduh Dependensi NPM
Pastikan Anda sudah menginstal Node.js di komputer Anda. Lalu jalankan:
```bash
npm install
```

### 4. Menjalankan Website (Dev Server)
```bash
npm run dev
```
*Tanda Berhasil: Terminal akan memberikan tautan `http://localhost:5173`. Klik tautan tersebut menggunakan Chrome/Browser lainnya.*

---

## 🔑 Akun Percobaan untuk Penguji (QA)

Untuk mengecek bagaimana tampilan dibatasi berdasarkan otoritas pengguna, silakan Login menggunakan akun *dummy* berikut:

| Akses Role   | Alamat Email           | Kata Sandi | Wewenang Anda di Layar                       |
|--------------|------------------------|------------|----------------------------------------------|
| **Admin**    | `admin@ship.com`       | `admin123` | Master Data, Tambah Barang, Audit Log, Buku Besar |
| **Spv**      | `spv@ship.com`         | `admin123` | Melihat Dasbor Alert, Memutuskan *Approve/Reject* |
| **Staff**    | `staff@ship.com`       | `admin123` | Hanya Form *Request/Pinjam* Barang Saja      |
