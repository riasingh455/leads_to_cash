
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

export default function CampaignsPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
  const [leadList, setLeadList] = useState<Lead[]>(leads);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaignList((prev) => [newCampaign, ...prev]);
  };
  
  const handleAddLead = (newLead: Lead) => {
    setLeadList((prev) => [newLead, ...prev]);
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
                <SidebarMenuButton href="/post-sales">
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
            title={selectedCampaign ? selectedCampaign.name : "Campaigns"}
            description={selectedCampaign ? selectedCampaign.type : "Manage marketing campaigns and track performance."}
            onAddButtonClick={() => selectedCampaign ? setIsAddLeadOpen(true) : setIsAddCampaignOpen(true)}
            addButtonText={selectedCampaign ? "Add Lead" : "Add Campaign"}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {selectedCampaign ? (
              <CampaignDetailsView 
                campaign={selectedCampaign} 
                leads={campaignLeads}
                onBack={handleBackToList}
              />
            ) : (
              <CampaignsTable 
                campaigns={campaignList}
                onViewDetails={handleSelectCampaign} 
              />
            )}
          </main>
        </SidebarInset>
      </div>
      <AddCampaignDialog
        isOpen={isAddCampaignOpen}
        onOpenChange={setIsAddCampaignOpen}
        onCampaignAdded={handleAddCampaign}
      />
      <AddLeadDialog
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onLeadAdded={handleAddLead}
        users={users}
        defaultCampaignId={selectedCampaign?.id}
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
