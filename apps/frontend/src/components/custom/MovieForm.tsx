import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Movie } from '@repo/types';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the form's validation schema using Zod
const movieFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  // The field is required by default. Removing the params object fixes the error.
  type: z.enum(['Movie', 'TV Show']),
  director: z.string().min(1, 'Director is required'),
  year: z.string().min(4, 'Year is required').max(10),
  budget: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  poster: z.any().optional(),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

interface MovieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: Movie | null;
  isSubmitting: boolean;
}

export const MovieForm = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: MovieFormProps) => {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'Movie',
      director: initialData?.director || '',
      year: initialData?.year || '',
      budget: initialData?.budget || '',
      location: initialData?.location || '',
      duration: initialData?.duration || '',
      poster: undefined,
    },
  });

  const posterFileRef = form.register("poster");

  const handleSubmit = (values: MovieFormValues) => {
    const formData = new FormData();
    
    (Object.keys(values) as Array<keyof MovieFormValues>).forEach(key => {
      const value = values[key];
      if (key === 'poster' && value instanceof FileList && value.length > 0) {
        formData.append('poster', value[0]);
      } else if (key !== 'poster' && value != null) {
        formData.append(key, value as string);
      }
    });

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of your entry.' : 'Fill in the details for your new entry.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="type" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="Movie">Movie</SelectItem><SelectItem value="TV Show">TV Show</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
            )} />
            <FormField name="director" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Director</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="year" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Year / Time</FormLabel><FormControl><Input placeholder="e.g., 2024 or 2008-2013" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="poster" control={form.control} render={() => (
                <FormItem><FormLabel>Poster Image</FormLabel><FormControl><Input type="file" {...posterFileRef} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};