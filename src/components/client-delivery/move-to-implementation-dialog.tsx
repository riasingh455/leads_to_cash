
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
import type { Lead, User, ContractData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

const contractSchema = z.object({
  templateUsed: z.string().min(1, 'Template is required.'),
  version: z.string().min(1, 'Version is required.'),
  legalReviewRequired: z.enum(['Yes', 'No']),
  legalReviewer: z.string().optional(),
  finalValue: z.coerce.number().min(1, 'Final value is required.'),
  paymentTerms: z.string().min(1, 'Payment terms are required.'),
  keyClauses: z.string().optional(),
  renewalTerms: z.string().optional(),
  projectSuccessCriteria: z.string().min(1, 'Success criteria is required.'),
  clientReviewStatus: z.enum(['Pending', 'Reviewed', 'Approved']),
  redlinesRequested: z.string().optional(),
  negotiationLog: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

interface MoveToImplementationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToImplementation: (leadId: string, contractData: ContractData) => void;
  lead: Lead | null;
  users: User[];
}

export function MoveToImplementationDialog({ isOpen, onOpenChange, onMoveToImplementation, lead, users }: MoveToImplementationDialogProps) {
  
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      templateUsed: lead?.contractData?.templateUsed || 'Standard Contract',
      version: lead?.contractData?.version || '1.0',
      legalReviewRequired: lead?.contractData?.legalReviewRequired || 'No',
      paymentTerms: lead?.contractData?.paymentTerms || 'Net 30',
      projectSuccessCriteria: lead?.contractData?.projectSuccessCriteria || 'Standard',
      finalValue: lead?.contractData?.finalValue || 0,
      clientReviewStatus: lead?.contractData?.clientReviewStatus || 'Pending',
    },
  });

  const onSubmit = (values: ContractFormValues) => {
    if (!lead) return;
    
    const contractData: ContractData = {
        ...values,
        sentDate: new Date().toISOString(),
        finalDate: new Date().toISOString(),
        signedDate: new Date().toISOString(),
    };
    onMoveToImplementation(lead.id, contractData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Move to Implementation</DialogTitle>
          <DialogDescription>
            Finalize contract details for &quot;{lead?.title}&quot; to move it to the implementation stage.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="move-to-implementation-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <h3 className="text-lg font-semibold border-b pb-2">Legal & Agreement</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <FormField name="templateUsed" control={form.control} render={({field}) => <FormItem><FormLabel>Template Used</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                    <FormField name="version" control={form.control} render={({field}) => <FormItem><FormLabel>Version</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                </div>
                 <div className='grid grid-cols-2 gap-4'>
                    <FormField name="legalReviewRequired" control={form.control} render={({field}) => <FormItem><FormLabel>Legal Review Required</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                    <FormField name="legalReviewer" control={form.control} render={({field}) => <FormItem><FormLabel>Legal Reviewer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <FormField name="finalValue" control={form.control} render={({field}) => <FormItem><FormLabel>Final Contract Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>} />
                    <FormField name="paymentTerms" control={form.control} render={({field}) => <FormItem><FormLabel>Payment Terms</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                </div>
                <FormField name="keyClauses" control={form.control} render={({field}) => <FormItem><FormLabel>Key Contract Clauses</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                <FormField name="renewalTerms" control={form.control} render={({field}) => <FormItem><FormLabel>Renewal Terms</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                <FormField name="projectSuccessCriteria" control={form.control} render={({field}) => <FormItem><FormLabel>Project Success Criteria</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />

                 <h3 className="text-lg font-semibold border-b pb-2 pt-4">Client Review & Negotiation</h3>
                 <FormField name="clientReviewStatus" control={form.control} render={({field}) => <FormItem><FormLabel>Client Review Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Reviewed">Reviewed</SelectItem><SelectItem value="Approved">Approved</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                <FormField name="redlinesRequested" control={form.control} render={({field}) => <FormItem><FormLabel>Redlines/Changes Requested</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                <FormField name="negotiationLog" control={form.control} render={({field}) => <FormItem><FormLabel>Contract Negotiation Log</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
            </form>
          </Form>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="move-to-implementation-form">Move to Implementation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
