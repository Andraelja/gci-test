# Garuda Cyber Tes - Laravel API + Next.js Frontend

## 📌 Overview

Full-stack application menggunakan **Laravel 11 (REST API)** dan **Next.js 15 (App Router)** untuk manajemen posts.

### ✨ Features

* Authentication (Register, Login, Logout)
* CRUD Posts
* Ownership validation (user hanya bisa edit & delete post miliknya sendiri)
* View all posts (multi-user)
* Search posts
* Pagination
* Responsive UI

---

## 🛠 Tech Stack

### Backend

* Laravel 11
* Laravel Sanctum (Authentication)
* MySQL
* Repository Pattern + Service Layer

### Frontend

* Next.js 15 (App Router)
* React Query (data fetching & state)
* Tailwind CSS + daisyUI
* TypeScript

---

## ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone <repo-url>
cd garuda_cyber_tes
```

---

## 2. Backend Setup (Laravel)

```bash
cd backend

cp .env.example .env
composer install
php artisan key:generate
```

### Setup Database

Edit `.env`:

```
DB_DATABASE=your_db
DB_USERNAME=root
DB_PASSWORD=
```

### Run Migration

```bash
php artisan migrate
```

### Run Server

```bash
php artisan serve
```

Backend berjalan di:

```
http://127.0.0.1:8000
```

---

## 3. Frontend Setup (Next.js)

```bash
cd frontend

npm install
```

### Jalankan Frontend

```bash
npm run dev
```

Frontend berjalan di:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

### Register

* User membuat akun
* Redirect ke halaman login

### Login

* Menggunakan username & password
* Token disimpan di client
* Digunakan untuk request API

### Logout

* Token dihapus dari storage
* Redirect ke halaman login

---

## 🧠 Struktur Proyek

### Backend (Laravel)

```
app/
├── Http/Controllers/Api
├── Services
├── Repositories
├── Models
```

### Penjelasan Arsitektur:

* **Controller** → handle request & response
* **Service** → business logic
* **Repository** → query database
* **Model** → representasi tabel

Pendekatan ini digunakan untuk:

* Separation of concerns
* Maintainability
* Scalability

---

### Frontend (Next.js)

```
app/
├── login/
├── register/
├── dashboard/
├── posts/[id]/
```

### Penjelasan:

* App Router digunakan untuk routing modern
* React Query untuk caching & state server
* Custom hook `useAuth` untuk auth state

---

## 🔒 Ownership Validation

### Backend

Validasi dilakukan di server:

* User hanya bisa update/delete post miliknya
* Jika tidak sesuai → return 403 Forbidden

### Frontend

* Tombol edit/delete hanya tampil untuk owner
* Meningkatkan UX, bukan untuk security

---

## 📡 API Endpoint

### Auth

```
POST /api/register
POST /api/login
POST /api/logout
```

### Posts

```
GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

---

## ⚠️ Catatan Teknis

* Backend menggunakan **Sanctum Token-based Authentication**
* Frontend menggunakan **React Query untuk caching data**
* Validasi ownership dilakukan di backend (secure)
* Frontend hanya untuk UI/UX
* Tidak menggunakan SSR untuk auth (client-side handling)
* Struktur backend mengikuti **Clean Architecture sederhana**

---

## 🚀 Keputusan Teknis

* Menggunakan **Service + Repository Pattern**
  → memisahkan logic bisnis dan akses database

* Menggunakan **React Query**
  → menghindari manual state management

* Menggunakan **Next.js App Router**
  → lebih modern dan scalable dibanding Pages Router

* Menggunakan **daisyUI**
  → mempercepat development UI tanpa design dari nol

---

## 👨‍💻 Author

Andra Elja Prama
