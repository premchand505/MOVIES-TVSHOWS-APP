// src/components/custom/MovieTable.tsx
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "../ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// Updated MovieCard component for mobile/tablet screens.
const MovieCard = <TData,>({ row }: { row: Row<TData> }) => {
    const posterCell = row.getVisibleCells().find(cell => cell.column.id === 'poster');
    const titleCell = row.getVisibleCells().find(cell => cell.column.id === 'title');
    const typeCell = row.getVisibleCells().find(cell => cell.column.id === 'type');
    const directorCell = row.getVisibleCells().find(cell => cell.column.id === 'director');
    const yearCell = row.getVisibleCells().find(cell => cell.column.id === 'year');
    const actionsCell = row.getVisibleCells().find(cell => cell.column.id === 'actions');

    return (
        <Card className="overflow-hidden relative">
            {/* Actions Menu (Positioned relative to the card for consistent placement) */}
            {actionsCell && (
                <div className="absolute top-4 right-4 z-10">
                    {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                </div>
            )}

            {/* Main content container with consistent top alignment */}
            <div className="flex items-center gap-12 px-4">
                {/* Left Side: Poster Image */}
                {posterCell && (
                    <div className="flex shrink-0">
                        {flexRender(posterCell.column.columnDef.cell, posterCell.getContext())}
                    </div>
                )}

                {/* Right Side: Textual Data with padding to avoid overlap with actions */}
                <div className="flex-1 flex-col  min-w-0 pr-4">
                    {titleCell && <div className="font-bold text-lg truncate">{flexRender(titleCell.column.columnDef.cell, titleCell.getContext())}</div>}
                    {directorCell && <div className="text-sm text-muted-foreground truncate">{flexRender(directorCell.column.columnDef.cell, directorCell.getContext())}</div>}
                    
                    <div className="flex items-center flex-wrap gap-2 mt-2 text-xs">
                        {typeCell && <span className="inline-block bg-secondary text-secondary-foreground font-medium px-2 py-0.5 rounded-md">{flexRender(typeCell.column.columnDef.cell, typeCell.getContext())}</span>}
                        {yearCell && <span className="text-muted-foreground">{flexRender(yearCell.column.columnDef.cell, yearCell.getContext())}</span>}
                    </div>
                </div>
            </div>
        </Card>
    );
};


export function MovieTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {/* Mobile & Tablet View (up to 768px): A grid of cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden ">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <MovieCard key={row.id} row={row} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-10">
            No results found.
          </div>
        )}
      </div>

      {/* Desktop View (768px and wider): A traditional table */}
      <div className="hidden rounded-md border md:block ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}