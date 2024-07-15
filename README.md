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


## Penjelasan File dan Direktori

```
new-emosync-be/
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── config.js
├── index.js
├── LICENSE
├── package.json
├── README.md
├── vercel.json
├── controllers/
│   ├── AuthController.js
│   ├── UserController.js
├── middlewares/
│   ├── Auth.js
├── models/
│   ├── User.js
├── routes/
│   ├── AuthRoutes.js
│   ├── UserRoutes.js
```

#### Root Files

- `new-emosync-be\.env`: Berisi variabel environment untuk aplikasi, seperti string koneksi database, API keys, dan opsi konfigurasi lain yang tidak boleh di-hard-code ke dalam kode sumber aplikasi.
- `new-emosync-be\.eslintrc.js`: File konfigurasi untuk ESLint, sebuah alat untuk mengidentifikasi dan melaporkan pola dalam kode ECMAScript/JavaScript, dengan tujuan membuat kode lebih konsisten dan menghindari bug.
- `new-emosync-be\.gitignore`: Menentukan file-file yang sengaja tidak dilacak yang harus diabaikan oleh Git.
- `new-emosync-be\.prettierrc`: File konfigurasi untuk Prettier, sebuah code formatter yang opinionated, memastikan bahwa semua kode yang dikeluarkan sesuai dengan gaya yang konsisten.
- `new-emosync-be\config.js`: Kemungkinan berisi pengaturan konfigurasi untuk aplikasi, mungkin termasuk nilai default untuk variabel environment.
- `new-emosync-be\index.js`: Titik masuk dari aplikasi. Ini mengatur express server, koneksi database, middleware, dan rute.
- `new-emosync-be\LICENSE`: Berisi lisensi di bawah mana perangkat lunak didistribusikan.
- `new-emosync-be\package.json`: Mencantumkan dependensi proyek dan berisi metadata lain yang relevan dengan proyek seperti skrip untuk menjalankan, membangun, dan menguji aplikasi.
- `new-emosync-be\README.md`: Menyediakan gambaran umum proyek, termasuk petunjuk pemasangan, fitur, dan informasi penting lainnya.
- `new-emosync-be\vercel.json`: File konfigurasi untuk men-deploy aplikasi dengan Vercel, layanan hosting untuk aplikasi web.

#### Direktori `controllers`

Berisi file-file JavaScript yang mendefinisikan logika kontroler untuk aplikasi, seperti:

- `new-emosync-be\controllers\AuthController.js`: Menangani logika autentikasi pengguna, seperti login, logout, dan pendaftaran.
- `new-emosync-be\controllers\UserController.js`: Mengelola operasi terkait pengguna, seperti pengambilan informasi pengguna dan pembaruan profil.

#### Direktori `middlewares`

Berisi middleware custom yang memproses permintaan HTTP sebelum mencapai kontroler, misalnya:

- `new-emosync-be\middlewares\Auth.js`: Middleware yang memeriksa apakah pengguna telah diautentikasi sebelum memberikan akses ke rute tertentu.

#### Direktori `models`

Berisi definisi model data, mungkin menggunakan ORM seperti Sequelize atau Mongoose, misalnya:

- `new-emosync-be\models\User.js`: Definisi skema atau model untuk pengguna, termasuk properti dan metode yang terkait dengan pengguna dalam aplikasi.

#### Direktori `routes`

Berisi definisi rute yang menghubungkan URL tertentu dengan logika kontroler, misalnya:

- `new-emosync-be\routes\AuthRoutes.js`: Mengelola rute-rute yang berkaitan dengan autentikasi.
- `new-emosync-be\routes\UserRoutes.js`: Menangani rute-rute terkait dengan operasi pengguna.

