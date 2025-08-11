
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import type { User } from '@/lib/data';

interface DashboardHeaderProps {
  user: User;
  title?: string;
  description?: string;
  onAddButtonClick?: () => void;
  addButtonText?: string;
}

export function DashboardHeader({ 
  user,
  title = "Leads Dashboard",
  description = `Welcome back, ${user.name}.`,
  onAddButtonClick,
  addButtonText = 'Add Lead'
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-headline">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Export Data</Button>
          <Button onClick={onAddButtonClick}>
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        </div>
      </div>
    </header>
  );
}
