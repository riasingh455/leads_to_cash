
'use client';
import React, { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCircle,
  LogOut,
  ChevronsUpDown,
  Building,
  Settings,
  ClipboardCheck,
  FileSignature,
  BookUser,
  Rocket,
  Megaphone,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { users, type User, type Lead, leads as initialLeads } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { GoLiveTable } from '@/components/post-sales/go-live-table';
import { BillingTable } from '@/components/post-sales/billing-table';
import { Separator } from '@/components/ui/separator';

export default function PostSalesPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const postSalesLeads = initialLeads.filter(l => ['col-go-live', 'col-billing'].includes(l.columnId));

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Building className="size-8 text-primary" />
              <h1 className="text-xl font-semibold font-headline">OncoFlow</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/campaigns">
                  <Megaphone />
                  <span>Campaigns</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/leads">
                  <Users />
                  <span>Leads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/opportunities">
                  <Briefcase />
                  <span>Opportunities</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/proposals">
                  <ClipboardCheck />
                  <span>Proposals/Review</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client-delivery">
                  <FileSignature />
                  <span>Client Delivery/Contract</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/implementation">
                  <BookUser />
                  <span>Implementation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/post-sales" isActive>
                  <Rocket />
                  <span>Go-Live & Handoff</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <UserMenu user={currentUser} setUser={setCurrentUser} />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader 
            user={currentUser} 
            title="Go-Live & Handoff" 
            description="Manage the final stages of the customer lifecycle."
            exportData={postSalesLeads}
            exportFilename='post-sales.csv'
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Go-Live & Initial Support</h2>
              <GoLiveTable onViewDetails={setSelectedLead} leads={initialLeads} />
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Billing & Handoff</h2>
              <BillingTable onViewDetails={setSelectedLead} leads={initialLeads} />
            </div>
          </main>
        </SidebarInset>
      </div>
      <LeadDetailsDialog
        lead={selectedLead}
        isOpen={!!selectedLead}
        onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}
        currentUser={currentUser}
      />
    </SidebarProvider>
  );
}

function UserMenu({ user, setUser }: { user: User, setUser: (user: User) => void }) {
  const { toggleSidebar } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left group-data-[collapsible=icon]:hidden">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <ChevronsUpDown className="hidden h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="top" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={user.id} onValueChange={(id) => setUser(users.find(u => u.id === id)!)}>
          <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
          {users.map((u) => (
            <DropdownMenuRadioItem key={u.id} value={u.id}>
              {u.name} ({u.role})
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toggleSidebar()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
