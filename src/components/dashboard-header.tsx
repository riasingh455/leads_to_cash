
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import type { User } from '@/lib/data';
import { exportToCsv } from '@/lib/utils';
import { format } from 'date-fns';
import { UserMenu } from './user-menu';

interface DashboardHeaderProps {
  user: User;
  setUser: (user: User) => void;
  title?: string;
  description?: string;
  onAddButtonClick?: () => void;
  addButtonText?: string;
  exportData?: any[];
  exportFilename?: string;
}

export function DashboardHeader({ 
  user,
  setUser,
  title = "Leads Dashboard",
  description,
  onAddButtonClick,
  addButtonText = 'Add Lead',
  exportData,
  exportFilename = `onco-flow-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
}: DashboardHeaderProps) {

  const handleExport = () => {
    if (exportData) {
      exportToCsv(exportData, exportFilename);
    }
  };
  
  const finalDescription = description || `Welcome back, ${user.name}.`;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-headline">{title}</h1>
          <p className="text-sm text-muted-foreground hidden md:block">{finalDescription}</p>
        </div>
        <div className="flex items-center gap-4">
          {onAddButtonClick && (
            <Button onClick={onAddButtonClick} className='hidden sm:inline-flex'>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
           <Button variant="outline" onClick={handleExport} disabled={!exportData || exportData.length === 0} className='hidden sm:inline-flex'>Export Data</Button>
          <UserMenu user={user} setUser={setUser} />
        </div>
      </div>
    </header>
  );
}
