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
// --- CHANGE IS HERE ---
// Import both new middleware functions
import { multerUpload, uploadToGcs } from '../middleware/upload';

const router = Router();

// Apply the 'protect' middleware to all routes in this file.
// This means a user must be logged in to access any of these endpoints.
router.use(protect);

// Route to get all movies (with search/pagination) and create a new movie
router
  .route('/')
  .get(getMovies)
  // --- CHANGE IS HERE ---
  // We now run three middlewares for this route:
  // 1. multerUpload: Parses the form data and finds the 'poster' file in memory.
  // 2. uploadToGcs: Takes the file from memory, uploads to GCS, and adds the URL to req.file.path.
  // 3. validate: Validates the text fields in req.body.
  .post(
    multerUpload.single('poster'), 
    uploadToGcs, 
    validate(movieSchema), 
    createMovie
  );

// Routes for a specific movie by its ID
router
  .route('/:id')
  .get(getMovieById)
  // --- CHANGE IS HERE ---
  // Apply the same three-middleware chain for updating the movie.
  .put(
    multerUpload.single('poster'), 
    uploadToGcs, 
    validate(updateMovieSchema), 
    updateMovie
  )
  .delete(deleteMovie);

export default router;