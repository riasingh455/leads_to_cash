
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
import type { Lead } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

const proposalSchema = z.object({
  leadId: z.string().min(1, 'Please select a lead.'),
  templateUsed: z.string().min(1, 'Template is required'),
  servicesIncluded: z.string().min(1, 'Services are required'),
  pricingStructure: z.enum(['Fixed', 'T&M', 'Hybrid']),
  projectDuration: z.string().min(1, 'Project duration is required'),
  resourceRequirements: z.string().min(1, 'Resource requirements are required'),
  termsVersion: z.string().min(1, 'Terms version is required'),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface AddProposalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProposalAdded: (leadId: string, proposal: Omit<ProposalFormValues, 'leadId'>) => void;
  leads: Lead[];
}

const proposalReadyStages = ['col-1', 'col-2', 'col-3', 'col-prospect'];

export function AddProposalDialog({ isOpen, onOpenChange, onProposalAdded, leads }: AddProposalDialogProps) {
  const { toast } = useToast();
  
  const availableLeads = leads.filter(lead => proposalReadyStages.includes(lead.columnId) && !lead.proposalData);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      leadId: '',
      templateUsed: 'Standard',
      servicesIncluded: '',
      pricingStructure: 'Fixed',
      projectDuration: '',
      resourceRequirements: '',
      termsVersion: 'v1.0',
    },
  });

  const onSubmit = (values: ProposalFormValues) => {
    const { leadId, ...proposalData } = values;
    onProposalAdded(leadId, proposalData);
    
    toast({
      title: 'Proposal Created',
      description: `The proposal has been created and assigned to the selected lead.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Proposal</DialogTitle>
          <DialogDescription>
            Create a new proposal for an existing lead or opportunity.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Lead/Opportunity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lead to create a proposal for..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.title} ({lead.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="templateUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Standard">Standard Template</SelectItem>
                      <SelectItem value="Enterprise">Enterprise Template</SelectItem>
                      <SelectItem value="SME">SME Template</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="servicesIncluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services/Products Included</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List all services and products..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricingStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Structure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fixed">Fixed</SelectItem>
                        <SelectItem value="T&M">T&M</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 6 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
                control={form.control}
                name="resourceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Requirements</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1 PM, 2 Devs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., v2.3" {...field} />
                    </FormControl>
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
                <Button type="submit">Create Proposal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
