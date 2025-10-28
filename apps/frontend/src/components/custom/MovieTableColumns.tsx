// src/components/custom/MovieTableColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Movie } from "@repo/types"
import { MoreHorizontal, ImageOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GetColumnsProps {
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Movie>[] => [
  {
    accessorKey: "poster",
    header: "Poster",
    cell: ({ row }) => {
      const posterUrl = row.original.poster;
      const title = row.original.title;
      return posterUrl ? (
        <img 
          src={posterUrl} 
          alt={`Poster for ${title}`} 
          className="h-40 w-auto object-cover rounded-md aspect-2/3" // Increased height
          width={64} // Adjusted width for 2/3 aspect ratio
          height={96} // h-24 = 96px
        />
      ) : (
        <div className="h-24 w-16 bg-secondary rounded-md flex items-center  justify-center"> {/* Matched placeholder size */}
            <ImageOff className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-semibold text-md ">{row.original.title}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    
  },
  {
    accessorKey: "director",
    header: "Director",
       
  },
  {
    accessorKey: "year",
    header: "Year",
       
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const movie = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(movie)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(movie)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];