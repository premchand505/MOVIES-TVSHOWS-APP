import { Router } from 'express';
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { movieSchema, updateMovieSchema } from '../validators/schemas';
import upload from '../middleware/upload';

const router = Router();

// Apply the 'protect' middleware to all routes in this file.
// This means a user must be logged in to access any of these endpoints.
router.use(protect);

// Route to get all movies (with search/pagination) and create a new movie
router
  .route('/')
  .get(getMovies)
  // 'upload.single('poster')' handles a single file upload from a form field named 'poster'
  .post(upload.single('poster'), validate(movieSchema), createMovie);

// Routes for a specific movie by its ID
router
  .route('/:id')
  .get(getMovieById)
  // 'upload.single('poster')' is also used here for updating the movie poster
  .put(upload.single('poster'), validate(updateMovieSchema), updateMovie)
  .delete(deleteMovie);

export default router;