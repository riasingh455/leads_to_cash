
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
import { FileText, Phone, Mail, Users, Lightbulb, FolderKanban, Briefcase, Calendar, Handshake, Target, CheckCircle, Clock, Search, FileCheck2, UserCheck, ShieldCheck, DollarSign, AlertTriangle, Building, Truck, Presentation, FileUp, Edit } from 'lucide-react';
import type { Lead, User } from '@/lib/data';
import { users, columns } from '@/lib/data';
import { format } from 'date-fns';
import { StakeholderIdentification } from '../ai/stakeholder-identification';
import { RecommendedNextSteps } from '../ai/recommend-next-steps';

interface LeadDetailsDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <>
        <span className="font-medium text-muted-foreground">{label}:</span>
        <span>{value}</span>
    </>
);

export function LeadDetailsDialog({ lead, isOpen, onOpenChange, currentUser }: LeadDetailsDialogProps) {
  if (!lead) return null;

  const owner = users.find(u => u.id === lead.ownerId);

  const documents = [
    { name: 'Initial Proposal.pdf', date: '2023-05-10' },
    { name: 'Follow-up Notes.docx', date: '2023-05-15' },
    { name: 'Signed NDA.pdf', date: '2023-06-01' },
  ];

  const canUseAiFeatures = currentUser.role === 'Admin' || currentUser.id === lead.ownerId;
  
  const stageIndex = columns.findIndex(c => c.id === lead.columnId);

  const tabVisibility = {
    prospecting: stageIndex >= columns.findIndex(c => c.id === 'col-prospect'),
    proposal: stageIndex >= columns.findIndex(c => c.id === 'col-proposal'),
    review: stageIndex >= columns.findIndex(c => c.id === 'col-review'),
    delivery: stageIndex >= columns.findIndex(c => c.id === 'col-delivery'),
  };

  const visibleTabs = ['details', 'follow-up', 
    tabVisibility.prospecting && 'prospecting',
    tabVisibility.proposal && 'proposal',
    tabVisibility.review && 'review',
    tabVisibility.delivery && 'delivery',
    'stakeholders', 'next-steps', 'documents'].filter(Boolean) as string[];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{lead.title}</DialogTitle>
          <DialogDescription>{lead.company}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <Tabs defaultValue="details" className="flex flex-col h-full">
            <TabsList className={`grid w-full grid-cols-${visibleTabs.length}`}>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="follow-up"><Handshake className="w-4 h-4 mr-2"/>Follow-up</TabsTrigger>
              {tabVisibility.prospecting && <TabsTrigger value="prospecting"><Target className="w-4 h-4 mr-2" />Prospecting</TabsTrigger>}
              {tabVisibility.proposal && <TabsTrigger value="proposal"><FileUp className="w-4 h-4 mr-2" />Proposal</TabsTrigger>}
              {tabVisibility.review && <TabsTrigger value="review"><Search className="w-4 h-4 mr-2" />Review</TabsTrigger>}
              {tabVisibility.delivery && <TabsTrigger value="delivery"><Presentation className="w-4 h-4 mr-2" />Delivery</TabsTrigger>}
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
                        <DetailRow label="Proposed Offering" value={lead.title} />
                        <DetailRow label="Value" value={`$${lead.value.toLocaleString()} ${lead.currency}`} />
                        <DetailRow label="Company Size" value={lead.companySize} />
                        <DetailRow label="Source" value={lead.source} />
                        <DetailRow label="Campaign" value={lead.marketingCampaign || 'N/A'} />
                        <DetailRow label="Industry" value={lead.industry} />
                        <DetailRow label="Region" value={lead.region} />
                        <DetailRow label="Priority" value={<Badge variant={lead.priority === 'High' ? 'destructive' : 'secondary'}>{lead.priority}</Badge>} />
                        <DetailRow label="Entry Date" value={format(new Date(lead.entryDate), 'PPP')} />
                        <DetailRow label="Last Contact" value={format(new Date(lead.lastContact), 'PPP')} />
                        <DetailRow label="Next Action" value={format(new Date(lead.nextAction), 'PPP')} />
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
                        <h3 className="font-semibold font-headline mb-2">Assigned Sales Rep</h3>
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
            {tabVisibility.prospecting && (
              <TabsContent value="prospecting" className="flex-grow overflow-auto p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prospecting Details</CardTitle>
                      <CardDescription>Information gathered during the prospecting stage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {lead.prospectData ? (
                          <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-4">
                              <DetailRow label="Response Date" value={format(new Date(lead.prospectData.responseDate), 'PPP')} />
                              <DetailRow label="Engagement Type" value={lead.prospectData.engagementType} />
                              <DetailRow label="Contact Quality" value={lead.prospectData.contactQuality} />
                              <DetailRow label="Demo/Discovery Call" value={lead.prospectData.demoScheduled === 'Yes' && lead.prospectData.demoDate ? `Yes, on ${format(new Date(lead.prospectData.demoDate), 'PPP')}` : 'No'} />
                              <div className="space-y-1 col-span-2">
                                  <p className="font-medium text-muted-foreground">Qualification Notes</p>
                                  <p className="whitespace-pre-wrap">{lead.prospectData.qualificationNotes}</p>
                              </div>
                              <div className="space-y-1 col-span-2">
                                  <p className="font-medium text-muted-foreground">Initial Pain Points</p>
                                  <p className="whitespace-pre-wrap">{lead.prospectData.painPoints}</p>
                              </div>
                              <div className="space-y-1 col-span-2">
                                  <p className="font-medium text-muted-foreground">Competitor Awareness</p>
                                  <p className="whitespace-pre-wrap">{lead.prospectData.competitorAwareness}</p>
                              </div>
                              <div className="space-y-1 col-span-2">
                                  <p className="font-medium text-muted-foreground">Next Steps Agreed</p>
                                  <p className="whitespace-pre-wrap">{lead.prospectData.nextSteps}</p>
                              </div>
                          </div>
                      ) : (
                        <p className="text-muted-foreground">No prospecting data available for this lead yet.</p>
                      )}
                    </CardContent>
                  </Card>
              </TabsContent>
            )}
            {tabVisibility.proposal && (
              <TabsContent value="proposal" className="flex-grow overflow-auto p-1">
                <Card>
                  <CardHeader><CardTitle>Proposal Details</CardTitle></CardHeader>
                  <CardContent>
                    {lead.proposalData ? (
                      <div className="space-y-6">
                        <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-4">
                          <DetailRow label="Template Used" value={lead.proposalData.templateUsed} />
                          <DetailRow label="Pricing Structure" value={lead.proposalData.pricingStructure} />
                          <DetailRow label="Project Duration" value={lead.proposalData.projectDuration} />
                          <DetailRow label="Terms & Conditions Version" value={lead.proposalData.termsVersion} />
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Services/Products Included:</p>
                            <p className="whitespace-pre-wrap">{lead.proposalData.servicesIncluded}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                             <p className="font-medium text-muted-foreground">Resource Requirements:</p>
                             <p className="whitespace-pre-wrap">{lead.proposalData.resourceRequirements}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><Edit className="w-4 h-4"/>Revision History</h4>
                          <ul className="space-y-2">
                            {lead.proposalData.revisionHistory.map(rev => (
                               <li key={rev.version} className="flex gap-4 text-sm border-l-2 pl-4">
                                <div>V{rev.version}</div>
                                <div>{format(new Date(rev.date), 'PPP')}</div>
                                <div className="text-muted-foreground">{rev.notes}</div>
                               </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : <p className="text-muted-foreground">No proposal data available.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {tabVisibility.review && (
              <TabsContent value="review" className="flex-grow overflow-auto p-1">
                <Card>
                  <CardHeader><CardTitle>Internal Review</CardTitle></CardHeader>
                  <CardContent>
                     {lead.internalReviewData ? (
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-blue-500" />CST Review</h4>
                            <div className="text-sm grid grid-cols-2 gap-2">
                              <DetailRow label="Status" value={<Badge variant={lead.internalReviewData.cstReviewStatus === 'Approved' ? 'default' : 'destructive'}>{lead.internalReviewData.cstReviewStatus}</Badge>} />
                              <DetailRow label="Reviewer" value={lead.internalReviewData.cstReviewer || 'N/A'} />
                              <DetailRow label="Date" value={lead.internalReviewData.cstReviewDate ? format(new Date(lead.internalReviewData.cstReviewDate), 'PPP') : 'N/A'} />
                              <DetailRow label="Resource Check" value={lead.internalReviewData.resourceAvailabilityCheck} />
                              <div className="col-span-2 space-y-1">
                                <p className="font-medium text-muted-foreground">Feasibility Notes:</p>
                                <p className="whitespace-pre-wrap">{lead.internalReviewData.technicalFeasibilityNotes || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600"/>CRO Review</h4>
                             <div className="text-sm grid grid-cols-2 gap-2">
                              <DetailRow label="Status" value={<Badge variant={lead.internalReviewData.croReviewStatus === 'Approved' ? 'default' : 'destructive'}>{lead.internalReviewData.croReviewStatus}</Badge>} />
                              <DetailRow label="Reviewer" value={lead.internalReviewData.croReviewer || 'N/A'} />
                              <DetailRow label="Date" value={lead.internalReviewData.financialReviewDate ? format(new Date(lead.internalReviewData.financialReviewDate), 'PPP') : 'N/A'} />
                              <DetailRow label="Final Approval" value={lead.internalReviewData.finalApprovalDate ? format(new Date(lead.internalReviewData.finalApprovalDate), 'PPP') : 'N/A'} />
                              <div className="col-span-2 space-y-1">
                                <p className="font-medium text-muted-foreground">Margin Analysis:</p>
                                <p className="whitespace-pre-wrap">{lead.internalReviewData.marginAnalysis || 'N/A'}</p>
                              </div>
                               <div className="col-span-2 space-y-1">
                                <p className="font-medium text-muted-foreground">Risk Assessment:</p>
                                <p className="whitespace-pre-wrap">{lead.internalReviewData.riskAssessment || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                       </div>
                     ) : <p className="text-muted-foreground">No internal review data available.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {tabVisibility.delivery && (
              <TabsContent value="delivery" className="flex-grow overflow-auto p-1">
                 <Card>
                  <CardHeader><CardTitle>Client Delivery</CardTitle></CardHeader>
                  <CardContent>
                    {lead.clientDeliveryData ? (
                       <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-4">
                          <DetailRow label="Proposal Sent" value={format(new Date(lead.clientDeliveryData.proposalSentDate), 'PPP')} />
                          <DetailRow label="Presentation Date" value={format(new Date(lead.clientDeliveryData.proposalPresentationDate), 'PPP')} />
                          <DetailRow label="Decision Maker Present" value={lead.clientDeliveryData.decisionMakerPresent} />
                          <DetailRow label="Decision Timeline" value={lead.clientDeliveryData.decisionTimeline} />
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Attendees:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.attendees}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Client Questions/Objections:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.clientQuestions}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Client Feedback:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.clientFeedback}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Additional Requirements:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.additionalRequirements}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Follow-up Actions:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.followUpActions}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground">Competitive Situation:</p>
                            <p className="whitespace-pre-wrap">{lead.clientDeliveryData.competitiveSituationUpdate}</p>
                          </div>
                       </div>
                    ) : <p className="text-muted-foreground">No client delivery data available.</p>}
                  </CardContent>
                 </Card>
              </TabsContent>
            )}
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
