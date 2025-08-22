
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
import { users, auditLogs, type User, type AuditLog, leads, type Lead } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { AuditTrailTable } from '@/components/audit-trail/audit-trail-table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function AuditTrailPage() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [logs, setLogs] = useState<AuditLog[]>(auditLogs);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const activeLeadIds = new Set(leads.filter(l => l.status !== 'Disqualified').map(l => l.id));

  const filteredLogs = showActiveOnly
    ? logs.filter(log => {
        if (log.entity !== 'Lead') return true;
        return activeLeadIds.has(log.entityId);
      })
    : logs;

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
                <SidebarMenuButton href="/audit-trail" isActive>
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
            title="Audit Trail" 
            description="View a complete history of all changes made in the application." 
            exportData={filteredLogs}
            exportFilename="audit-trail.csv"
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <AuditTrailTable 
              logs={filteredLogs}
              showActiveOnly={showActiveOnly}
              setShowActiveOnly={setShowActiveOnly}
            />
          </main>
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © Copyright 2025. Outamation Inc. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

    