import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/api';
import { Movie } from '@repo/types';

interface PaginatedResponse {
  data: Movie[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const useInfiniteScroll = (searchTerm: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PaginatedResponse>('/movies', {
        params: { page: currentPage, limit: 20, search },
      });
      const { data, pagination } = response.data;
      
      setMovies(prevMovies => 
        currentPage === 1 ? data : [...prevMovies, ...data]
      );
      setHasMore(pagination.page < pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // We keep the old data while the new search is loading to prevent flickering.
    // setMovies([]); // <--- THIS LINE IS REMOVED
    setPage(1);
    setHasMore(false);
    fetchMovies(1, searchTerm);
  }, [searchTerm, fetchMovies]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, searchTerm);
    }
  };

  return { movies, isLoading, hasMore, loadMore, setMovies };
};

export default useInfiniteScroll;