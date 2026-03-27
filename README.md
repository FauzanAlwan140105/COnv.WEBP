# COnv.WEBP

# ⚡ WebP & PDF Converter (Offline & Instan)

Sebuah alat berbasis website (dapat berjalan murni di peramban tanpa koneksi internet) untuk mengonversi gambar/foto dalam jumlah banyak menjadi file **WebP** maupun menjadikannya langsung **1 Dokumen PDF Berurutan**. 

![Tampilan UI Aplikasi](https://img.shields.io/badge/Aplikasi-Converter-blue?style=for-the-badge) ![Dukungan](https://img.shields.io/badge/Support-Batch_Processing-orange?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Teknologi-HTML%20|%20Tailwind%20|%20JS-green?style=for-the-badge)

---

## ✨ Fitur Utama

- **Konversi Massal (Batch/Bulk)**: Anda dapat menyorot (*drag & drop* atau klik) berapapun gambar sekaligus.
- **Urutan PDF Sempurna (New)**: Menyusun gambar-gambar yang telah Anda seret menjadi 1 file PDF siap cetak.
   - Orientasi cerdas menyesuaikan wujud gambar (Otomatis rotasi kertas ke _Landscape_ atau _Portrait_).
   - Ukuran kertas sudah distandarisasi menggunakan format **A4 (210x297 mm)**.
   - Fitur autofit: mengamankan gambar agar tidak terpotong ataupun berubah rasionya *(Rata tengah)*.
- **Unduh Sekali Klik via ZIP**: File WebP dibundel di dalam 1 file `.zip` agar praktis ketika didownload.
- **100% Privat (Client-Side)**: Tidak ada gambar pengguna yang diunggah ke pihak ketiga ataupun server manapun. Semua performanya bergantung dari kinerja *browser*.
- **Drag & Drop UI**: Animasi yang cantik ketika _pointer_ diseret ke area web.

## 🚀 Panduan Penggunaan / Instalasi

Anda hanya memerlukan peramban web Modern (Chrome, Edge, Firefox, Brave, Safari, dsb.) karena basis kode hanya berupa HTML dan Javascript biasa tanpa server-side khusus.

1. Silakan unduh/clone repositori ini.
2. Buka folder repositori yang telah diunduh, lalu cari file **`index.html`**.
3. **Klik ganda** (dibuka oleh peramban), atau gunakan fitur dari _code editor_ (seperti fitur ekstensi Live Server VS Code).
4. Klik langsung di kotak area unggah atau _tarik file secara menyeret_ menggunakan mouse dari folder Anda ke dalam web tersebut.

## 🛠️ Stack Teknologi & Library Pendukung

Aplikasi ini menggunakan beberapa CDN eksternal terbuka (`Client-Side`) agar berjalan sempurna:

* [**Tailwind CSS (CDN)**](https://tailwindcss.com/) - Kerangka kerja pembentuk desian UI/UX.
* [**JSZip**](https://stuk.github.io/jszip/) - Library untuk membuat struktur berkas dan mengunci penggabungan `.zip`.
* [**FileSaver.js**](https://github.com/eligrey/FileSaver.js/) - Membatu integrasi _storage saving action_ saat tombol *download* diklik.
* [**jsPDF**](https://github.com/parallax/jsPDF) - Pengurus kompilasi array urutan gambar yang di-_generate_ menjadi file PDF murni berskala milimeter.

---
> **Catatan**: Karena skrip ini menggunakan sistem Javascript `FileReader`, harap pastikan Anda mengakses file HTML ini pada *Local server (Live Server/Browser langsung)*. Apabila menemui batasan CORS, pastikan *browser* Anda sedang tidak menghidupkan ekstensi anti-tracker pengetat (Ext ketat biasanya membredel pergerakan Canvas rendering).
