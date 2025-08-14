
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
  DollarSign,
  TrendingUp,
  BarChart,
  LogOut,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { users, type User, type Lead, leads as initialLeads, columns } from '@/lib/data';
import { AddLeadDialog } from '@/components/leads/add-lead-dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleAddLead = (newLead: Lead) => {
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    initialLeads.unshift(newLead);
  };
  
  const kpiData = useMemo(() => {
    const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const wonLeads = leads.filter(l => l.columnId === 'col-5');
    const wonRevenue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
    const newLeadsCount = leads.filter(l => new Date(l.entryDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    const conversionRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
    
    return { totalPipelineValue, wonRevenue, newLeadsCount, conversionRate };
  }, [leads]);
  
  const pipelineChartData = useMemo(() => {
    return columns
      .map(col => {
        const stageLeads = leads.filter(lead => lead.columnId === col.id);
        if (stageLeads.length === 0) return null;
        return {
          name: col.title,
          leads: stageLeads.length,
          value: stageLeads.reduce((sum, l) => sum + l.value, 0)
        }
      })
      .filter(Boolean);
  }, [leads]);

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
                <SidebarMenuButton href="/" isActive>
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
            onAddButtonClick={() => setIsAddLeadOpen(true)}
            exportData={leads}
            exportFilename='dashboard-leads.csv'
          />
           <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(kpiData.totalPipelineValue)}</div>
                        <p className="text-xs text-muted-foreground">Across all active leads</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Won Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(kpiData.wonRevenue)}</div>
                         <p className="text-xs text-muted-foreground">From all closed-won deals</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{kpiData.newLeadsCount}</div>
                        <p className="text-xs text-muted-foreground">In the last 30 days</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.conversionRate.toFixed(1)}%</div>
                         <p className="text-xs text-muted-foreground">Lead-to-won conversion</p>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={{}} className="h-[250px] w-full">
                  <RechartsBarChart data={pipelineChartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 15)}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="leads" fill="var(--color-primary)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

          </main>
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © Copyright 2025. Outamation Inc. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
      <AddLeadDialog
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onLeadAdded={handleAddLead}
        users={users}
      />
    </SidebarProvider>
  );
}
