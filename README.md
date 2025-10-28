# 🎬 Movies & TV Shows Management App

<p align="center">
  <strong>Full‑stack application for managing your favorite movies and TV shows</strong>
</p>

<p align="center">
  <a href="https://movies-tvshows-app.vercel.app">Live Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#deployment">Deploy</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5.1-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-6.18-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/Turborepo-Ready-EF4444?logo=turborepo" alt="Turborepo" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Docker](#docker)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

A modern, full‑stack application built with a monorepo architecture (Turborepo). Manage a collection of movies and TV shows with features such as image uploads, search, infinite scroll, and full CRUD support.

- Frontend: https://movies-tvshows-app.vercel.app
- Backend API: https://backend-service-659948353959.us-central1.run.app

---

## ✨ Features

- Authentication & authorization (JWT, HttpOnly cookies)
- User registration, login, logout, and current user endpoint
- Full CRUD for movies/TV shows
- Image upload to Google Cloud Storage (GCS)
- Full‑text search, filtering, and infinite scroll pagination
- Rich metadata (director, year, budget, duration, location)
- Responsive UI with Tailwind CSS and shadcn/ui
- Form validation with Zod, notifications, and table views

---

## 🛠 Tech Stack

Monorepo + npm workspaces managed by Turborepo.

Frontend:
- React 18.2, TypeScript 5.2, Vite, React Router, TanStack Table, Tailwind CSS, shadcn/ui, Axios, React Hook Form, Zod

Backend:
- Express 5.1, TypeScript 5.9, Prisma 6.18, MySQL 8.0, JWT, bcrypt, multer, Google Cloud Storage SDK

Infrastructure:
- Railway (MySQL), Google Cloud Run (backend), Vercel (frontend), Google Cloud Storage (images), Docker for containerization

---

## 📁 Project Structure

movies-tvshows-app/
- apps/
  - backend/         # Express API
    - prisma/
      - migrations/
      - schema.prisma
    - src/
      - controllers/
      - middleware/
      - routes/
      - utils/
      - validators/
      - app.ts
    - .env
    - package.json
    - tsconfig.json
  - frontend/        # React app
    - src/
      - components/
      - context/
      - pages/
      - services/
    - package.json
    - vite.config.ts
- packages/
  - types/           # Shared TypeScript types
- Dockerfile
- docker-compose.yml
- turbo.json
- package.json
- README.md

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 10+
- MySQL 8.0+ (or Railway)
- Google Cloud account (for image storage)
- Docker (optional)

### Installation

1. Clone repository
```bash
git clone https://github.com/yourusername/movies-tvshows-app.git
cd movies-tvshows-app
```

2. Install dependencies
```bash
npm install
```

3. Copy environment files
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Set up Google Cloud credentials and export
```bash
# Save service account JSON to apps/backend/gcp-service-account.json
export GOOGLE_APPLICATION_CREDENTIALS="./apps/backend/gcp-service-account.json"
```

6. Initialize database
```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev
cd ../..
```

7. Start development servers
```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## 💻 Development

Available scripts (examples):

Root:
```bash
npm run dev     # Start all apps in development mode
npm run build   # Build all apps
npm run lint    # Lint all apps
```

Backend (apps/backend):
```bash
npm run dev     # Start with nodemon
npm run build   # Compile TypeScript
npm run start   # Run production build
npm run prisma  # Prisma CLI helper
```

Frontend (apps/frontend):
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

### Database Migrations
```bash
cd apps/backend
npx prisma migrate dev --name migration_name
npx prisma migrate deploy      # production
npx prisma migrate reset
npx prisma studio
```

---

## 🐳 Docker

Build and run the backend:
```bash
# Build
docker build -t movies-tvshows-app-backend .

# Run
docker run -p 5000:5000 --env-file apps/backend/.env movies-tvshows-app-backend
```

Docker Compose:
```bash
docker-compose up            # Start all services
docker-compose up -d         # Run in background
docker-compose logs -f       # Follow logs
docker-compose down          # Stop services
```

---

## ☁️ Deployment

### Backend (Google Cloud Run)

1. Build and push Docker image to Artifact Registry
```bash
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
REPO_NAME="movies-tvshows-app"
IMAGE_NAME="backend"

gcloud auth configure-docker $REGION-docker.pkg.dev
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME
```

2. Deploy to Cloud Run
```bash
gcloud run deploy backend-service \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME \
  --region $REGION \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars DATABASE_URL="mysql://user:password@host:port/database" \
  --set-env-vars JWT_SECRET="your-secret" \
  --set-env-vars GCS_BUCKET_NAME="your-bucket" \
  --set-env-vars GCP_PROJECT_ID="your-project-id" \
  --set-env-vars NODE_ENV="production" \
  --min-instances 0 \
  --max-instances 10
```

3. Run database migrations
```bash
cd apps/backend
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Frontend (Vercel)
```bash
npm install -g vercel
cd apps/frontend
vercel --prod
# Set VITE_API_URL in the Vercel project environment variables
```

---

## 🔐 Environment Variables

Backend (apps/backend/.env)
- DATABASE_URL — MySQL connection string (e.g. mysql://user:pass@host:port/db)
- JWT_SECRET — Secret key for JWT signing (use a strong, long secret)
- PORT — Server port (default 5000)
- NODE_ENV — development | production
- GCS_BUCKET_NAME — Google Cloud Storage bucket name
- GCP_PROJECT_ID — Google Cloud project id

Frontend (apps/frontend/.env.local)
- VITE_API_URL — Backend API base URL (e.g. http://localhost:5000/api)

---

## 📚 API Documentation

Base URLs:
- Development: http://localhost:5000/api
- Production: https://backend-service-659948353959.us-central1.run.app/api

Authentication
- POST /auth/register
- POST /auth/login
- GET /auth/me (requires cookie token)
- POST /auth/logout

Movie Endpoints
- GET /movies?page=1&limit=20&search=inception&type=movie
- GET /movies/:id
- POST /movies (multipart/form-data, auth required)
- PUT /movies/:id (multipart/form-data, auth required)
- DELETE /movies/:id (auth required)

Health Check
- GET /health

For fuller backend/frontend docs, see:
- apps/backend/README.md
- apps/frontend/README.md

---

## 🤝 Contributing

Contributions welcome — please follow:

1. Fork the repo
2. Create a branch: git checkout -b feature/your-feature
3. Make changes, commit with meaningful messages
4. Push branch and open a Pull Request

Commit message conventions:
- feat:, fix:, docs:, style:, refactor:, test:, chore:

---

## 📄 License

MIT License

```
MIT License

Copyright (c) 2025 Movies & TV Shows App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Turborepo — Monorepo build system
- shadcn/ui — UI components
- Prisma — ORM
- Railway — Database hosting
- Google Cloud — Infrastructure

<p align="center">
  Made with ❤️ using React & Express
  <br><br>
  <a href="https://github.com/yourusername/movies-tvshows-app/issues">Report Bug</a> •
  <a href="https://github.com/premchand505/movies-tvshows-app/issues">Request Feature</a>
</p>
```