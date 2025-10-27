import { Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';

// This function is a middleware generator.
// It takes a Zod schema and returns an Express middleware function.
// We use z.Schema as a more generic type that works for any Zod schema.
export const validate = (schema: z.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Attempt to parse and validate the request body, query, and params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // If validation is successful, proceed to the next middleware/controller
      return next();
    } catch (error) {
      // If validation fails, Zod throws an error. We catch it here.
      if (error instanceof z.ZodError) {
        // Format the error messages and send a 400 Bad Request response
        // Use the '.issues' property which is standard in Zod v3+
        return res.status(400).json({
          message: 'Validation failed',
          // Explicitly type 'e' as ZodIssue to satisfy TypeScript's rules
          errors: error.issues.map((e: ZodIssue) => ({ path: e.path.join('.'), message: e.message })),
        });
      }
      // For any other unexpected errors, pass them to the global error handler
      next(error);
    }
  };