
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
import type { Lead, User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const leadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Invalid email address'),
  value: z.coerce.number().min(0, 'Value must be a positive number'),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  ownerId: z.string().min(1, 'Please select a sales rep'),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface AddLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded: (lead: Lead) => void;
  users: User[];
  defaultStage?: string;
}

export function AddLeadDialog({ isOpen, onOpenChange, onLeadAdded, users, defaultStage = 'col-1' }: AddLeadDialogProps) {
  const { toast } = useToast();
  const salesReps = users.filter(u => u.role === 'Sales Rep');

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      title: '',
      company: '',
      contactName: '',
      contactEmail: '',
      value: 0,
      currency: 'USD',
      ownerId: salesReps[0]?.id || '',
    },
  });

  const onSubmit = (values: LeadFormValues) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      title: values.title,
      company: values.company,
      value: values.value,
      currency: values.currency,
      ownerId: values.ownerId,
      contact: {
        name: values.contactName,
        email: values.contactEmail,
        phone: '',
        title: 'N/A',
      },
      columnId: defaultStage,
      score: 50, // Default score
      priority: 'Medium',
      entryDate: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      nextAction: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Manual Entry',
      companySize: '11-50',
      industry: 'N/A',
      region: 'N/A',
      followUpCadence: [],
      proposalData: {
        revisionHistory: [],
        pricingStructure: 'Fixed',
        projectDuration: '',
        resourceRequirements: '',
        servicesIncluded: '',
        templateUsed: '',
        termsVersion: '',
      }
    };

    onLeadAdded(newLead);
    toast({
      title: 'Lead Added',
      description: `${newLead.title} has been successfully added.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new lead.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposed Offering</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Innovate Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., jane.doe@innovate.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sales rep" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {salesReps.map((rep) => (
                        <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit">Create Lead</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
