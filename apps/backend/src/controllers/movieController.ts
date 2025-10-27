import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prismaClient';
import { AuthRequest } from '../middleware/auth';
import path from 'path';

// --- Create a new Movie ---
export const createMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, type, director, year, budget, location, duration } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Correctly gets the full public URL from GCS
    const posterPath = req.file ? (req.file as any).path : undefined;

    const movie = await prisma.movie.create({
      data: {
        title,
        type,
        director,
        year,
        budget,
        location,
        duration,
        poster: posterPath,
        userId: userId,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

// --- Get all Movies (with pagination and search) ---
export const getMovies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search as string || '';

    const whereClause = {
      userId: userId,
      ...(searchTerm && {
        OR: [
          { title: { search: `${searchTerm}*` } },
          { director: { search: `${searchTerm}*` } },
          { type: { search: `${searchTerm}*` } },
          { year: { search: `${searchTerm}*` } },
        ],
      }),
    };

    const movies = await prisma.movie.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalMovies = await prisma.movie.count({ where: whereClause });

    res.status(200).json({
      data: movies,
      pagination: {
        total: totalMovies,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalMovies / limit),
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Get a single Movie by ID ---
export const getMovieById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const movie = await prisma.movie.findFirst({
      where: { id: parseInt(id), userId: userId },
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found or you do not have permission to view it' });
    }

    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

// --- Update a Movie ---
export const updateMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const existingMovie = await prisma.movie.findFirst({
      where: { id: parseInt(id), userId: userId },
    });
    
    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie not found or you do not have permission to edit it' });
    }

    // --- CHANGE IS HERE ---
    // Use the full GCS path from the file object, just like in createMovie
    const posterPath = req.file ? (req.file as any).path : req.body.poster;

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: { ...req.body, poster: posterPath },
    });

    res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

// --- Delete a Movie ---
export const deleteMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const movieToDelete = await prisma.movie.findFirst({
      where: { id: parseInt(id), userId: userId },
    });

    if (!movieToDelete) {
      return res.status(404).json({ message: 'Movie not found or you do not have permission to delete it' });
    }
    
    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};