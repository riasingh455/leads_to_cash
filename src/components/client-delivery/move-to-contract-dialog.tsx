
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
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead, ClientDeliveryData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';

const deliverySchema = z.object({
  proposalSentDate: z.date({ required_error: 'Date is required.' }),
  proposalPresentationDate: z.date({ required_error: 'Date is required.' }),
  presentationMethod: z.enum(['In-person', 'Virtual', 'Email only']),
  attendees: z.string().min(1, 'Attendees are required.'),
  decisionMakerPresent: z.enum(['Yes', 'No']),
  clientFeedback: z.string().optional(),
  clientQuestions: z.string().optional(),
  additionalRequirements: z.string().optional(),
  competitiveSituationUpdate: z.string().optional(),
  proposalRevisionRequested: z.enum(['Yes', 'No']),
  followUpActions: z.string().optional(),
  decisionTimeline: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

interface MoveToContractDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToContract: (leadId: string, deliveryData: ClientDeliveryData) => void;
  lead: Lead | null;
}

export function MoveToContractDialog({ isOpen, onOpenChange, onMoveToContract, lead }: MoveToContractDialogProps) {
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      presentationMethod: 'Virtual',
      decisionMakerPresent: 'Yes',
      proposalRevisionRequested: 'No',
    },
  });
  
  useEffect(() => {
      if (lead) {
          form.reset({
            proposalSentDate: lead.clientDeliveryData?.proposalSentDate ? new Date(lead.clientDeliveryData.proposalSentDate) : undefined,
            proposalPresentationDate: lead.clientDeliveryData?.proposalPresentationDate ? new Date(lead.clientDeliveryData.proposalPresentationDate) : undefined,
            presentationMethod: lead.clientDeliveryData?.presentationMethod || 'Virtual',
            attendees: lead.clientDeliveryData?.attendees || '',
            decisionMakerPresent: lead.clientDeliveryData?.decisionMakerPresent || 'Yes',
            clientFeedback: lead.clientDeliveryData?.clientFeedback || '',
            clientQuestions: lead.clientDeliveryData?.clientQuestions || '',
            additionalRequirements: lead.clientDeliveryData?.additionalRequirements || '',
            competitiveSituationUpdate: lead.clientDeliveryData?.competitiveSituationUpdate || '',
            proposalRevisionRequested: lead.clientDeliveryData?.proposalRevisionRequested || 'No',
            followUpActions: lead.clientDeliveryData?.followUpActions || '',
            decisionTimeline: lead.clientDeliveryData?.decisionTimeline || '',
          })
      }
  }, [lead, form]);


  const onSubmit = (values: DeliveryFormValues) => {
    if (!lead) return;

    const deliveryData: ClientDeliveryData = {
      ...values,
      proposalSentDate: values.proposalSentDate.toISOString(),
      proposalPresentationDate: values.proposalPresentationDate.toISOString(),
    };
    onMoveToContract(lead.id, deliveryData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Move to Contract</DialogTitle>
          <DialogDescription>
            Enter details from the client presentation for &quot;{lead?.title}&quot; to advance to the contract stage.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="move-to-contract-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Client Presentation</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="proposalSentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Proposal Sent Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn(!field.value && "text-muted-foreground")}>
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
                  control={form.control}
                  name="proposalPresentationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Presentation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn(!field.value && "text-muted-foreground")}>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="presentationMethod" control={form.control} render={({ field }) => <FormItem><FormLabel>Presentation Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="In-person">In-person</SelectItem><SelectItem value="Virtual">Virtual</SelectItem><SelectItem value="Email only">Email only</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                <FormField name="decisionMakerPresent" control={form.control} render={({ field }) => <FormItem><FormLabel>Decision Maker Present?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              </div>
              <FormField name="attendees" control={form.control} render={({ field }) => <FormItem><FormLabel>Attendees</FormLabel><FormControl><Input placeholder="John Doe, Jane Smith..." {...field} /></FormControl><FormMessage /></FormItem>} />

              <h3 className="text-lg font-semibold border-b pb-2 pt-4">Feedback & Negotiation</h3>
              <FormField name="clientFeedback" control={form.control} render={({ field }) => <FormItem><FormLabel>Client Feedback on Proposal</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name="clientQuestions" control={form.control} render={({ field }) => <FormItem><FormLabel>Client Questions/Objections</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name="additionalRequirements" control={form.control} render={({ field }) => <FormItem><FormLabel>Additional Requirements Identified</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name="competitiveSituationUpdate" control={form.control} render={({ field }) => <FormItem><FormLabel>Competitive Situation Update</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name="proposalRevisionRequested" control={form.control} render={({ field }) => <FormItem><FormLabel>Proposal Revision Requested?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              <FormField name="followUpActions" control={form.control} render={({ field }) => <FormItem><FormLabel>Follow-up Actions Required</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name="decisionTimeline" control={form.control} render={({ field }) => <FormItem><FormLabel>Updated Decision Timeline</FormLabel><FormControl><Input placeholder="e.g., End of month" {...field} /></FormControl><FormMessage /></FormItem>} />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="move-to-contract-form">Move to Contract</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
