
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
import type { Lead, User, InternalReviewData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const cstSchema = z.object({
  cstReviewStatus: z.enum(['Approved', 'Needs Changes', 'Pending']),
  cstReviewer: z.string().min(1, 'Please select a reviewer'),
  technicalFeasibilityNotes: z.string().optional(),
});
type CstFormValues = z.infer<typeof cstSchema>;

const croSchema = z.object({
  croReviewStatus: z.enum(['Approved', 'Needs Changes', 'Pending']),
  croReviewer: z.string().min(1, 'Please select a reviewer'),
  marginAnalysis: z.string().optional(),
  riskAssessment: z.string().optional(),
});
type CroFormValues = z.infer<typeof croSchema>;


interface ApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  currentUser: User;
  onUpdateReview: (leadId: string, reviewData: Partial<InternalReviewData>) => void;
}

export function ApprovalDialog({ isOpen, onOpenChange, lead, currentUser, onUpdateReview }: ApprovalDialogProps) {
  const { toast } = useToast();
  
  const cstForm = useForm<CstFormValues>({
    resolver: zodResolver(cstSchema),
    defaultValues: {
        cstReviewStatus: lead?.internalReviewData?.cstReviewStatus || 'Pending',
        cstReviewer: lead?.internalReviewData?.cstReviewer || currentUser.name,
        technicalFeasibilityNotes: lead?.internalReviewData?.technicalFeasibilityNotes || '',
    },
  });

  const croForm = useForm<CroFormValues>({
    resolver: zodResolver(croSchema),
     defaultValues: {
        croReviewStatus: lead?.internalReviewData?.croReviewStatus || 'Pending',
        croReviewer: lead?.internalReviewData?.croReviewer || currentUser.name,
        marginAnalysis: lead?.internalReviewData?.marginAnalysis || '',
        riskAssessment: lead?.internalReviewData?.riskAssessment || '',
    },
  });

  const handleCstSubmit = (values: CstFormValues) => {
    if (!lead) return;
    onUpdateReview(lead.id, values);
    toast({ title: 'CST Review Updated' });
  };
  
  const handleCroSubmit = (values: CroFormValues) => {
    if (!lead) return;
    onUpdateReview(lead.id, values);
    toast({ title: 'CRO Review Updated' });
  };
  
  const canApprove = currentUser.role === 'Admin'; // Simplified logic

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Proposal: {lead?.title}</DialogTitle>
          <DialogDescription>
            Review and approve the proposal for &quot;{lead?.company}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
            {!canApprove && (
                <Alert variant="destructive">
                    <AlertTitle>Permission Denied</AlertTitle>
                    <AlertDescription>You do not have the necessary permissions to approve proposals.</AlertDescription>
                </Alert>
            )}

            <Form {...cstForm}>
                <form id="cst-form" onSubmit={cstForm.handleSubmit(handleCstSubmit)} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">CST Review</h3>
                     <div className='grid grid-cols-2 gap-4'>
                        <FormField name="cstReviewStatus" control={cstForm.control} render={({field}) => <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Needs Changes">Needs Changes</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                        <FormField name="cstReviewer" control={cstForm.control} render={({field}) => <FormItem><FormLabel>Reviewer</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger></FormControl><SelectContent>{users.map(u=><SelectItem value={u.name} key={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>} />
                    </div>
                     <FormField name="technicalFeasibilityNotes" control={cstForm.control} render={({field}) => <FormItem><FormLabel>Technical Feasibility Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                     <Button type="submit" disabled={!canApprove}>Update CST Review</Button>
                </form>
            </Form>

             <Form {...croForm}>
                <form id="cro-form" onSubmit={croForm.handleSubmit(handleCroSubmit)} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">CRO Review</h3>
                     <div className='grid grid-cols-2 gap-4'>
                        <FormField name="croReviewStatus" control={croForm.control} render={({field}) => <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Needs Changes">Needs Changes</SelectItem></SelectContent></Select><FormMessage/></FormItem>} />
                        <FormField name="croReviewer" control={croForm.control} render={({field}) => <FormItem><FormLabel>Reviewer</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger></FormControl><SelectContent>{users.map(u=><SelectItem value={u.name} key={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>} />
                    </div>
                     <FormField name="marginAnalysis" control={croForm.control} render={({field}) => <FormItem><FormLabel>Margin Analysis</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                     <FormField name="riskAssessment" control={croForm.control} render={({field}) => <FormItem><FormLabel>Risk Assessment</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>} />
                     <Button type="submit" disabled={!canApprove}>Update CRO Review</Button>
                </form>
            </Form>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    