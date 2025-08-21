
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead, LeadStatus, ProspectData, FutureOpportunityData, DisqualifiedData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { MarkAsProspectDialog, ProspectFormValues } from './mark-as-prospect-dialog';


interface ChangeStatusDialogsProps {
  statusChangeLead: { lead: Lead; status: LeadStatus } | null;
  onOpenChange: (open: boolean) => void;
  onStatusChanged: (leadId: string, status: LeadStatus, data?: any) => void;
}

const unawareEngagedSchema = z.object({
    notes: z.string().min(1, 'Notes are required.'),
});
type UnawareEngagedValues = z.infer<typeof unawareEngagedSchema>;


const futureOpportunitySchema = z.object({
  reminderDate: z.date({ required_error: 'Reminder date is required.' }),
  reason: z.string().min(1, 'Reason is required.'),
  notes: z.string().optional(),
});
type FutureOpportunityValues = z.infer<typeof futureOpportunitySchema>;

const disqualifiedSchema = z.object({
  reason: z.enum(['Not a fit', 'No budget', 'No timeline', 'Went with competitor', 'Unresponsive', 'Other']),
  competitor: z.string().optional(),
  notes: z.string().optional(),
});
type DisqualifiedValues = z.infer<typeof disqualifiedSchema>;


export function ChangeStatusDialogs({ statusChangeLead, onOpenChange, onStatusChanged }: ChangeStatusDialogsProps) {
  const lead = statusChangeLead?.lead;
  const status = statusChangeLead?.status;

  const unawareEngagedForm = useForm<UnawareEngagedValues>({
    resolver: zodResolver(unawareEngagedSchema),
    defaultValues: { notes: '' },
  });

  const futureOpportunityForm = useForm<FutureOpportunityValues>({
    resolver: zodResolver(futureOpportunitySchema)
  });

  const disqualifiedForm = useForm<DisqualifiedValues>({
    resolver: zodResolver(disqualifiedSchema)
  });

  const handleUnawareEngagedSubmit = (values: UnawareEngagedValues) => {
    if (!lead || !status) return;
    onStatusChanged(lead.id, status, values);
    onOpenChange(false);
  };
  
  const handleProspectSubmit = (data: ProspectFormValues) => {
     if (!lead) return;
    const prospectData: ProspectData = {
        ...data,
        responseDate: data.responseDate.toISOString(),
        demoDate: data.demoDate?.toISOString(),
    };
    onStatusChanged(lead.id, 'Prospect', prospectData);
    onOpenChange(false);
  };

  const handleFutureOpportunitySubmit = (values: FutureOpportunityValues) => {
    if (!lead) return;
    const data: FutureOpportunityData = {
        ...values,
        reminderDate: values.reminderDate.toISOString()
    }
    onStatusChanged(lead.id, 'Future Opportunity', data);
    onOpenChange(false);
  };
  
  const handleDisqualifiedSubmit = (values: DisqualifiedValues) => {
    if (!lead) return;
    onStatusChanged(lead.id, 'Disqualified', values);
    onOpenChange(false);
  };

  const reasonForDisqualification = disqualifiedForm.watch('reason');

  const renderDialogContent = () => {
    switch (status) {
      case 'Unaware':
      case 'Engaged':
      case 'Qualified':
        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Status to &quot;{status}&quot;</DialogTitle>
              <DialogDescription>Add notes for this status change for &quot;{lead?.title}&quot;.</DialogDescription>
            </DialogHeader>
            <Form {...unawareEngagedForm}>
                <form id="unaware-engaged-form" onSubmit={unawareEngagedForm.handleSubmit(handleUnawareEngagedSubmit)}>
                    <FormField
                        control={unawareEngagedForm.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add relevant notes for this status change..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" form="unaware-engaged-form">Save</Button>
            </DialogFooter>
          </DialogContent>
        );
      case 'Prospect':
        return <MarkAsProspectDialog isOpen={true} onOpenChange={onOpenChange} lead={lead} onProspectMarked={handleProspectSubmit} />;
      case 'Future Opportunity':
        return (
           <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Status to &quot;Future Opportunity&quot;</DialogTitle>
              <DialogDescription>Set a reminder to follow up with &quot;{lead?.title}&quot;.</DialogDescription>
            </DialogHeader>
            <Form {...futureOpportunityForm}>
                <form id="future-opportunity-form" onSubmit={futureOpportunityForm.handleSubmit(handleFutureOpportunitySubmit)} className="space-y-4">
                    <FormField
                        control={futureOpportunityForm.control}
                        name="reminderDate"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Reminder Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(!field.value && "text-muted-foreground")}
                                        >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={futureOpportunityForm.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Budget freeze until next quarter" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={futureOpportunityForm.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" form="future-opportunity-form">Save</Button>
            </DialogFooter>
          </DialogContent>
        )
      case 'Disqualified':
        return (
           <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Status to &quot;Disqualified&quot;</DialogTitle>
              <DialogDescription>Provide disqualification details for &quot;{lead?.title}&quot;.</DialogDescription>
            </DialogHeader>
            <Form {...disqualifiedForm}>
                <form id="disqualified-form" onSubmit={disqualifiedForm.handleSubmit(handleDisqualifiedSubmit)} className="space-y-4">
                     <FormField
                        control={disqualifiedForm.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Not a fit">Not a fit</SelectItem>
                                        <SelectItem value="No budget">No budget</SelectItem>
                                        <SelectItem value="No timeline">No timeline</SelectItem>
                                        <SelectItem value="Went with competitor">Went with competitor</SelectItem>
                                        <SelectItem value="Unresponsive">Unresponsive</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {reasonForDisqualification === 'Went with competitor' && (
                         <FormField
                            control={disqualifiedForm.control}
                            name="competitor"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Competitor</FormLabel>
                                <FormControl>
                                    <Input placeholder="Competitor name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                     <FormField
                        control={disqualifiedForm.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" form="disqualified-form">Save</Button>
            </DialogFooter>
          </DialogContent>
        )
      default:
        return null;
    }
  };

  return <Dialog open={!!statusChangeLead} onOpenChange={onOpenChange}>{renderDialogContent()}</Dialog>;
}
