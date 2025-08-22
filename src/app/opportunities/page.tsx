
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
  ShieldCheck,
} from 'lucide-react';
import { users, type User, type Lead, leads as initialLeads, type LeadStatus, type StatusUpdate } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { OpportunitiesTable } from '@/components/opportunities/opportunities-table';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChangeStatusDialogs } from '@/components/leads/change-status-dialogs';
import { AddProposalDialog } from '@/components/proposals/add-proposal-dialog';

export default function OpportunitiesPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const { toast } = useToast();
  const [statusChangeLead, setStatusChangeLead] = useState<{lead: Lead, status: LeadStatus} | null>(null);
  const [proposalLead, setProposalLead] = useState<Lead | null>(null);
  
  const handleDeleteOpportunity = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    const leadIndex = initialLeads.findIndex(l => l.id === leadId);
    if (leadIndex > -1) {
      initialLeads.splice(leadIndex, 1);
    }
    toast({
      title: "Opportunity Deleted",
      description: "The opportunity has been successfully deleted.",
    });
  };

  const handleChangeStatus = (leadId: string, status: LeadStatus, data?: any) => {
    const leadIndex = initialLeads.findIndex(l => l.id === leadId);
    if (leadIndex > -1) {
        const lead = initialLeads[leadIndex];
        lead.status = status;
        const newStatusUpdate: StatusUpdate = {
            status,
            date: new Date().toISOString(),
            notes: `Status changed to ${status}`,
            updatedBy: currentUser.id,
            data,
        };
        lead.statusHistory.push(newStatusUpdate);

        if (status === 'Future Opportunity' && data) {
            lead.futureOpportunityData = data;
        }
         if (status === 'Disqualified' && data) {
            lead.disqualifiedData = data;
        }
        
        initialLeads[leadIndex] = lead;
        // This will force a re-render and re-filter of opportunities
        setLeads([...initialLeads]);
        toast({
            title: "Opportunity Updated",
            description: `The opportunity status has been changed to ${status}.`,
        });
    }
  };
  
  const handleAddProposal = (leadId: string, proposalData: any) => {
    setLeads((prevLeads) => {
      const leadIndex = prevLeads.findIndex(l => l.id === leadId);
      if (leadIndex !== -1) {
        const updatedLeads = [...prevLeads];
        const updatedLead = { ...updatedLeads[leadIndex] };
        updatedLead.columnId = 'col-proposal';
        updatedLead.stage = 'Proposal';
        updatedLead.proposalData = {
          ...proposalData,
          revisionHistory: [{ version: 1, date: new Date().toISOString(), notes: 'Initial draft' }],
        };
        updatedLeads[leadIndex] = updatedLead;
        
        // Update master list
        const initialLeadIndex = initialLeads.findIndex(l => l.id === leadId);
        if (initialLeadIndex !== -1) {
          initialLeads[initialLeadIndex] = updatedLead;
        }

        return updatedLeads;
      }
      return prevLeads;
    });
    setProposalLead(null);
  };

  const opportunities = leads.filter(l => l.status === 'Qualified');

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
              <Collapsible className="w-full" defaultOpen>
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
                        <SidebarMenuButton href="/opportunities" isActive>
                          <Briefcase />
                          <span>Opportunities</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton href="/proposals">
                          <ClipboardCheck />
                          <span>Proposals</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton href="/approvals">
                          <ShieldCheck />
                          <span>Approvals</span>
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
            title="Opportunities" 
            description="View and manage qualified sales opportunities." 
            exportData={opportunities}
            exportFilename="opportunities.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <OpportunitiesTable 
              onViewDetails={setSelectedLead} 
              leads={leads} 
              onDeleteOpportunity={handleDeleteOpportunity}
              onChangeStatus={setStatusChangeLead}
              onMoveToProposal={setProposalLead}
            />
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
       <ChangeStatusDialogs
        statusChangeLead={statusChangeLead}
        onOpenChange={() => setStatusChangeLead(null)}
        onStatusChanged={handleChangeStatus}
      />
      <AddProposalDialog
        isOpen={!!proposalLead}
        onOpenChange={() => setProposalLead(null)}
        onProposalAdded={handleAddProposal}
        leads={leads}
        defaultLeadId={proposalLead?.id}
      />
    </SidebarProvider>
  );
}

    