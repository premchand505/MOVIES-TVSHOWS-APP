import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// Import routes and middleware
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://movies-tvshows-app.vercel.app'],
  
  credentials: true, // To allow cookies
}));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Serve static files from the "uploads" directory
// This makes images accessible via URLs like http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Simple health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running!' });
});

// --- Global Error Handler ---
// This must be the last piece of middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});