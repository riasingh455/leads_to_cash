
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
import { users, type User, type Lead, leads as initialLeads, type ContractData, type ClientDeliveryData } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { ClientDeliveryTable } from '@/components/client-delivery/client-delivery-table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MoveToImplementationDialog } from '@/components/client-delivery/move-to-implementation-dialog';
import { UserMenu } from '@/components/user-menu';
import { MoveToContractDialog } from '@/components/client-delivery/move-to-contract-dialog';

export default function ClientDeliveryPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(() => JSON.parse(JSON.stringify(initialLeads)));
  const [moveToContractLead, setMoveToContractLead] = useState<Lead | null>(null);
  const [moveToImplementationLead, setMoveToImplementationLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  const handleMoveToContract = (leadId: string, deliveryData: ClientDeliveryData) => {
     setLeads(prev => {
      const leadIndex = prev.findIndex(l => l.id === leadId);
      if (leadIndex > -1) {
        const updatedLeads = [...prev];
        const updatedLead = { ...updatedLeads[leadIndex] };
        updatedLead.columnId = 'col-contract';
        updatedLead.clientDeliveryData = deliveryData;
        updatedLeads[leadIndex] = updatedLead;
        return updatedLeads;
      }
      return prev;
    });
    setMoveToContractLead(null);
    toast({
        title: 'Moved to Contract',
        description: 'The deal has been advanced to the contract stage.'
    })
  }

  const handleMoveToImplementation = (leadId: string, contractData: ContractData) => {
    setLeads(prev => {
      const leadIndex = prev.findIndex(l => l.id === leadId);
      if (leadIndex > -1) {
        const updatedLeads = [...prev];
        const updatedLead = { ...updatedLeads[leadIndex] };
        updatedLead.stage = 'Implementation';
        updatedLead.columnId = 'col-implementation';
        updatedLead.contractData = contractData;
        updatedLeads[leadIndex] = updatedLead;
        return updatedLeads;
      }
      return prev;
    });
    setMoveToImplementationLead(null);
    toast({
        title: 'Moved to Implementation',
        description: 'The deal has been advanced to the implementation stage.'
    })
  }

  const deliveryLeads = leads.filter(l => l.stage === 'Client-Delivery');

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
                          <span>Proposals & Internal Review</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton href="/client-delivery" isActive>
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
            title="Client Delivery & Contracts" 
            description="Manage the final stages of deal closure and contract finalization."
            exportData={deliveryLeads}
            exportFilename='client-delivery.csv'
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <ClientDeliveryTable onViewDetails={setSelectedLead} leads={leads} onMoveToContract={setMoveToContractLead} onMoveToImplementation={setMoveToImplementationLead} />
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
      <MoveToContractDialog
        isOpen={!!moveToContractLead}
        onOpenChange={() => setMoveToContractLead(null)}
        lead={moveToContractLead}
        onMoveToContract={handleMoveToContract}
      />
      <MoveToImplementationDialog
        isOpen={!!moveToImplementationLead}
        onOpenChange={() => setMoveToImplementationLead(null)}
        lead={moveToImplementationLead}
        onMoveToImplementation={handleMoveToImplementation}
        users={users}
      />
    </SidebarProvider>
  );
}
