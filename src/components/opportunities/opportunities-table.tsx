
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
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
import { type Lead, users, columns as leadColumns, type LeadStatus } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface OpportunitiesTableProps {
  onViewDetails: (lead: Lead) => void;
  leads: Lead[];
  onDeleteOpportunity: (leadId: string) => void;
  onChangeStatus: (change: {lead: Lead, status: LeadStatus}) => void;
}

export function OpportunitiesTable({ onViewDetails, leads: propLeads, onDeleteOpportunity, onChangeStatus }: OpportunitiesTableProps) {
  const { toast } = useToast();
  const [leads, setLeads] = React.useState<Lead[]>(propLeads.filter(lead => lead.status === 'Qualified'));

  React.useEffect(() => {
    setLeads(propLeads.filter(lead => lead.status === 'Qualified'))
  }, [propLeads]);
  
  const handleStageUpdate = (leadId: string, newStageId: string) => {
    const lead = propLeads.find(l => l.id === leadId);
    if(lead) {
      lead.columnId = newStageId;
    }
    
    setLeads(prev => prev.filter(l => l.id !== leadId));
    
    const stage = leadColumns.find(s => s.id === newStageId);
    toast({
      title: 'Opportunity Updated',
      description: `Stage changed to "${stage?.title}"`,
    });
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'title',
      header: 'Opportunity',
      cell: ({ row }) => {
        const stage = leadColumns.find(c => c.id === row.original.columnId)
        return (
            <div className='flex flex-col'>
                <span className="font-medium">{row.getValue('title')}</span>
                <span className="text-xs text-muted-foreground">{stage?.title}</span>
            </div>
        )
      }
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
      accessorKey: 'value',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='text-right w-full'
          >
            Value
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('value'));
  
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
  
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'nextAction',
      header: 'Next Action',
      cell: ({ row }) => <div>{format(new Date(row.getValue('nextAction')), 'PPP')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); }}>
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => { e.stopPropagation(); }}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewDetails(lead)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onChangeStatus({lead, status: 'Qualified'})}>Qualified (Opportunity)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeStatus({lead, status: 'Future Opportunity'})}>Future Opportunity</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeStatus({lead, status: 'Disqualified'})}>Disqualified</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the opportunity &quot;{lead.title}&quot;. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={(e) => { e.stopPropagation(); onDeleteOpportunity(lead.id);}} className="bg-red-600 hover:bg-red-700">Yes, delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: leads,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  onClick={() => onViewDetails(row.original)}
                  className='cursor-pointer'
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
                  No results.
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
