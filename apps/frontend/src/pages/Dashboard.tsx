// src/pages/Dashboard.tsx
import { useState } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { MovieTable } from '@/components/custom/MovieTable';
import { getColumns } from '@/components/custom/MovieTableColumns';
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
import { PlusCircle } from 'lucide-react';

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { movies, isLoading, hasMore, loadMore, setMovies } = useInfiniteScroll(searchTerm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingMovie) {
        const response = await apiClient.put(`/movies/${editingMovie.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMovies(prev => prev.map(m => m.id === editingMovie.id ? response.data : m));
      } else {
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
      setDeletingMovie(null);
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

  const columns = getColumns({ onEdit: openFormForEdit, onDelete: setDeletingMovie });

  return (
    <div className="container py-8 md:py-12 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between mb-8 md:px-5">
        <div >
          <h1 className="text-3xl font-bold text-center tracking-tighter md:text-4xl">Your Collection</h1>
          <p className="text-muted-foreground text-center mt-1">Browse, search, and manage your movies and TV shows.</p>
        </div>
        <Button onClick={openFormForNew} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5"/>
          <span >Add New Entry</span>
        </Button>
      </div>

      <SearchFilter onSearchChange={setSearchTerm} />
      
      <div className="mt-8 px-10">
        <MovieTable columns={columns} data={movies} />
      </div>

      <div className="flex justify-center mt-8">
        {hasMore && (
          <Button onClick={loadMore} disabled={isLoading} variant="secondary">
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-muted-foreground text-sm">You've reached the end of your collection.</p>
        )}
      </div>

      {isFormOpen && (
        <MovieForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          initialData={editingMovie}
          isSubmitting={isSubmitting}
        />
      )}

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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;