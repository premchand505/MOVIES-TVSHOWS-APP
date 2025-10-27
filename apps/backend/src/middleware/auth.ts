import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a new type for the request object that includes our custom 'user' property
export interface AuthRequest extends Request {
  user?: { userId: number };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get the token from the httpOnly cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Attach user payload to the request object
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};