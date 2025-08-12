
'use client';
import * as React from 'react';
import {
  CaretSortIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Lead } from '@/lib/data';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

const goLiveStageIds = ['col-go-live'];

interface GoLiveTableProps {
  onViewDetails: (lead: Lead) => void;
  leads: Lead[];
}

export function GoLiveTable({ onViewDetails, leads }: GoLiveTableProps) {
  const data = React.useMemo(() => leads.filter(lead => goLiveStageIds.includes(lead.columnId)), [leads]);
  
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'title',
      header: 'Project',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => <div>{row.getValue('company')}</div>,
    },
    {
      accessorKey: 'goLiveAndSupportData.goLiveDate',
      header: 'Go-Live Date',
      cell: ({ row }) => {
        const date = row.original.goLiveAndSupportData?.goLiveDate;
        return <div>{date ? format(new Date(date), 'PPP') : 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'goLiveAndSupportData.deploymentStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.goLiveAndSupportData?.deploymentStatus;
        return status ? <Badge>{status}</Badge> : 'N/A';
      },
    },
    {
      accessorKey: 'goLiveAndSupportData.clientSatisfactionScore',
      header: 'Client Satisfaction',
      cell: ({ row }) => {
        const score = row.original.goLiveAndSupportData?.clientSatisfactionScore;
        return <div>{score ? `${score}/10` : 'N/A'}</div>;
      },
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
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
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
                  No deals found in this stage.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
