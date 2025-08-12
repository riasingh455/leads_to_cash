
'use client';
import React, { useState, useMemo } from 'react';
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
  Workflow,
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
import { users, campaigns, leads, type User, type Lead, type Campaign } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { AddCampaignDialog } from '@/components/campaigns/add-campaign-dialog';
import { CampaignsTable } from '@/components/campaigns/campaigns-table';
import { CampaignDetailsView } from '@/components/campaigns/campaign-details-view';
import { AddLeadDialog } from '@/components/leads/add-lead-dialog';
import { LeadDetailsDialog } from '@/components/kanban/lead-details-dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function CampaignsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
  const [leadList, setLeadList] = useState<Lead[]>(leads);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaignList((prev) => [newCampaign, ...prev]);
  };
  
  const handleAddLead = (newLead: Lead) => {
    setLeadList((prev) => [newLead, ...prev]);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignList(prev => prev.filter(c => c.id !== campaignId));
    setLeadList(prev => prev.map(l => l.campaignId === campaignId ? { ...l, campaignId: undefined } : l));
    toast({
      title: 'Campaign Deleted',
      description: 'The campaign and its associations with leads have been removed.',
    });
  };
  
  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };
  
  const handleBackToList = () => {
    setSelectedCampaign(null);
  };
  
  const campaignLeads = useMemo(() => {
    if (!selectedCampaign) return [];
    return leadList.filter(lead => lead.campaignId === selectedCampaign.id);
  }, [selectedCampaign, leadList]);

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
                <SidebarMenuButton href="/campaigns" isActive>
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
                        <SidebarMenuButton href="/post-sales">
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
            title={selectedCampaign ? selectedCampaign.name : "Campaigns"}
            description={selectedCampaign ? selectedCampaign.type : "Manage marketing campaigns and track performance."}
            onAddButtonClick={() => setIsAddCampaignOpen(true)}
            addButtonText={"Add Campaign"}
            exportData={selectedCampaign ? campaignLeads : campaignList}
            exportFilename={selectedCampaign ? `${selectedCampaign.name}-leads.csv` : 'campaigns.csv'}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {selectedCampaign ? (
              <CampaignDetailsView 
                campaign={selectedCampaign} 
                leads={campaignLeads}
                onBack={handleBackToList}
                onViewLeadDetails={setSelectedLead}
                onAddLead={() => setIsAddLeadOpen(true)}
              />
            ) : (
              <CampaignsTable 
                campaigns={campaignList}
                onViewDetails={handleSelectCampaign}
                onDeleteCampaign={handleDeleteCampaign}
              />
            )}
          </main>
        </SidebarInset>
      </div>
      <AddCampaignDialog
        isOpen={isAddCampaignOpen}
        onOpenChange={setIsAddCampaignOpen}
        onCampaignAndLeadsAdded={(campaign, leads) => {
          handleAddCampaign(campaign);
          leads.forEach(handleAddLead);
        }}
      />
      <AddLeadDialog
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onLeadAdded={handleAddLead}
        users={users}
        defaultCampaignId={selectedCampaign?.id}
      />
       <LeadDetailsDialog
        lead={selectedLead}
        isOpen={!!selectedLead}
        onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}
        currentUser={currentUser}
      />
    </SidebarProvider>
  );
}
