
'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Phone, Mail, Users, Lightbulb, FolderKanban, Briefcase, Calendar, Handshake, Target, CheckCircle, Clock, Search, FileCheck2, UserCheck, ShieldCheck, DollarSign, AlertTriangle, Building, Truck, Presentation, FileUp, Edit, Info, Users2, FileSignature, Newspaper, BookUser } from 'lucide-react';
import type { Lead, User } from '@/lib/data';
import { users, columns } from '@/lib/data';
import { format } from 'date-fns';
import { StakeholderIdentification } from '../ai/stakeholder-identification';
import { RecommendedNextSteps } from '../ai/recommend-next-steps';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

interface LeadDetailsDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
}

const DetailRow = ({ label, value, fullWidth = false }: { label: string; value: React.ReactNode, fullWidth?: boolean }) => (
    <>
        <span className="font-medium text-muted-foreground">{label}:</span>
        <span className={`break-words ${fullWidth ? 'col-span-full' : ''}`}>{value}</span>
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
    contract: stageIndex >= columns.findIndex(c => c.id === 'col-contract'),
    implementation: stageIndex >= columns.findIndex(c => c.id === 'col-implementation'),
  };

  const isLateStageDeal = tabVisibility.delivery || tabVisibility.contract;

  const visibleTabs = [
    { id: 'details', label: 'Details', icon: null },
    { id: 'follow-up', label: 'Follow-up', icon: <Handshake className="w-4 h-4 mr-2"/> },
    tabVisibility.prospecting && { id: 'prospecting', label: 'Prospecting', icon: <Target className="w-4 h-4 mr-2" /> },
    tabVisibility.proposal && { id: 'proposal', label: 'Proposal', icon: <FileUp className="w-4 h-4 mr-2" /> },
    tabVisibility.review && { id: 'review', label: 'Review', icon: <Search className="w-4 h-4 mr-2" /> },
    isLateStageDeal && { id: 'delivery-contract', label: 'Delivery & Contract', icon: <FileSignature className="w-4 h-4 mr-2" /> },
    tabVisibility.implementation && { id: 'implementation', label: 'Implementation', icon: <BookUser className="w-4 h-4 mr-2" /> },
    { id: 'stakeholders', label: 'Stakeholders', icon: <Users className="w-4 h-4 mr-2"/>, disabled: !canUseAiFeatures },
    { id: 'next-steps', label: 'Next Steps', icon: <Lightbulb className="w-4 h-4 mr-2"/>, disabled: !canUseAiFeatures },
    { id: 'documents', label: 'Documents', icon: <FolderKanban className="w-4 h-4 mr-2"/> }
  ].filter(Boolean) as ({ id: string, label: string, icon: React.ReactNode, disabled?: boolean})[];

  const defaultTab = isLateStageDeal ? "delivery-contract" : "details";
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{lead.title}</DialogTitle>
          <DialogDescription>{lead.company}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <Tabs defaultValue={defaultTab} className="flex flex-col h-full">
            <TabsList className={cn(`grid w-full`, `grid-cols-${visibleTabs.length}`)}>
              {visibleTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                  {tab.icon}{tab.label}
                </TabsTrigger>
              ))}
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
                    <CardHeader>
                        <CardTitle>Create Proposal</CardTitle>
                        <CardDescription>Fill out the details for the internal proposal document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="template">Proposal Template</Label>
                                <Select defaultValue={lead.proposalData?.templateUsed}>
                                    <SelectTrigger id="template">
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standard">Standard Template</SelectItem>
                                        <SelectItem value="Enterprise">Enterprise Template</SelectItem>
                                        <SelectItem value="SME">SME Template</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pricing">Pricing Structure</Label>
                                <Select defaultValue={lead.proposalData?.pricingStructure}>
                                    <SelectTrigger id="pricing">
                                        <SelectValue placeholder="Select pricing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed</SelectItem>
                                        <SelectItem value="T&M">T&M</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="services">Services/Products Included</Label>
                            <Textarea id="services" defaultValue={lead.proposalData?.servicesIncluded} placeholder="List all services and products..."/>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="duration">Project Duration Estimate</Label>
                                <Input id="duration" defaultValue={lead.proposalData?.projectDuration} placeholder="e.g., 3 months" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="terms">Terms & Conditions Version</Label>
                                <Input id="terms" defaultValue={lead.proposalData?.termsVersion} placeholder="e.g., v2.1" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resources">Resource Requirements Analysis</Label>
                            <Textarea id="resources" defaultValue={lead.proposalData?.resourceRequirements} placeholder="Analyze the resources needed..."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="success-criteria">Success Criteria Incorporation</Label>
                            <Textarea id="success-criteria" placeholder="Incorporate success criteria from opportunity stage..." />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 mt-4 flex items-center gap-2"><Edit className="w-4 h-4"/>Revision History</h4>
                          <ul className="space-y-2">
                            {lead.proposalData?.revisionHistory.map(rev => (
                               <li key={rev.version} className="flex gap-4 text-sm border-l-2 pl-4">
                                <div>V{rev.version}</div>
                                <div>{format(new Date(rev.date), 'PPP')}</div>
                                <div className="text-muted-foreground">{rev.notes}</div>
                               </li>
                            ))}
                          </ul>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Proposal</Button>
                    </CardFooter>
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
            
            {isLateStageDeal && (
              <TabsContent value="delivery-contract" className="flex-grow overflow-auto p-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'><Presentation className="w-6 h-6 text-primary" />Client Delivery</CardTitle>
                      <CardDescription>Details of the proposal presentation and client feedback.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {lead.clientDeliveryData ? (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Users2 className="w-5 h-5 text-primary" />Client Presentation</h4>
                            <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                                <DetailRow label="Proposal Sent" value={lead.clientDeliveryData.proposalSentDate ? format(new Date(lead.clientDeliveryData.proposalSentDate), 'PPP') : 'N/A'} />
                                <DetailRow label="Presentation Date" value={lead.clientDeliveryData.proposalPresentationDate ? format(new Date(lead.clientDeliveryData.proposalPresentationDate), 'PPP') : 'N/A'} />
                                <DetailRow label="Presentation Method" value={lead.clientDeliveryData.presentationMethod} />
                                <DetailRow label="Decision Maker Present" value={lead.clientDeliveryData.decisionMakerPresent} />
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Attendees:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.attendees}</p>
                                </div>
                            </div>
                          </div>
                          <Separator />
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2"><Info className="w-5 h-5 text-blue-500" />Feedback & Negotiation</h4>
                              <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                                <DetailRow label="Revision Requested" value={lead.clientDeliveryData.proposalRevisionRequested} />
                                <DetailRow label="Decision Timeline" value={lead.clientDeliveryData.decisionTimeline} />
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Client Feedback:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.clientFeedback}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Client Questions/Objections:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.clientQuestions}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Additional Requirements:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.additionalRequirements}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Follow-up Actions:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.followUpActions}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Competitive Situation:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.clientDeliveryData.competitiveSituationUpdate}</p>
                                </div>
                              </div>
                            </div>
                        </div>
                      ) : <p className="text-muted-foreground">No client delivery data available.</p>}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'><FileSignature className="w-6 h-6 text-primary" />Contract</CardTitle>
                      <CardDescription>Details of the legal agreement and final terms.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {lead.contractData ? (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Newspaper className="w-5 h-5 text-primary" />Legal & Agreement</h4>
                            <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                                <DetailRow label="Contract Template" value={lead.contractData.templateUsed} />
                                <DetailRow label="Contract Version" value={lead.contractData.version} />
                                <DetailRow label="Legal Review" value={lead.contractData.legalReviewRequired} />
                                <DetailRow label="Legal Reviewer" value={lead.contractData.legalReviewer || 'N/A'} />
                                <DetailRow label="Contract Sent" value={lead.contractData.sentDate ? format(new Date(lead.contractData.sentDate), 'PPP') : 'N/A'} />
                                <DetailRow label="Client Review" value={lead.contractData.clientReviewStatus} />
                                <DetailRow label="Final Contract Date" value={lead.contractData.finalDate ? format(new Date(lead.contractData.finalDate), 'PPP') : 'N/A'} />
                                <DetailRow label="Signed Date" value={lead.contractData.signedDate ? format(new Date(lead.contractData.signedDate), 'PPP') : 'N/A'} />
                                <DetailRow label="Final Value" value={`$${lead.contractData.finalValue.toLocaleString()} ${lead.currency}`} />
                                <DetailRow label="Payment Terms" value={lead.contractData.paymentTerms} />
                            </div>
                          </div>
                          <Separator />
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2"><Info className="w-5 h-5 text-blue-500" />Details & History</h4>
                              <div className="text-sm grid grid-cols-1 gap-y-2 pl-7">
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Redlines/Changes Requested:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.contractData.redlinesRequested}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Negotiation Log:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.contractData.negotiationLog}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Key Clauses:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.contractData.keyClauses}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Renewal Terms:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.contractData.renewalTerms}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Success Criteria:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.contractData.projectSuccessCriteria}</p>
                                </div>
                              </div>
                            </div>
                        </div>
                      ) : <p className="text-muted-foreground">No contract data available.</p>}
                    </CardContent>
                  </Card>
              </TabsContent>
            )}

            {tabVisibility.implementation && (
               <TabsContent value="implementation" className="flex-grow overflow-auto p-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation & Training</CardTitle>
                    <CardDescription>Tracking project delivery and user training.</CardDescription>
                  </CardHeader>
                   <CardContent>
                      {lead.implementationAndTrainingData ? (
                        <div className="space-y-6">
                           <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Briefcase className="w-5 h-5 text-primary" />Project Delivery</h4>
                            <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                                <DetailRow label="Project Manager" value={lead.implementationAndTrainingData.projectManager} />
                                <DetailRow label="Client POC" value={lead.implementationAndTrainingData.clientPoc} />
                                <DetailRow label="Kickoff Date" value={format(new Date(lead.implementationAndTrainingData.kickoffDate), 'PPP')} />
                                <DetailRow label="Go-Live Date" value={format(new Date(lead.implementationAndTrainingData.goLiveDate), 'PPP')} />
                                <DetailRow label="Plan Status" value={lead.implementationAndTrainingData.implementationPlanStatus} />
                                <DetailRow label="Team" value={lead.implementationAndTrainingData.implementationTeam.join(', ')} />
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Resource Allocation:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.implementationAndTrainingData.resourceAllocation}</p>
                                </div>
                            </div>
                          </div>
                          <Separator/>
                           <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><BookUser className="w-5 h-5 text-primary" />Training</h4>
                            <div className="text-sm grid md:grid-cols-2 gap-x-8 gap-y-2 pl-7">
                                <DetailRow label="Trainer" value={lead.implementationAndTrainingData.trainer} />
                                <DetailRow label="Users to Train" value={lead.implementationAndTrainingData.usersToTrain} />
                                <DetailRow label="Delivery Method" value={lead.implementationAndTrainingData.trainingDeliveryMethod} />
                                <DetailRow label="Plan Status" value={lead.implementationAndTrainingData.trainingPlanStatus} />
                                <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Schedule:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.implementationAndTrainingData.trainingSchedule}</p>
                                </div>
                                 <div className="col-span-2 space-y-1">
                                  <p className="font-medium text-muted-foreground">Materials:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.implementationAndTrainingData.trainingMaterials.join(', ')}</p>
                                </div>
                            </div>
                          </div>
                          <Separator/>
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-600" />Progress & Issues</h4>
                              <div className="text-sm grid grid-cols-1 gap-y-4 pl-7">
                                <div>
                                    <p className="font-medium text-muted-foreground mb-2">Milestones:</p>
                                    <ul className="space-y-2">
                                    {lead.implementationAndTrainingData.milestoneTracking.map((m,i) => (
                                        <li key={i} className="flex gap-4 items-center">
                                            <Badge variant={m.status === 'Completed' ? 'default' : 'secondary'}>{m.status}</Badge>
                                            <span>{m.milestone}</span>
                                            <span className="text-muted-foreground">({format(new Date(m.date), 'PPP')})</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Issues/Risks Log:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.implementationAndTrainingData.issuesLog}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-muted-foreground">Change Requests:</p>
                                  <p className="whitespace-pre-wrap pl-6">{lead.implementationAndTrainingData.changeRequests}</p>
                                </div>
                              </div>
                            </div>

                        </div>
                      ) : <p className="text-muted-foreground">No implementation data available.</p>}
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

    