"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Movie } from "@repo/types"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the function signatures for our actions
interface GetColumnsProps {
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

// Convert the columns array into a function that accepts our action handlers
export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Movie>[] => [
  {
    accessorKey: "poster",
    header: "Poster",
    cell: ({ row }) => {
      const posterUrl = row.original.poster;
      const fullUrl = posterUrl ? `http://localhost:5000${posterUrl}` : 'https://via.placeholder.com/40x60';
      return <img src={fullUrl} alt="Poster" className="h-16 w-auto rounded" />;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
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
            {/* Call the onEdit function when clicked */}
            <DropdownMenuItem onClick={() => onEdit(movie)}>
              Edit
            </DropdownMenuItem>
            {/* Call the onDelete function when clicked */}
            <DropdownMenuItem onClick={() => onDelete(movie)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];