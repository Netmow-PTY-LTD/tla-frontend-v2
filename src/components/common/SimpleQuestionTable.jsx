'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { showSuccessToast } from './toasts';
import { useUpdateQuestionOrderMutation } from '@/store/features/admin/questionApiService';

export function SimpleQuestionTable({
  data,
  setData,
  columns,
  searchColumn,
  isDragEnabled,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [visibleRows, setVisibleRows] = React.useState([]);
  const [order, setOrder] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Update visibleRows whenever table row model changes
  React.useEffect(() => {
    setVisibleRows(table.getRowModel().rows);
  }, [table.getRowModel().rows]);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
  };

  //update question order

  const [updateQuestionOrder] = useUpdateQuestionOrderMutation();

  const handleDrop = async (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedRows = [...visibleRows];
    const [moved] = updatedRows.splice(draggedIndex, 1);
    updatedRows.splice(targetIndex, 0, moved);

    // Assign new order based on current index
    const orderArray = updatedRows.map((row, index) => ({
      _id: row.id, // assuming each row has _id
      order: index + 1, // you can start from 0 if needed
    }));

    // You can now use orderArray to update backend or internal state
  
    setVisibleRows(updatedRows); // Update visibleRows for visual movement
    setDraggedIndex(null);

    // 🔥 Call the API
    try {
      const response = await updateQuestionOrder(orderArray).unwrap();
 
      showSuccessToast(response?.message || 'Order updated successfully:');
    } catch (error) {
      console.error('Failed to update question order:', error);
      // Optionally revert the state if the API fails
    }
  };

  console.log('isDragEnabled within table', isDragEnabled);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          value={table.getColumn(searchColumn)?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows?.length ? (
              visibleRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  draggable={isDragEnabled}
                  onDragStart={
                    isDragEnabled ? () => handleDragStart(index) : undefined
                  }
                  onDragOver={isDragEnabled ? handleDragOver : undefined}
                  onDrop={isDragEnabled ? () => handleDrop(index) : undefined}
                  className={
                    isDragEnabled
                      ? 'cursor-move'
                      : 'cursor-default pointer-events-none'
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
