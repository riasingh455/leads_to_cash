
'use client';
import React from 'react';
import type { Campaign, Lead } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Target, Briefcase, Users, MessageSquare, Goal, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { LeadsTable } from '../leads/leads-table';

interface CampaignDetailsViewProps {
  campaign: Campaign;
  leads: Lead[];
  onBack: () => void;
  onViewLeadDetails: (lead: Lead) => void;
  onAddLead: () => void;
}

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <dt className="flex items-center gap-2 text-muted-foreground"><Icon className="w-5 h-5" /> {label}</dt>
    <dd className="font-medium">{value}</dd>
  </div>
);

const DetailCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
            {children}
        </CardContent>
    </Card>
)

export function CampaignDetailsView({ campaign, leads, onBack, onViewLeadDetails, onAddLead }: CampaignDetailsViewProps) {
    
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonLeads = leads.filter(l => l.columnId === 'col-5');
  const wonValue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0;
  const roi = campaign.budget > 0 ? ((wonValue - campaign.budget) / campaign.budget) * 100 : 0;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2" />
        Back to Campaigns
      </Button>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className='flex-row items-center justify-between pb-2'>
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalLeads}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className='flex-row items-center justify-between pb-2'>
                    <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className='flex-row items-center justify-between pb-2'>
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className='flex-row items-center justify-between pb-2'>
                    <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    <Goal className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{roi.toFixed(1)}%</div>
                </CardContent>
            </Card>
        </div>


      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
            <DetailCard title='Campaign Details'>
                <dl className="space-y-4 text-sm">
                    <DetailRow icon={Briefcase} label="Type" value={campaign.type} />
                    <DetailRow icon={Calendar} label="Dates" value={`${format(new Date(campaign.startDate), 'PPP')} - ${format(new Date(campaign.endDate), 'PPP')}`} />
                    <DetailRow icon={DollarSign} label="Budget" value={formatCurrency(campaign.budget)} />
                </dl>
            </DetailCard>

            <DetailCard title='Campaign Brief'>
                <dl className="space-y-4 text-sm">
                    <div className='space-y-1'>
                        <dt className='font-medium flex items-center gap-2'><Target className='w-4 h-4 text-muted-foreground'/> Target Audience</dt>
                        <dd className='text-muted-foreground text-xs'>{campaign.targetAudience}</dd>
                    </div>
                    <div className='space-y-1'>
                        <dt className='font-medium flex items-center gap-2'><MessageSquare className='w-4 h-4 text-muted-foreground'/> Key Messages</dt>
                        <dd className='text-muted-foreground text-xs whitespace-pre-wrap'>{campaign.keyMessages}</dd>
                    </div>
                    <div className='space-y-1'>
                        <dt className='font-medium flex items-center gap-2'><Goal className='w-4 h-4 text-muted-foreground'/> Goals</dt>
                        <dd className='text-muted-foreground text-xs whitespace-pre-wrap'>{campaign.goals}</dd>
                    </div>
                </dl>
            </DetailCard>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Leads from this Campaign</CardTitle>
                    <Button onClick={onAddLead} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </CardHeader>
                <CardContent>
                    <LeadsTable onViewDetails={onViewLeadDetails} leads={leads} onDeleteLead={() => {}} onMarkAsProspect={() => {}} />
                </CardContent>
            </Card>
        </div>
      </div>

    </div>
  );
}
