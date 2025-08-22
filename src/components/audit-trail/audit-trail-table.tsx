
'use client';
import * as React from 'react';
import {
  CaretSortIcon,
  ChevronDownIcon,
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { Badge } from '@/components/ui/badge';
import { type AuditLog, users } from '@/lib/data';
import { format, formatDistanceToNow } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const TimestampCell = ({ timestamp }: { timestamp: string }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div suppressHydrationWarning>{format(new Date(timestamp), 'PPP p')}</div>;
    }

    const date = new Date(timestamp);

    return (
        <div title={format(date, 'PPP p')}>
            {formatDistanceToNow(date, { addSuffix: true })}
        </div>
    );
};


interface AuditTrailTableProps {
  logs: AuditLog[];
  showActiveOnly: boolean;
  setShowActiveOnly: (value: boolean) => void;
}

export function AuditTrailTable({ logs, showActiveOnly, setShowActiveOnly }: AuditTrailTableProps) {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'timestamp',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Timestamp
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        return <TimestampCell timestamp={timestamp} />;
      },
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => <div>{row.getValue('user')}</div>,
      filterFn: (row, id, value) => {
        return value ? value === row.getValue(id) : true
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const action = row.getValue('action') as string;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
        if (action === 'Created') variant = 'default';
        if (action === 'Deleted') variant = 'destructive';
        return <Badge variant={variant}>{action}</Badge>;
      },
       filterFn: (row, id, value) => {
        return value ? value === row.getValue(id) : true
      },
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue('details')}</div>,
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'timestamp', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});


  const table = useReactTable({
    data: logs,
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
  
  const selectedUser = table.getColumn('user')?.getFilterValue() as string || "all";
  const selectedAction = table.getColumn('action')?.getFilterValue() as string || "all";
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by details..."
          value={(table.getColumn('details')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('details')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {selectedUser === 'all' ? 'All Users' : selectedUser}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={selectedUser}
                    onValueChange={(value) => {
                        table.getColumn('user')?.setFilterValue(value === "all" ? null : value)
                    }}
                >
                    <DropdownMenuRadioItem value="all">All Users</DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    {users.map(user => (
                        <DropdownMenuRadioItem key={user.id} value={user.name}>{user.name}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {selectedAction === 'all' ? 'All Actions' : selectedAction}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={selectedAction}
                    onValueChange={(value) => {
                        table.getColumn('action')?.setFilterValue(value === "all" ? null : value)
                    }}
                >
                    <DropdownMenuRadioItem value="all">All Actions</DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    {uniqueActions.map(action => (
                        <DropdownMenuRadioItem key={action} value={action}>{action}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2">
            <Checkbox id="active-leads" checked={showActiveOnly} onCheckedChange={(checked) => setShowActiveOnly(checked as boolean)} />
            <Label htmlFor="active-leads">Active Leads Only</Label>
        </div>
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                  No logs found.
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
