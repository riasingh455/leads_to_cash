import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import type { User } from '@/lib/data';

export function DashboardHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-headline">Leads Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user.name}.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Export Data</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
    </header>
  );
}
