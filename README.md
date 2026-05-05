# Garuda Cyber Tes - Laravel API + Next.js Frontend

## Overview
Full-stack app dengan **Laravel 11 (API)** + **Next.js 15 (App Router)** untuk manajemen posts.

**Features:**
- User authentication (register/login/logout)
- CRUD Posts dengan ownership check (hanya bisa edit/delete own posts)
- View all posts from all users
- Search & pagination
- Responsive UI (Tailwind + daisyUI)

## Tech Stack
```
Backend: Laravel 11 + Sanctum + MySQL
Frontend: Next.js 15 + React Query + Tailwind + TypeScript
Repository Pattern + Service Layer (Clean Architecture)
```

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repo-url>
cd garuda_cyber_tes
```

### 2. Backend Setup (Laravel)
```bash
cd backend

# Copy env
cp .env.example
