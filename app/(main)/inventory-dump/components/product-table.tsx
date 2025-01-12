"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { LineWave } from "react-loader-spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  error: string;
}

export function ProductTable<TData, TValue>({
  columns,
  data,
  loading,
  error,
}: ProductTableProps<TData, TValue>) {
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10; // Update to 10 items per page
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: itemsPerPage,
      },
    },
    pageCount: Math.ceil(data.length / itemsPerPage),
  });

  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-slate-50" key={headerGroup.id}>
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
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <LineWave
                  visible={true}
                  height="100"
                  width="100"
                  color="#00a3ff"
                  ariaLabel="line-wave-loading"
                  wrapperStyle={{}}
                  wrapperClass="justify-center h-[300px] items-center"
                  firstLineColor=""
                  middleLineColor=""
                  lastLineColor=""
                />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-red-500"
              >
                Error loading data: {error}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 py-4 px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
