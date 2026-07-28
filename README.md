# NeoFlow OS - Creative Intelligence System

NeoFlow OS adalah sistem operasi kreatif terpadu yang dirancang untuk direktur kreatif, pembuat konten, dan seniman visual. Aplikasi ini menggabungkan AI generatif dengan alur kerja manajemen konten profesional untuk mempercepat proses dari ide mentah hingga produksi akhir.

## 🚀 Fitur Utama

- **Mesin DNA Visual**: Tetapkan hukum estetika studio Anda untuk menjaga konsistensi merek di semua proyek.
- **Prompt Builder Neural**: Bangun prompt AI yang presisi dengan struktur berlapis (Scene, Subject, Optics, Lighting, Art Direction).
- **Moodboard Intelligence**: Unggah referensi visual dan biarkan AI mengekstraksi nada, komposisi, dan arah prompt secara otomatis.
- **Content Pipeline (Kanban)**: Kelola alur kerja kreatif Anda dari tahap Ide, Produksi, hingga Terbit.
- **Quick Capture**: Tangkap inspirasi sekilas dalam hitungan detik sebelum hilang.
- **Caption Generator**: Produksi narasi yang selaras dengan visual menggunakan model bahasa canggih.
- **Sistem Tema Dinamis**: Sesuaikan pengalaman visual Anda dengan Mode Gelap/Terang dan skema warna aksen yang fleksibel.
- **Cloud Sync (Firebase)**: Cadangkan draf dan pengaturan Anda ke cloud untuk akses lintas perangkat.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS (Desain kustom Neo-Noire).
- **Animasi**: Framer Motion.
- **AI Engine**: Google Gemini API (Model 1.5 Flash).
- **Backend/Cloud**: Firebase (Authentication & Firestore).
- **Iconography**: Lucide React.

## ⚙️ Persiapan & Instalasi

### 1. Prasyarat
- Node.js (v18 atau lebih baru).
- Akun Google Cloud untuk API Key Gemini.
- Proyek Firebase yang sudah terkonfigurasi.

### 2. Variabel Lingkungan
Buat file `.env` di akar proyek dan tambahkan:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Konfigurasi Firebase
Pastikan file `firebase-applet-config.json` berisi konfigurasi proyek Firebase Anda:
```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

### 4. Menjalankan Pengembangan
```bash
npm install
npm run dev
```

## 📈 Alur Kerja Pengembangan

### Struktur Proyek
- `/src/components`: UI modular dan logika fitur.
- `/src/lib`: Integrasi pihak ketiga (Firebase, Utils).
- `/src/types.ts`: Definisi tipe data sistem.
- `/firestore.rules`: Aturan keamanan database (ABAC Pattern).

### Menambah Fitur Baru
1. Definisikan entitas data baru di `firebase-blueprint.json`.
2. Perbarui `firestore.rules` jika entitas membutuhkan akses database.
3. Gunakan `GoogleGenAI` di `/src/components` untuk fitur berbasis AI.
4. Pastikan komponen menggunakan utility `cn()` untuk konsistensi styling Tailwind.

## 🗺️ Roadmap Masa Depan
- [ ] Integrasi Video DNA (untuk pembuat konten video).
- [ ] Kolaborasi tim real-time (Shared Workspaces).
- [ ] Ekspor aset langsung ke platform media sosial.
- [ ] Plugin browser untuk Quick Capture dari situs mana pun.

---
**NeoFlow OS** - *Crafted for the future of visual storytelling.*
