# DOKUMENTASI EMODU APP BACKEND (NEW EMOVIEW)


## TEKNOLOGI YANG DIGUNAKAN

1. Framework: Express.js
2. Database: MongoDB
3. Authentication: Auth0
4. Cloud : Google Cloud Platform


## HAL YANG PERLU DIPERSIAPKAN

1. Pastikan sudah menginstall Node.js (minimal versi 18.0.0) dan NPM pada perangkat anda.
2. Sistem operasi yang dapat digunakan adalah Windows, MacOS, atau Linux.
4. Siapkan IDE atau Code Editor yang anda sukai (VSCode, Sublime Text, Atom, Jetbrains Family, dll).
5. Koneksi internet yang stabil.

## CARA MENJALANKAN APLIKASI
1. Clone repository ini dengan cara menjalankan perintah berikut pada terminal:

#### a. Jika Menggunakan HTTPS
```bash
git clone https://github.com/ronywahyuu/new-emosync-be.git 
```

#### b. Jika Menggunakan SSH
```bash 
git clone git@github.com:ronywahyuu/new-emosync-be.git
```

2. Masuk ke dalam direktori project dan install dependencies dengan cara menjalankan perintah berikut pada terminal:
```bash
cd new-emosync-be
npm install
```

3. Jika masih dalam tahap pengembangan, gunakan branch development dengan cara menjalankan perintah berikut pada terminal:
```bash
# Memastikan branch development up-to-date
git fetch
git pull

# Masuk ke branch feat/facial-intervention karena saat ini update terakhir ada di branch tersebut
git checkout feat/facial-intervention
```

4. Buat file `.env` pada root project. Untuk konfigurasi yang diperlukan, silahkan hubungi tim pengembang.

5. Silahkan minta file `client_secret_*.json` dan `project-emosync-*.json` kepada tim pengembang untuk mengakses Google Cloud Platform dan fitur akses Google Sheets Database. File tersebut disimpan di root project.

6. Jalankan aplikasi dengan cara menjalankan perintah berikut pada terminal:
```bash
npm run dev
```

7. Buka browser dan akses `http://localhost:3000` untuk melihat aplikasi yang telah dijalankan.


