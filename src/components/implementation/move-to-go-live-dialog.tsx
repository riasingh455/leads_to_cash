
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
import type { Lead, GoLiveAndSupportData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

const goLiveSchema = z.object({
  deploymentStatus: z.enum(['Completed', 'In-progress', 'Pending']),
  trainingEffectivenessScore: z.coerce.number().min(1).max(10),
  userAdoptionRate: z.coerce.number().min(0).max(100),
  knownIssues: z.string().optional(),
  successCriteriaMet: z.enum(['Yes', 'No']),
  successCriteriaNotes: z.string().optional(),
  clientSatisfactionScore: z.coerce.number().min(1).max(10),
});

type GoLiveFormValues = z.infer<typeof goLiveSchema>;

interface MoveToGoLiveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToGoLive: (leadId: string, goLiveData: GoLiveAndSupportData) => void;
  lead: Lead | null;
}

export function MoveToGoLiveDialog({ isOpen, onOpenChange, onMoveToGoLive, lead }: MoveToGoLiveDialogProps) {
  
  const form = useForm<GoLiveFormValues>({
    resolver: zodResolver(goLiveSchema),
    defaultValues: {
        deploymentStatus: 'Completed',
        successCriteriaMet: 'Yes',
        trainingEffectivenessScore: 8,
        userAdoptionRate: 90,
        clientSatisfactionScore: 8,
    },
  });

  const onSubmit = (values: GoLiveFormValues) => {
    if (!lead) return;
    
    const goLiveData: GoLiveAndSupportData = {
        ...values,
        uatCompleteDate: new Date().toISOString(),
        goLiveDate: new Date().toISOString(),
        systemCutoverDate: new Date().toISOString(),
        trainingCompletionDate: new Date().toISOString(),
        supportStartDate: new Date().toISOString(),
        supportEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    };
    onMoveToGoLive(lead.id, goLiveData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Move to Go-Live & Handoff</DialogTitle>
          <DialogDescription>
            Confirm project completion for &quot;{lead?.title}&quot; to move it to the post-sales stage.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="move-to-go-live-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className='grid grid-cols-2 gap-4'>
                    <FormField name="deploymentStatus" control={form.control} render={({field}) => <FormItem><FormLabel>Deployment Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Completed">Completed</SelectItem><SelectItem value="In-progress">In-progress</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                    <FormField name="successCriteriaMet" control={form.control} render={({field}) => <FormItem><FormLabel>Success Criteria Met</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                </div>
                 <FormField name="successCriteriaNotes" control={form.control} render={({field}) => <FormItem><FormLabel>Success Criteria Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                <div className='grid grid-cols-3 gap-4'>
                    <FormField name="trainingEffectivenessScore" control={form.control} render={({field}) => <FormItem><FormLabel>Training Score (1-10)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>} />
                    <FormField name="userAdoptionRate" control={form.control} render={({field}) => <FormItem><FormLabel>User Adoption (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>} />
                    <FormField name="clientSatisfactionScore" control={form.control} render={({field}) => <FormItem><FormLabel>Client Satisfaction (1-10)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>} />
                </div>
                 <FormField name="knownIssues" control={form.control} render={({field}) => <FormItem><FormLabel>Known Issues at Launch</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
            </form>
          </Form>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="move-to-go-live-form">Move to Go-Live</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
