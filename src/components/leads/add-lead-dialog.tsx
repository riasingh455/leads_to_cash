
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
import type { Lead, User, StatusUpdate } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { campaigns } from '@/lib/data';
import { Textarea } from '../ui/textarea';

const leadSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  title: z.string().optional(), // Proposed Offering
  source: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '501+']).optional(),
  contactTitle: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  region: z.string().optional(),
  ownerId: z.string().optional(),
  campaignId: z.string().optional(),
  status: z.enum(['Unaware', 'Engaged', 'Prospect']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface AddLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded: (lead: Lead) => void;
  users: User[];
  defaultStage?: string;
  defaultCampaignId?: string;
}

export function AddLeadDialog({ isOpen, onOpenChange, onLeadAdded, users, defaultStage = 'col-1', defaultCampaignId }: AddLeadDialogProps) {
  const { toast } = useToast();
  const salesReps = users.filter(u => u.role === 'Sales Rep' || u.role === 'Admin');

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      company: '',
      contactName: '',
      title: '',
      source: '',
      industry: '',
      contactTitle: '',
      contactEmail: '',
      contactPhone: '',
      region: '',
      ownerId: salesReps[0]?.id || '',
      campaignId: defaultCampaignId || 'none',
      status: 'Unaware',
    },
  });

  const onSubmit = (values: LeadFormValues) => {
    const status = values.status;
    let columnId = 'col-1';
    if (status === 'Engaged') columnId = 'col-2';
    if (status === 'Prospect') columnId = 'col-prospect';

    const initialStatusUpdate: StatusUpdate = {
        status,
        date: new Date().toISOString(),
        notes: 'Lead created with this status.',
        updatedBy: values.ownerId || 'system',
    };

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      title: values.title || 'New Lead',
      company: values.company,
      ownerId: values.ownerId || users.find(u => u.role === 'Admin')?.id || 'user-1',
      campaignId: values.campaignId === 'none' ? undefined : values.campaignId,
      contact: {
        name: values.contactName,
        email: values.contactEmail || '',
        phone: values.contactPhone || '',
        title: values.contactTitle || '',
      },
      columnId: defaultStage !== 'col-1' ? defaultStage : columnId,
      score: 50, // Default score
      priority: 'Medium',
      status: status,
      statusHistory: [initialStatusUpdate],
      entryDate: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      nextAction: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: values.source || 'Manual Entry',
      companySize: values.companySize || '11-50',
      industry: values.industry || 'N/A',
      region: values.region || 'N/A',
      followUpCadence: [],
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new lead. Required fields are marked with an asterisk.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="add-lead-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Innovate Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501+">501+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country/Region</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., North America" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed Offering</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the initial service or product pitch..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <h3 className="text-lg font-semibold mt-4 border-t pt-4">Primary Contact</h3>
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing Director" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold mt-4 border-t pt-4">Lead Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Campaign</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!defaultCampaignId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a campaign (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {campaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an initial status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Unaware">Unaware</SelectItem>
                        <SelectItem value="Engaged">Engaged</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </form>
          </Form>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="add-lead-form">Create Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
