# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json and lock file
COPY package.json package-lock.json ./

# Install root dependencies
RUN npm install

# Copy the rest of the monorepo source code
COPY . .

# Build only the backend application
RUN npx turbo run build --filter=backend

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
# --- CHANGE IS HERE ---
# Copy the hoisted node_modules from the root of the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

CMD ["node", "dist/app.js"]