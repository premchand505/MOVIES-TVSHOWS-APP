import { useState } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { MovieTable } from '@/components/custom/MovieTable';
import { getColumns } from '@/components/custom/MovieTableColumns'; // Updated import
import { Button } from '@/components/ui/button';
import { MovieForm } from '@/components/custom/MovieForm';
import apiClient from '@/services/api';
import { Movie } from '@repo/types';
import SearchFilter from '@/components/custom/SearchFilter'; 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardPage = () => {
const [searchTerm, setSearchTerm] = useState('');
  const { movies, isLoading, hasMore, loadMore, setMovies } = useInfiniteScroll(searchTerm);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to hold the movie currently being edited or deleted
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingMovie) {
        // --- UPDATE LOGIC ---
        const response = await apiClient.put(`/movies/${editingMovie.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMovies(prev => prev.map(m => m.id === editingMovie.id ? response.data : m));
      } else {
        // --- CREATE LOGIC ---
        const response = await apiClient.post('/movies', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMovies(prev => [response.data, ...prev]);
      }
      closeForm();
    } catch (error) {
      console.error('Failed to save movie:', error);
      alert('Failed to save movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMovie) return;
    try {
      await apiClient.delete(`/movies/${deletingMovie.id}`);
      setMovies(prev => prev.filter(m => m.id !== deletingMovie.id));
      setDeletingMovie(null); // Close the dialog
    } catch (error) {
      console.error('Failed to delete movie:', error);
      alert('Failed to delete movie. Please try again.');
    }
  };

  const openFormForEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };
  
  const openFormForNew = () => {
    setEditingMovie(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };
  
  // Memoize columns to prevent re-renders
  const columns = getColumns({ onEdit: openFormForEdit, onDelete: setDeletingMovie });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Collection</h1>
        <Button onClick={openFormForNew}>Add New</Button>
      </div>

<SearchFilter onSearchChange={setSearchTerm} />
      <MovieTable columns={columns} data={movies} />

      <div className="flex justify-center mt-6">
        {hasMore && (
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-muted-foreground">You've reached the end!</p>
        )}
      </div>

      {/* Reusable Movie Form Dialog */}
      {isFormOpen && (
        <MovieForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          initialData={editingMovie}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMovie} onOpenChange={() => setDeletingMovie(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entry for "{deletingMovie?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;