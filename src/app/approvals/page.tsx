
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
import { users, type User, type Lead, leads as initialLeads, type InternalReviewData } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ApprovalsTable } from '@/components/approvals/approvals-table';
import { ApprovalDialog } from '@/components/approvals/approval-dialog';

export default function ApprovalsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [approvalLead, setApprovalLead] = useState<Lead | null>(null);

  const handleUpdateReview = (leadId: string, reviewData: Partial<InternalReviewData>) => {
    setLeads(prev => {
        const leadIndex = prev.findIndex(l => l.id === leadId);
        if (leadIndex > -1) {
            const updatedLeads = [...prev];
            const lead = updatedLeads[leadIndex];
            const updatedLead = {
                ...lead,
                internalReviewData: {
                    ...lead.internalReviewData,
                    ...reviewData,
                    ...(reviewData.cstReviewStatus !== 'Pending' && { cstReviewDate: new Date().toISOString() }),
                    ...(reviewData.croReviewStatus !== 'Pending' && { financialReviewDate: new Date().toISOString() }),
                } as InternalReviewData
            };

            if (updatedLead.internalReviewData?.cstReviewStatus === 'Approved' && updatedLead.internalReviewData?.croReviewStatus === 'Approved') {
                updatedLead.internalReviewData.finalApprovalDate = new Date().toISOString();
                updatedLead.internalReviewData.approvedBy = currentUser.name;
            }

            updatedLeads[leadIndex] = updatedLead;
            return updatedLeads;
        }
        return prev;
    });
    setApprovalLead(null);
  };
  
  const approvalLeads = leads.filter(l => l.stage === 'Proposal' && l.columnId === 'col-review');

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
                        <SidebarMenuButton href="/opportunities">
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
                        <SidebarMenuButton href="/approvals" isActive>
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
            title="Proposal Approvals" 
            description="Review and approve proposals before they are sent to clients." 
            exportData={approvalLeads}
            exportFilename="approvals.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <ApprovalsTable 
              leads={approvalLeads}
              onViewDetails={setSelectedLead}
              onApprove={setApprovalLead}
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
      <ApprovalDialog
        isOpen={!!approvalLead}
        onOpenChange={() => setApprovalLead(null)}
        lead={approvalLead}
        currentUser={currentUser}
        onUpdateReview={handleUpdateReview}
      />
    </SidebarProvider>
  );
}

    