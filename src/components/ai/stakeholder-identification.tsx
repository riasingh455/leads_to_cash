'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type IdentifyStakeholdersOutput } from '@/ai/flows/identify-stakeholders';
import type { Lead } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Briefcase, Star, Info, Mail } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { identifyStakeholdersAction } from '@/app/actions/identify-stakeholders';

const formSchema = z.object({
  companyDescription: z.string().min(20, 'Please provide a more detailed company description.'),
  objective: z.string().min(10, 'Please provide a more specific objective.'),
});

type FormValues = z.infer<typeof formSchema>;

export function StakeholderIdentification({ lead }: { lead: Lead }) {
  const [result, setResult] = useState<IdentifyStakeholdersOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyDescription: `Company: ${lead.company}\nIndustry: ${lead.industry}\nRegion: ${lead.region}\nSource: ${lead.source}`,
      objective: `Secure a deal for "${lead.title}" with an estimated value of $${lead.value.toLocaleString()}.`,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    const response = await identifyStakeholdersAction(values);

    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: response.error,
      });
    } else {
      setResult(response);
    }
    setIsLoading(false);
  };
  
  const getInfluenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
      <Card>
        <CardHeader>
          <CardTitle>Identify Stakeholders</CardTitle>
          <CardDescription>Use AI to find key decision-makers in the prospect organization.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the prospect company..." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objective</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is your goal with this outreach?" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <div className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyzing... this may take a moment.</p>
            </div>
          </div>
        )}
        
        {result ? (
          <div className="space-y-4">
            {result.stakeholders.map((stakeholder, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" /> {stakeholder.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Briefcase className="w-4 h-4" /> {stakeholder.title}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${getInfluenceColor(stakeholder.influenceLevel)}`}></div>
                      {stakeholder.influenceLevel} Influence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2"><Star className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" /> <strong>Role:</strong> {stakeholder.role}</p>
                    <p className="text-sm text-muted-foreground flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" /> {stakeholder.reason}</p>
                    {stakeholder.contactInformation && (
                      <p className="text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> {stakeholder.contactInformation}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !isLoading && (
            <Alert>
              <AlertTitle>Results will appear here</AlertTitle>
              <AlertDescription>
                Fill out the form and click "Analyze" to identify key stakeholders. The AI will provide a list of individuals, their roles, and why they are important for this opportunity.
              </AlertDescription>
            </Alert>
          )
        )}
      </div>
    </div>
  );
}
