
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
import { users, type User, type Lead, leads as initialLeads, ProspectData, type LeadStatus, type StatusUpdate } from '@/lib/data';
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
import { ChangeStatusDialogs } from '@/components/leads/change-status-dialogs';
import { BulkImportDialog } from '@/components/leads/bulk-import-dialog';
import { UserMenu } from '@/components/user-menu';

export default function LeadsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads.filter(l => l.status !== 'Qualified'));
  const { toast } = useToast();
  
  const [statusChangeLead, setStatusChangeLead] = useState<{lead: Lead, status: LeadStatus} | null>(null);


  const handleAddLead = (newLead: Lead) => {
    setLeads((prevLeads) => [newLead, ...prevLeads]);
    initialLeads.unshift(newLead);
  };
  
  const handleBulkAddLeads = (newLeads: Lead[]) => {
    const leadsWithIds = newLeads.map(lead => ({
      ...lead,
      id: `lead-${Date.now()}-${Math.random()}`,
    }));
    setLeads(prev => [...leadsWithIds, ...prev]);
    initialLeads.unshift(...leadsWithIds);
    toast({
        title: "Import Successful",
        description: `${leadsWithIds.length} new leads have been added.`,
    });
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

        if (status === 'Prospect' && data) {
            lead.prospectData = data;
        }
        if (status === 'Future Opportunity' && data) {
            lead.futureOpportunityData = data;
        }
         if (status === 'Disqualified' && data) {
            lead.disqualifiedData = data;
        }
        
        if (status === 'Qualified') {
          lead.columnId = 'col-prospect';
        }

        initialLeads[leadIndex] = lead;
        setLeads([...initialLeads.filter(l => l.status !== 'Qualified')]);
        toast({
            title: "Lead Updated",
            description: `The lead status has been changed to ${status}.`,
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
                <SidebarMenuButton href="/approvals">
                  <ShieldCheck />
                  <span>Approvals</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/audit-trail">
                  <History />
                  <span>Audit Trail</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-2">
              <UserMenu user={currentUser} setUser={setCurrentUser} />
              <ThemeSwitcher />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader 
            user={currentUser} 
            setUser={setCurrentUser}
            title="Leads" 
            description="Manage and track all potential leads." 
            onAddButtonClick={() => setIsAddLeadOpen(true)}
            onImportButtonClick={() => setIsBulkImportOpen(true)}
            exportData={leads}
            exportFilename="leads.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <LeadsTable onViewDetails={setSelectedLead} leads={leads} onDeleteLead={handleDeleteLead} onChangeStatus={setStatusChangeLead} />
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
      <BulkImportDialog
        isOpen={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onLeadsImported={handleBulkAddLeads}
        users={users}
       />
      <ChangeStatusDialogs
        statusChangeLead={statusChangeLead}
        onOpenChange={() => setStatusChangeLead(null)}
        onStatusChanged={handleChangeStatus}
      />
    </SidebarProvider>
  );
}
