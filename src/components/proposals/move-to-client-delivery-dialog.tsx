
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

const reviewSchema = z.object({
  cstReviewStatus: z.enum(['Approved', 'Needs Changes', 'Pending']),
  cstReviewer: z.string().optional(),
  technicalFeasibilityNotes: z.string().optional(),
  resourceAvailabilityCheck: z.enum(['Completed', 'Pending']),
  croReviewStatus: z.enum(['Approved', 'Needs Changes', 'Pending']),
  croReviewer: z.string().optional(),
  marginAnalysis: z.string().optional(),
  riskAssessment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface MoveToClientDeliveryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToClientDelivery: (leadId: string, reviewData: InternalReviewData) => void;
  lead: Lead | null;
  users: User[];
}

export function MoveToClientDeliveryDialog({ isOpen, onOpenChange, onMoveToClientDelivery, lead, users }: MoveToClientDeliveryDialogProps) {
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
        cstReviewStatus: 'Pending',
        resourceAvailabilityCheck: 'Pending',
        croReviewStatus: 'Pending',
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    if (!lead) return;
    
    const reviewData: InternalReviewData = {
        ...values,
        cstReviewDate: values.cstReviewStatus !== 'Pending' ? new Date().toISOString() : undefined,
        financialReviewDate: values.croReviewStatus !== 'Pending' ? new Date().toISOString() : undefined,
        finalApprovalDate: values.cstReviewStatus === 'Approved' && values.croReviewStatus === 'Approved' ? new Date().toISOString() : undefined,
        approvedBy: values.cstReviewStatus === 'Approved' && values.croReviewStatus === 'Approved' ? 'System' : undefined, // Placeholder
    };
    onMoveToClientDelivery(lead.id, reviewData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Move to Client Delivery</DialogTitle>
          <DialogDescription>
            Complete the internal review for &quot;{lead?.title}&quot; to move it to the next stage.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="move-to-delivery-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">CST Review</h3>
                 <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="cstReviewStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CST Review Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Needs Changes">Needs Changes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cstReviewer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CST Reviewer</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select reviewer..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="technicalFeasibilityNotes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Technical Feasibility Notes</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="resourceAvailabilityCheck"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resource Availability Check</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h3 className="text-lg font-semibold border-b pb-2 pt-4">CRO Review</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="croReviewStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CRO Review Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Needs Changes">Needs Changes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="croReviewer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CRO Reviewer</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select reviewer..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="marginAnalysis"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Margin Analysis</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="riskAssessment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Risk Assessment</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </form>
          </Form>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="move-to-delivery-form">Move to Client Delivery</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
