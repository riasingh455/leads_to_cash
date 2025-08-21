
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
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Campaign, Lead, User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2, PlusCircle, Trash2, Wand2, Upload } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { generateCampaignBriefAction } from '@/app/actions/generate-campaign-brief';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BulkImportDialog } from '../leads/bulk-import-dialog';
import { users } from '@/lib/data';

const leadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    company: z.string().optional(),
});

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['Conference', 'Webinar', 'Trade Show', 'Digital', 'Other']),
  startDate: z.date({ required_error: 'Start date is required.'}),
  endDate: z.date({ required_error: 'End date is required.'}),
  budget: z.coerce.number().min(0),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  keyMessages: z.string().optional(),
  goals: z.string().optional(),
  leads: z.array(leadSchema).optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface AddCampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignAndLeadsAdded: (campaign: Campaign, leads: Lead[]) => void;
}

export function AddCampaignDialog({ isOpen, onOpenChange, onCampaignAndLeadsAdded: onCampaignAdded }: AddCampaignDialogProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [aiIdea, setAiIdea] = useState('');

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      type: 'Conference',
      budget: 10000,
      leads: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "leads",
  });

  const handleGenerateBrief = async () => {
    if (!aiIdea) {
        toast({ variant: 'destructive', title: 'Please enter a campaign idea.' });
        return;
    }
    setIsGenerating(true);
    const result = await generateCampaignBriefAction({ 
        campaignIdea: aiIdea,
        companyInfo: "Leads to Cash is a B2B SaaS company selling a CRM for sales lifecycle management."
    });
    if ('error' in result) {
        toast({ variant: 'destructive', title: 'Error generating brief', description: result.error });
    } else {
        form.setValue('name', result.name);
        form.setValue('description', result.description);
        form.setValue('targetAudience', result.targetAudience);
        form.setValue('keyMessages', result.keyMessages);
        form.setValue('goals', result.goals);
        toast({ title: 'Campaign Brief Generated', description: 'The campaign details have been filled in for you.' });
    }
    setIsGenerating(false);
  };
  
  const handleLeadsImported = (importedLeads: Lead[]) => {
    const leadsToAppend = importedLeads.map(lead => ({
      name: lead.contact.name,
      email: lead.contact.email,
      company: lead.company,
    }));
    append(leadsToAppend);
    toast({
      title: 'Leads Added',
      description: `${importedLeads.length} leads have been added to the list.`,
    });
  };

  const onSubmit = (values: CampaignFormValues) => {
    const campaignId = `campaign-${Date.now()}`;
    const newCampaign: Campaign = {
      id: campaignId,
      name: values.name,
      type: values.type,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      budget: values.budget,
      description: values.description || '',
      targetAudience: values.targetAudience || '',
      keyMessages: values.keyMessages || '',
      goals: values.goals || '',
    };
    
    const newLeads: Lead[] = (values.leads || []).filter(l => l.name && l.email).map(lead => ({
      id: `lead-${Date.now()}-${Math.random()}`,
      title: `Lead from ${values.name}`,
      company: lead.company || 'N/A',
      value: 0,
      currency: 'USD',
      ownerId: 'user-1', // Default owner, can be changed later
      campaignId: campaignId,
      contact: {
        name: lead.name,
        email: lead.email,
        phone: '',
        title: 'N/A',
      },
      columnId: 'col-1',
      score: 50,
      priority: 'Medium',
      stage: 'Lead',
      status: 'Unaware',
      statusHistory: [],
      entryDate: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      nextAction: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: values.type,
      companySize: '11-50',
      industry: 'N/A',
      region: 'N/A',
      followUpCadence: [],
    }));

    onCampaignAdded(newCampaign, newLeads);
    toast({
      title: 'Campaign Created',
      description: `${newCampaign.name} with ${newLeads.length} leads has been successfully created.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new campaign and add leads from an event.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <Form {...form}>
            <form id="add-campaign-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className='border rounded-lg p-4 space-y-2'>
                  <Label htmlFor='ai-idea'>Generate Brief with AI</Label>
                  <div className='flex gap-2'>
                      <Input id='ai-idea' placeholder='e.g., A webinar about Q3 product updates' value={aiIdea} onChange={(e) => setAiIdea(e.target.value)} />
                      <Button type='button' onClick={handleGenerateBrief} disabled={isGenerating}>
                          {isGenerating ? <Loader2 className='animate-spin' /> : <Wand2 />}
                          Generate
                      </Button>
                  </div>
                  {!form.formState.isDirty && (
                      <Alert>
                          <AlertTitle>How it works</AlertTitle>
                          <AlertDescription>
                              Type a simple idea for a campaign and let AI generate a full brief, including target audience, key messages, and goals.
                          </AlertDescription>
                      </Alert>
                  )}
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                  <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              <SelectItem value="Conference">Conference</SelectItem>
                              <SelectItem value="Webinar">Webinar</SelectItem>
                              <SelectItem value="Trade Show">Trade Show</SelectItem>
                              <SelectItem value="Digital">Digital</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                          <FormItem className='flex flex-col'>
                              <FormLabel>Start Date</FormLabel>
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
                      name="endDate"
                      render={({ field }) => (
                          <FormItem className='flex flex-col'>
                              <FormLabel>End Date</FormLabel>
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
              </div>
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyMessages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Messages</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <Card>
                <CardHeader>
                    <CardTitle>Add Leads from Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start">
                            <FormField
                                control={form.control}
                                name={`leads.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        {index === 0 && <FormLabel>Name</FormLabel>}
                                        <FormControl>
                                            <Input {...field} placeholder="John Doe" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`leads.${index}.email`}
                                render={({ field }) => (
                                    <FormItem>
                                        {index === 0 && <FormLabel>Email</FormLabel>}
                                        <FormControl>
                                            <Input {...field} placeholder="john.d@company.com" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`leads.${index}.company`}
                                render={({ field }) => (
                                    <FormItem>
                                        {index === 0 && <FormLabel>Company</FormLabel>}
                                        <FormControl>
                                            <Input {...field} placeholder="Company Inc." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={cn(index === 0 ? "mt-8" : "")}
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <div className='flex gap-2'>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ name: '', email: '', company: '' })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Lead Manually
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsBulkImportOpen(true)}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Import Leads from File
                        </Button>
                    </div>
                </CardContent>
              </Card>

            </form>
          </Form>
        </div>

        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="add-campaign-form">Create Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <BulkImportDialog
        isOpen={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onLeadsImported={handleLeadsImported}
        users={users}
    />
    </>
  );
}
