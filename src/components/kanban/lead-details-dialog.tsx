'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Phone, Mail, Users, Lightbulb, FolderKanban, Briefcase, Calendar, Handshake } from 'lucide-react';
import type { Lead, User } from '@/lib/data';
import { users } from '@/lib/data';
import { format } from 'date-fns';
import { StakeholderIdentification } from '../ai/stakeholder-identification';
import { RecommendedNextSteps } from '../ai/recommend-next-steps';

interface LeadDetailsDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
}

export function LeadDetailsDialog({ lead, isOpen, onOpenChange, currentUser }: LeadDetailsDialogProps) {
  if (!lead) return null;

  const owner = users.find(u => u.id === lead.ownerId);

  const documents = [
    { name: 'Initial Proposal.pdf', date: '2023-05-10' },
    { name: 'Follow-up Notes.docx', date: '2023-05-15' },
    { name: 'Signed NDA.pdf', date: '2023-06-01' },
  ];

  const canUseAiFeatures = currentUser.role === 'Admin' || currentUser.id === lead.ownerId;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{lead.title}</DialogTitle>
          <DialogDescription>{lead.company}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <Tabs defaultValue="details" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="follow-up"><Handshake className="w-4 h-4 mr-2"/>Follow-up</TabsTrigger>
              <TabsTrigger value="stakeholders" disabled={!canUseAiFeatures}><Users className="w-4 h-4 mr-2"/>Stakeholders</TabsTrigger>
              <TabsTrigger value="next-steps" disabled={!canUseAiFeatures}><Lightbulb className="w-4 h-4 mr-2"/>Next Steps</TabsTrigger>
              <TabsTrigger value="documents"><FolderKanban className="w-4 h-4 mr-2"/>Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="flex-grow overflow-auto p-1">
              <Card>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold font-headline">Lead Information</h3>
                    <div className="text-sm grid grid-cols-2 gap-2">
                        <span className="font-medium text-muted-foreground">Value:</span> <span>${lead.value.toLocaleString()} {lead.currency}</span>
                        <span className="font-medium text-muted-foreground">Company Size:</span> <span>{lead.companySize}</span>
                        <span className="font-medium text-muted-foreground">Source:</span> <span>{lead.source}</span>
                        <span className="font-medium text-muted-foreground">Campaign:</span> <span>{lead.marketingCampaign || 'N/A'}</span>
                        <span className="font-medium text-muted-foreground">Industry:</span> <span>{lead.industry}</span>
                        <span className="font-medium text-muted-foreground">Region:</span> <span>{lead.region}</span>
                        <span className="font-medium text-muted-foreground">Priority:</span> <span><Badge variant={lead.priority === 'High' ? 'destructive' : 'secondary'}>{lead.priority}</Badge></span>
                        <span className="font-medium text-muted-foreground">Entry Date:</span> <span>{format(new Date(lead.entryDate), 'PPP')}</span>
                        <span className="font-medium text-muted-foreground">Last Contact:</span> <span>{format(new Date(lead.lastContact), 'PPP')}</span>
                        <span className="font-medium text-muted-foreground">Next Action:</span> <span>{format(new Date(lead.nextAction), 'PPP')}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold font-headline mb-2">Contact Details</h3>
                       <div className="flex items-start gap-3 text-sm">
                        <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span>{lead.contact.email}</span>
                            <span className="text-xs text-muted-foreground">{lead.contact.name}, {lead.contact.title}</span>
                        </div>
                      </div>
                       <div className="flex items-center gap-3 text-sm mt-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{lead.contact.phone}</span>
                      </div>
                    </div>
                    <Separator />
                     <div>
                        <h3 className="font-semibold font-headline mb-2">Owner</h3>
                         {owner && (
                           <div className="flex items-center gap-3">
                             <Avatar>
                               <AvatarImage src={owner.avatar} />
                               <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div>
                               <p className="font-medium">{owner.name}</p>
                               <p className="text-sm text-muted-foreground">{owner.role}</p>
                             </div>
                           </div>
                         )}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="follow-up" className="flex-grow overflow-auto p-1">
               <Card>
                <CardHeader>
                  <CardTitle>Follow-up Cadence</CardTitle>
                  <CardDescription>Tracking of all contact attempts with the lead.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {lead.followUpCadence.map((attempt, index) => (
                      <li key={index} className="flex items-start gap-4 p-3 rounded-md border bg-muted/50">
                        <div className="flex flex-col items-center">
                            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">{index + 1}</div>
                            {index < lead.followUpCadence.length - 1 && <div className="w-px h-8 bg-border my-1"></div>}
                        </div>
                        <div>
                          <p className="font-semibold">{attempt.method}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(attempt.date), 'PPP, p')}
                          </p>
                        </div>
                      </li>
                    ))}
                    {lead.followUpCadence.length === 0 && <p className="text-muted-foreground">No follow-up attempts recorded yet.</p>}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stakeholders" className="flex-grow overflow-auto p-1">
              <StakeholderIdentification lead={lead} />
            </TabsContent>
            <TabsContent value="next-steps" className="flex-grow overflow-auto p-1">
              <RecommendedNextSteps lead={lead} />
            </TabsContent>
            <TabsContent value="documents" className="flex-grow overflow-auto p-1">
               <Card>
                <CardHeader>
                  <CardTitle>Document Repository</CardTitle>
                  <CardDescription>All documents related to this opportunity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {documents.map((doc) => (
                      <li key={doc.name} className="flex items-center justify-between p-3 rounded-md border">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{format(new Date(doc.date), 'PPP')}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
