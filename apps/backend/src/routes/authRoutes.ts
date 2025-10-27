import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema } from '../validators/schemas';
import { protect } from '../middleware/auth';
const router = Router();

// Route for user registration
// POST /api/auth/register
router.get('/me', protect, getMe);
// We use the 'validate' middleware to ensure the request body matches the 'registerUserSchema'
router.post('/register', validate(registerUserSchema), register);

// Route for user login
// POST /api/auth/login
router.post('/login', validate(loginUserSchema), login);

// Route for user logout
// POST /api/auth/logout
router.post('/logout', logout);

export default router;