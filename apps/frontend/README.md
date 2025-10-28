# 🎬 Movies & TV Shows — Frontend

A modern React + TypeScript frontend for managing movies and TV shows. Built with Vite, Tailwind CSS, and shadcn/ui components for a clean, responsive, and accessible UI.

<p align="center">
  <a href="https://movies-tvshows-app.vercel.app">Live Demo</a> •
  <a href="#installation">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#project-structure">Project Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/shadcn/ui-Latest-000000" alt="shadcn/ui">
</p>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- Responsive, accessible UI with light/dark mode
- Authentication (register/login) with JWT cookies
- CRUD for movies and TV shows (create, read, update, delete)
- Poster image uploads (multipart/form-data)
- Search, sorting, filtering, infinite scroll / pagination
- Interactive data table with TanStack Table
- Toast notifications and modals (shadcn/ui + Radix primitives)

---

## 🛠 Tech Stack

Core:
- React 18.2, TypeScript 5.2, Vite 5.2

Routing & State:
- React Router v6, Context API

Styling & UI:
- Tailwind CSS 3.4, shadcn/ui, Radix UI, Lucide React

Forms & Validation:
- React Hook Form, Zod, @hookform/resolvers

Data & HTTP:
- Axios, TanStack Table

Build & Deploy:
- Vercel (recommended), standard Vite build

---

## 🚀 Installation

Prerequisites:
- Node.js >= 18
- npm >= 10.5

Quick start:

```bash
# go to frontend app
cd apps/frontend

# install dependencies
npm install

# copy example env
cp .env.example .env.local

# start dev server
npm run dev
```

Default dev URL: http://localhost:5173

Set API URL in `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

Top-level frontend structure (apps/frontend):

- public/ — static assets
- src/
  - components/
    - custom/ — app-specific components (MainLayout, MovieForm, MovieTable)
    - ui/ — shadcn/ui wrappers (Button, Input, Dialog, Table, etc.)
  - context/ — AuthContext and other providers
  - pages/ — Login, Signup, Dashboard
  - services/ — Axios instance and API wrappers
  - lib/ — utils and helpers
  - App.tsx, main.tsx, index.css
- package.json, tsconfig.json, vite.config.ts, tailwind.config.js

---

## 🧩 Key Components (examples)

Main layout (simplified):

```tsx
// src/components/custom/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Movies & TV Shows</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.email}</span>
              <Button onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </nav>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

Movie form (zod + react-hook-form):

```tsx
// src/components/custom/MovieForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const movieSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['movie', 'tvshow']),
  director: z.string().min(1),
  year: z.string().regex(/^\d{4}$/),
  // ...other fields
});

export function MovieForm({ onSubmit, defaultValues }) {
  const form = useForm({ resolver: zodResolver(movieSchema), defaultValues });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register('title')} placeholder="Title" />
      <Input {...form.register('director')} placeholder="Director" />
      <Input {...form.register('year')} placeholder="Year" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

Movie table (TanStack table boilerplate):

```tsx
// src/components/custom/MovieTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Table } from '@/components/ui/table';

export function MovieTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-auto">
      <Table>{/* render rows/headers using table instance */}</Table>
    </div>
  );
}
```

---

## 🗺️ Routing

App routes use React Router v6. Example:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/custom/MainLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

ProtectedRoute:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
}
```

---

## 🔄 State Management — AuthContext

Basic example using Context API and Axios:

```tsx
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
  };

  const register = async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

---

## 🌐 API Integration

Axios instance:

```ts
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) window.location.href = '/login';
    return Promise.reject(err);
  }
);

export default api;
```

API wrappers:

```ts
// src/services/api.ts
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const movieAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getOne: (id) => api.get(`/movies/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'poster' && v?.[0]) formData.append('poster', v[0]);
      else formData.append(k, v);
    });
    return api.post('/movies', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'poster' && v?.[0]) formData.append('poster', v[0]);
      else formData.append(k, v);
    });
    return api.put(`/movies/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (id) => api.delete(`/movies/${id}`),
};
```

---

## 🎨 Styling

Tailwind config (key parts):

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: { /* theme variables */ },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

Global styles:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme variables and base styles */
:root { --background: 0 0% 100%; --foreground: 222.2 84% 4.9%; --radius: 0.5rem; }
.dark { --background: 222.2 84% 4.9%; --foreground: 210 40% 98%; }

body { @apply bg-background text-foreground; }
```

---

## ☁️ Deployment (Vercel)

Recommended steps:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd apps/frontend
vercel --prod
```

Vercel rewrites (serve SPA routing):
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend.example/api
```

---

## 🔧 Environment Variables

- Development (.env.local)
  - VITE_API_URL=http://localhost:5000/api

- Production (Vercel)
  - VITE_API_URL=https://backend-service-xxxxx.run.app/api

Note: Client-exposed env variables must be prefixed with VITE_.

---

## 🛠 Development Scripts

Available scripts (from packages/package.json):

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🤝 Contributing

See the main repository README at ../../README.md for contribution guidelines. Please follow code style, write tests where appropriate, and open PRs to develop/main as defined by the project.

---

## 📄 License

MIT — see the LICENSE at ../../LICENSE.

---

Made with ❤️ using React & Vite — back to the main repo: https://github.com/yourusername/movies-tvshows-app