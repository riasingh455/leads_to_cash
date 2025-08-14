
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
import { users, type User, type Lead, leads as initialLeads } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { ProposalsTable } from '@/components/proposals/proposals-table';
import { AddProposalDialog } from '@/components/proposals/add-proposal-dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function ProposalsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddProposalOpen, setIsAddProposalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const { toast } = useToast();

  const handleAddProposal = (leadId: string, proposalData: any) => {
    setLeads((prevLeads) => {
      const leadIndex = prevLeads.findIndex(l => l.id === leadId);
      if (leadIndex !== -1) {
        const updatedLeads = [...prevLeads];
        const updatedLead = { ...updatedLeads[leadIndex] };
        updatedLead.columnId = 'col-proposal';
        updatedLead.proposalData = {
          ...proposalData,
          revisionHistory: [{ version: 1, date: new Date().toISOString(), notes: 'Initial draft' }],
        };
        updatedLeads[leadIndex] = updatedLead;
        return updatedLeads;
      }
      return prevLeads;
    });
  };
  
  const handleDeleteProposal = (leadId: string) => {
    setLeads(prev => {
      const leadIndex = prev.findIndex(l => l.id === leadId);
      if (leadIndex > -1) {
        const updatedLeads = [...prev];
        const updatedLead = { ...updatedLeads[leadIndex] };
        delete updatedLead.proposalData;
        updatedLead.columnId = 'col-prospect'; // Revert to prospect
        updatedLeads[leadIndex] = updatedLead;
        return updatedLeads;
      }
      return prev;
    })
    
    toast({
      title: "Proposal Deleted",
      description: "The proposal has been deleted and the opportunity stage was reverted.",
    });
  }

  const proposalLeads = leads.filter(l => ['col-proposal', 'col-review', 'col-delivery'].includes(l.columnId));

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
                        <SidebarMenuButton href="/proposals" isActive>
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
            <div className='p-2'>
              <div className='text-left text-sm space-y-0.5 mb-2'>
                <p className='text-muted-foreground text-xs'>Logged in as</p>
                <p className='font-bold'>{currentUser.role}</p>
              </div>
              <Button variant='ghost' className='w-full justify-start p-2 h-auto mb-2'>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Separator className="my-1" />
              <div className='text-left text-sm space-y-0.5 mt-2'>
                <p className='font-bold'>{currentUser.name}</p>
                <p className='text-muted-foreground'>{currentUser.email}</p>
              </div>
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
            title="Proposals & Internal Review" 
            description="Track and manage deals in the late stages of the sales cycle." 
            onAddButtonClick={() => setIsAddProposalOpen(true)}
            addButtonText="Add Proposal"
            exportData={proposalLeads}
            exportFilename="proposals.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <ProposalsTable onViewDetails={setSelectedLead} leads={leads} onDeleteProposal={handleDeleteProposal} />
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
      <AddProposalDialog
        isOpen={isAddProposalOpen}
        onOpenChange={setIsAddProposalOpen}
        onProposalAdded={handleAddProposal}
        leads={leads}
      />
    </SidebarProvider>
  );
}
