export interface Movie {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  year: string;
  budget?: string | null;
  location?: string | null;
  duration?: string | null;
  poster?: string | null;
  createdAt: string; // Dates are typically strings in JSON
  updatedAt: string;
  userId: number;
}