
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
  History,
  LogOut,
} from 'lucide-react';
import { users, type User, type Lead, leads as initialLeads, ProspectData } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadsTable } from '@/components/leads/leads-table';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { AddLeadDialog } from '@/components/leads/add-lead-dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { MarkAsProspectDialog } from '@/components/leads/mark-as-prospect-dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function LeadsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [prospectLead, setProspectLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const { toast } = useToast();

  const handleAddLead = (newLead: Lead) => {
    setLeads((prevLeads) => [newLead, ...prevLeads]);
    initialLeads.unshift(newLead);
  };
  
  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    const leadIndex = initialLeads.findIndex(l => l.id === leadId);
    if (leadIndex > -1) {
      initialLeads.splice(leadIndex, 1);
    }
    toast({
      title: "Lead Deleted",
      description: "The lead has been successfully deleted.",
    });
  }
  
  const handleMarkAsProspect = (leadId: string, prospectData: ProspectData) => {
    const leadIndex = initialLeads.findIndex(l => l.id === leadId);
    if (leadIndex > -1) {
        initialLeads[leadIndex] = {
            ...initialLeads[leadIndex],
            prospectData,
        };
        setLeads([...initialLeads]);
        toast({
            title: "Lead Updated",
            description: "The lead has been marked as a prospect.",
        });
    }
  };

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
                        <SidebarMenuButton href="/leads" isActive>
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
                        <SidebarMenuButton href="/post-sales">
                          <Rocket />
                          <span>Go-Live & Handoff</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton href="/audit-trail">
                  <History />
                  <span>Audit Trail</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className='text-left text-sm p-2 space-y-0.5'>
              <p className='text-muted-foreground'>Logged in as</p>
              <p className='font-bold'>{currentUser.role}</p>
            </div>
            <Separator className="my-1" />
            <div className='p-2'>
              <Button variant='ghost' className='w-full justify-start p-2 h-auto'>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            <Separator className="my-1" />
            <div className='text-left text-sm p-2 space-y-0.5'>
              <p className='font-bold'>{currentUser.name}</p>
              <p className='text-muted-foreground'>{currentUser.email}</p>
            </div>
             <div className='text-left text-xs p-2 text-muted-foreground'>
                Version 1.0.0
            </div>
            <ThemeSwitcher />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader 
            user={currentUser} 
            setUser={setCurrentUser}
            title="Leads" 
            description="Manage and track all potential leads." 
            onAddButtonClick={() => setIsAddLeadOpen(true)}
            exportData={leads}
            exportFilename="leads.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <LeadsTable onViewDetails={setSelectedLead} leads={leads} onDeleteLead={handleDeleteLead} onMarkAsProspect={setProspectLead}/>
          </main>
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © Copyright 2025. Outamation Inc. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
      <LeadDetailsDialog
        lead={selectedLead}
        isOpen={!!selectedLead}
        onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}
        currentUser={currentUser}
      />
      <AddLeadDialog
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onLeadAdded={handleAddLead}
        users={users}
      />
      <MarkAsProspectDialog
        lead={prospectLead}
        isOpen={!!prospectLead}
        onOpenChange={() => setProspectLead(null)}
        onProspectMarked={handleMarkAsProspect}
      />
    </SidebarProvider>
  );
}
