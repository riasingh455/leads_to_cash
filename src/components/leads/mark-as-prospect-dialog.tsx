
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
import type { Lead, ProspectData } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const prospectSchema = z.object({
  responseDate: z.date({ required_error: 'Response date is required.' }),
  engagementType: z.enum(['Phone response', 'Email reply', 'Meeting request', 'Other']),
  contactQuality: z.enum(['Decision maker', 'Influencer', 'Gatekeeper']),
  qualificationNotes: z.string().min(1, 'Qualification notes are required.'),
  demoScheduled: z.enum(['Yes', 'No']),
  demoDate: z.date().optional(),
  competitorAwareness: z.string().optional(),
  painPoints: z.string().min(1, 'Pain points are required.'),
  nextSteps: z.string().min(1, 'Next steps are required.'),
});

export type ProspectFormValues = z.infer<typeof prospectSchema>;

interface MarkAsProspectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProspectMarked: (prospectData: ProspectData) => void;
  lead: Lead | null;
}

export function MarkAsProspectDialog({ isOpen, onOpenChange, onProspectMarked, lead }: MarkAsProspectDialogProps) {
  const form = useForm<ProspectFormValues>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
        engagementType: 'Email reply',
        contactQuality: 'Influencer',
        demoScheduled: 'No',
        qualificationNotes: '',
        competitorAwareness: '',
        painPoints: '',
        nextSteps: '',
    },
  });

  const onSubmit = (values: ProspectFormValues) => {
    if (!lead) return;
    
    const prospectData: ProspectData = {
        ...values,
        responseDate: values.responseDate.toISOString(),
        demoDate: values.demoDate?.toISOString(),
    };
    
    onProspectMarked(prospectData);
    form.reset();
    onOpenChange(false);
  };

  const demoScheduled = form.watch('demoScheduled');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mark as Prospect</DialogTitle>
          <DialogDescription>
            Qualify this lead by answering the following questions for &quot;{lead?.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="mark-as-prospect-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="responseDate"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Response Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="engagementType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Engagement Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Phone response">Phone response</SelectItem>
                                        <SelectItem value="Email reply">Email reply</SelectItem>
                                        <SelectItem value="Meeting request">Meeting request</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="contactQuality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Quality</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Decision maker">Decision maker</SelectItem>
                                    <SelectItem value="Influencer">Influencer</SelectItem>
                                    <SelectItem value="Gatekeeper">Gatekeeper</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="qualificationNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Confirm high-level interest, budget hints, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="demoScheduled"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Demo/Discovery Call Scheduled?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     {demoScheduled === 'Yes' && (
                        <FormField
                            control={form.control}
                            name="demoDate"
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Demo Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     )}
                 </div>
                 <FormField
                  control={form.control}
                  name="competitorAwareness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Awareness</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any mentioned competitors..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="painPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Pain Points</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What challenges did the client mention?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextSteps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Steps Agreed Upon</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What are the next actions?" {...field} />
                      </FormControl>
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
            <Button type="submit" form="mark-as-prospect-form">Mark as Prospect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
