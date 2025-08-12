
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
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardCheck,
  FileSignature,
  BookUser,
  Rocket,
  Megaphone,
  Building,
  Workflow,
} from 'lucide-react';
import { users, type User, type Lead, leads as initialLeads } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { GoLiveTable } from '@/components/post-sales/go-live-table';
import { BillingTable } from '@/components/post-sales/billing-table';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
              <h1 className="text-xl font-semibold font-headline">Leads to Cash</h1>
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
              <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <Workflow />
                        <span>Workflow</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className='pl-8'>
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
                          <span>Proposals & Internal Review</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/client-delivery">
                          <FileSignature />
                          <span>Client Delivery & Contracts</span>
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
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader 
            user={currentUser} 
            setUser={setCurrentUser}
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
