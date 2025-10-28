# 🎬 Movies & TV Shows — Backend README

> RESTful API for managing movies and TV shows (Express + TypeScript + Prisma)

<p align="center">
  <a href="https://backend-service-659948353959.us-central1.run.app/api/health">Live API</a> •
  <a href="#installation">Quick Start</a> •
  <a href="#api-endpoints">API Docs</a> •
  <a href="#deployment">Deploy</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.1-000000?logo=express" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-6.18-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker">
</p>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Docker](#docker)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- JWT authentication (httpOnly cookies)
- Google Cloud Storage for file uploads
- MySQL + Prisma (type-safe DB access)
- Full-text search (title, director, year)
- Pagination and filtering
- Zod schema validation
- CORS enabled
- Docker-ready and cloud deployable
- Modular controller/service architecture

---

## 🛠 Tech Stack

Core
- Express.js 5.1
- TypeScript 5.9
- Prisma 6.18
- MySQL 8.0

Auth & Security
- jsonwebtoken, bcryptjs, cookie-parser, cors

File Storage
- multer, @google-cloud/storage

Validation
- zod

---

## 🚀 Quick Start (Development)

Prerequisites:
- Node.js >= 18.x
- MySQL 8.0+ (or use a hosted DB)
- npm >= 10.x
- Google Cloud account for storage (optional for local dev)

Steps:

1. Navigate to backend folder
```bash
cd apps/backend
```

2. Install dependencies
```bash
npm install
```

3. Copy env example and edit
```bash
cp .env.example .env
```
Example `.env` keys:
```env
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-minimum-64-characters-long"
PORT=5000
NODE_ENV=development
GCS_BUCKET_NAME="movies-tvshows-app-posters"
GCP_PROJECT_ID="your-gcp-project-id"
GOOGLE_APPLICATION_CREDENTIALS="./gcp-service-account.json"
```

4. (Optional) Set up Google credentials
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./gcp-service-account.json"
```

5. Initialize database & generate Prisma client
```bash
npx prisma generate
npx prisma migrate dev --name init
# optional seed
npm run seed
```

6. Start dev server
```bash
npm run dev
# API: http://localhost:5000/api
```

---

## 📁 Project Structure (apps/backend)

- prisma/
  - migrations/
  - schema.prisma
- src/
  - controllers/
    - authController.ts
    - movieController.ts
  - middleware/
    - auth.ts
    - errorHandler.ts
    - upload.ts
    - validate.ts
  - routes/
    - authRoutes.ts
    - movieRoutes.ts
  - utils/
    - prismaClient.ts
  - validators/
    - schemas.ts
  - app.ts
- .env, .env.example, package.json, tsconfig.json

---

## 🗄️ Database (Prisma)

prisma/schema.prisma
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  movies    Movie[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Movie {
  id        Int      @id @default(autoincrement())
  title     String
  type      String   // "movie" or "tvshow"
  director  String
  budget    String?
  location  String?
  duration  String?
  year      String
  poster    String?  @db.VarChar(1024)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    Int

  @@fulltext([title, director, type, year])
}
```

Useful commands:
```bash
npx prisma migrate dev --name migration_name
npx prisma migrate deploy    # production
npx prisma generate
npx prisma migrate reset
npx prisma studio
npx prisma format
```

---

## 📚 API Endpoints

Base:
- Dev: http://localhost:5000/api
- Prod: https://backend-service-659948353959.us-central1.run.app/api

Auth
- POST /api/auth/register — register (public)
- POST /api/auth/login — login (public)
- POST /api/auth/logout — logout (protected)
- GET  /api/auth/me — current user (protected)

Movies
- GET /api/movies — list (paginated, public)
- GET /api/movies/:id — single movie (public)
- POST /api/movies — create (protected)
- PUT /api/movies/:id — update (owner only)
- DELETE /api/movies/:id — delete (owner only)

Examples (shortened):

Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

Create Movie (multipart/form-data)
```http
POST /api/movies
Cookie: token=...
Content-Type: multipart/form-data
title: "Inception"
type: "movie"
director: "Christopher Nolan"
year: "2010"
poster: [file]
```

List Movies
```http
GET /api/movies?page=1&limit=20&search=inception&type=movie
```

Health
```http
GET /api/health
# Response: { "message": "Server is running!", "timestamp": "..." }
```

---

## 🔐 Authentication

JWT stored in httpOnly cookies.

Token creation (example)
```ts
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET as string,
  { expiresIn: '7d' }
);
```

Cookie example
```ts
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

Protect middleware (example)
```ts
// middleware/auth.ts
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 📁 File Upload (Google Cloud Storage)

Upload middleware (overview)
```ts
// middleware/upload.ts
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({ projectId: process.env.GCP_PROJECT_ID });
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
});

export const uploadToGcs = async (req, res, next) => {
  if (!req.file) return next();

  const blob = bucket.file(`posters/${Date.now()}-${req.file.originalname}`);
  const stream = blob.createWriteStream({
    resumable: false,
    metadata: { contentType: req.file.mimetype }
  });

  stream.on('error', (err) => next(err));
  stream.on('finish', () => {
    req.file.path = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    next();
  });

  stream.end(req.file.buffer);
};
```

Supported formats: JPEG/JPG, PNG, GIF, WebP. Max size: 5MB.

Usage:
```ts
router.post(
  '/movies',
  protect,
  multerUpload.single('poster'),
  uploadToGcs,
  createMovie
);
```

---

## 🐳 Docker

Example Dockerfile (multi-stage)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx turbo run build --filter=backend

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma
EXPOSE 5000
CMD ["node", "dist/app.js"]
```

Build & run:
```bash
docker build -t movies-backend .
docker run -p 5000:5000 --env-file apps/backend/.env movies-backend
```

---

## ☁️ Deployment (Google Cloud Run)

Brief steps:
1. Configure gcloud and enable APIs
2. Create Artifact Registry
3. Build & push Docker image
4. Deploy to Cloud Run with environment variables
5. Run Prisma migrations in production:
```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

Example gcloud deploy command includes setting env vars, memory/cpu, and autoscaling.

Railway: create MySQL service, copy DATABASE_URL, run migrations.

---

## 🔧 Environment Variables

Required:
```env
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-minimum-64-characters-recommended"
PORT=5000
NODE_ENV=development
GCS_BUCKET_NAME="movies-tvshows-app-posters"
GCP_PROJECT_ID="your-gcp-project-id"
GOOGLE_APPLICATION_CREDENTIALS="./gcp-service-account.json" # optional
```

---

## 📊 Error Handling

Centralized error handler:
```ts
// middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
```

Common responses:
- 400 Validation error
- 401 Not authenticated
- 403 Forbidden
- 404 Not found
- 500 Internal server error

---

## 🧪 Testing

Manual examples with curl:

Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","name":"Test User"}'
```

Login & store cookies:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}' \
  -c cookies.txt
```

Get current user:
```bash
curl http://localhost:5000/api/auth/me -b cookies.txt
```

Create movie:
```bash
curl -X POST http://localhost:5000/api/movies \
  -b cookies.txt \
  -F "title=Inception" \
  -F "type=movie" \
  -F "director=Christopher Nolan" \
  -F "year=2010" \
  -F "poster=@/path/to/image.jpg"
```

List movies:
```bash
curl "http://localhost:5000/api/movies?page=1&limit=20"
```

---

## 🤝 Contributing

See the main README at ../../README.md for contribution guidelines.

---

## 📄 License

MIT — see ../../LICENSE

---

Made with ❤️ using Express & TypeScript — Back to Main README: https://github.com/premchand505/movies-tvshows-app