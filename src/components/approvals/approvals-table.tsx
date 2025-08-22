
'use client';
import * as React from 'react';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
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
import { type Lead, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface ApprovalsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
  onApprove: (lead: Lead) => void;
}

const getStatusVariant = (status?: 'Pending' | 'Approved' | 'Needs Changes') => {
    switch (status) {
        case 'Approved':
            return 'default';
        case 'Needs Changes':
            return 'destructive';
        case 'Pending':
        default:
            return 'secondary';
    }
}

export function ApprovalsTable({ leads, onViewDetails, onApprove }: ApprovalsTableProps) {
  
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'title',
      header: 'Deal',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => <div>{row.getValue('company')}</div>,
    },
    {
      accessorKey: 'ownerId',
      header: 'Owner',
      cell: ({ row }) => {
        const owner = users.find(user => user.id === row.getValue('ownerId'));
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={owner?.avatar} />
              <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {owner?.name}
          </div>
        )
      },
    },
     {
      accessorKey: 'internalReviewData.cstReviewStatus',
      header: 'CST Review',
       cell: ({ row }) => {
        const status = row.original.internalReviewData?.cstReviewStatus;
        return <Badge variant={getStatusVariant(status)}>{status || 'N/A'}</Badge>;
      }
    },
    {
      accessorKey: 'internalReviewData.croReviewStatus',
      header: 'CRO Review',
      cell: ({ row }) => {
        const status = row.original.internalReviewData?.croReviewStatus;
        return <Badge variant={getStatusVariant(status)}>{status || 'N/A'}</Badge>;
      }
    },
    {
        accessorKey: 'internalReviewData.finalApprovalDate',
        header: 'Approval Date',
        cell: ({ row }) => {
            const date = row.original.internalReviewData?.finalApprovalDate;
            return <div>{date ? format(new Date(date), 'PPP') : 'N/A'}</div>;
        }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails(lead)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApprove(lead)}>
                Review & Approve
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: leads,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by company..."
          value={(table.getColumn('company')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('company')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No deals awaiting approval.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s).
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

    