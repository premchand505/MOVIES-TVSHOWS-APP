import { z } from 'zod';

// Schema for user registration
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

// Schema for user login
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Schema for creating a movie entry
export const movieSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['Movie', 'TV Show']),
    director: z.string().min(1, 'Director is required'),
    year: z.string().min(4, 'Year is required'),
    budget: z.string().optional(),
    location: z.string().optional(),
    duration: z.string().optional(),
    poster: z.string().optional(), // We'll handle file uploads separately
  }),
});

// Schema for updating a movie entry (all fields are optional)
export const updateMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    type: z.enum(['Movie', 'TV Show']).optional(),
    director: z.string().min(1, 'Director is required').optional(),
    year: z.string().min(4, 'Year is required').optional(),
    budget: z.string().optional(),
    location: z.string().optional(),
    duration: z.string().optional(),
    poster: z.string().optional(),
  }),
});