
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
import type { ChangeOrderData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const changeOrderSchema = z.object({
  type: z.enum(['Scope', 'Time', 'Cost']),
  requestedBy: z.string().min(1, 'This field is required.'),
  description: z.string().min(10, 'Please provide a detailed description.'),
  impactAnalysis: z.string().min(10, 'Please provide a detailed impact analysis.'),
  value: z.coerce.number().min(0, 'Value must be a positive number.'),
  implementationDate: z.date({ required_error: 'Implementation date is required.' }),
  updatedTimeline: z.string().min(1, 'This field is required.'),
  updatedBudget: z.coerce.number().min(0, 'Budget must be a positive number.'),
  documentationUrl: z.string().url('Please enter a valid URL.'),
});

type ChangeOrderFormValues = z.infer<typeof changeOrderSchema>;

interface AddChangeOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChangeOrder: (changeOrder: Omit<ChangeOrderData, 'id' | 'parentOpportunityId' | 'status' | 'auditTrail'>) => void;
}

export function AddChangeOrderDialog({ isOpen, onOpenChange, onAddChangeOrder }: AddChangeOrderDialogProps) {
  const form = useForm<ChangeOrderFormValues>({
    resolver: zodResolver(changeOrderSchema),
    defaultValues: {
      type: 'Scope',
      requestedBy: '',
      description: '',
      impactAnalysis: '',
      value: 0,
      updatedTimeline: '',
      updatedBudget: 0,
      documentationUrl: '',
    },
  });

  const onSubmit = (values: ChangeOrderFormValues) => {
    const dataToSubmit = {
      ...values,
      implementationDate: values.implementationDate.toISOString(),
    };
    onAddChangeOrder(dataToSubmit);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Change Order</DialogTitle>
          <DialogDescription>
            Document a new change request for this project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
        <Form {...form}>
          <form id="add-change-order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <FormField name="type" control={form.control} render={({ field }) => <FormItem><FormLabel>Change Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Scope">Scope</SelectItem><SelectItem value="Time">Time</SelectItem><SelectItem value="Cost">Cost</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                <FormField name="requestedBy" control={form.control} render={({ field }) => <FormItem><FormLabel>Requested By</FormLabel><FormControl><Input placeholder="e.g., Client Name" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField name="description" control={form.control} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the change request in detail..." {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="impactAnalysis" control={form.control} render={({ field }) => <FormItem><FormLabel>Impact Analysis</FormLabel><FormControl><Textarea placeholder="Analyze the impact on time, cost, and scope..." {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid grid-cols-2 gap-4">
                 <FormField name="value" control={form.control} render={({ field }) => <FormItem><FormLabel>Change Order Value ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                 <FormField name="updatedBudget" control={form.control} render={({ field }) => <FormItem><FormLabel>New Total Budget ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    name="implementationDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Implementation Date</FormLabel>
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
                 <FormField name="updatedTimeline" control={form.control} render={({ field }) => <FormItem><FormLabel>Updated Timeline</FormLabel><FormControl><Input placeholder="e.g., Adds 2 weeks" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField name="documentationUrl" control={form.control} render={({ field }) => <FormItem><FormLabel>Documentation URL</FormLabel><FormControl><Input placeholder="https://example.com/doc.pdf" {...field} /></FormControl><FormMessage /></FormItem>} />

          </form>
        </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-change-order-form">Create Change Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
