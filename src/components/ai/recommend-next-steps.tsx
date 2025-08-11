'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type RecommendNextStepsOutput } from '@/ai/flows/recommend-next-steps';
import type { Lead } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Lightbulb, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { format } from 'date-fns';
import { recommendNextStepsAction } from '@/app/actions/recommend-next-steps';

const formSchema = z.object({
  leadEngagementPatterns: z.string().min(10, 'Please describe engagement patterns.'),
  successfulStrategies: z.string().min(10, 'Please describe successful strategies.'),
  leadDetails: z.string().min(10, 'Please provide lead details.'),
});

type FormValues = z.infer<typeof formSchema>;

export function RecommendedNextSteps({ lead }: { lead: Lead }) {
  const [result, setResult] = useState<RecommendNextStepsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadDetails: `Lead: ${lead.contact.name} from ${lead.company} (${lead.industry}, ${lead.region}).\nDeal: ${lead.title} ($${lead.value.toLocaleString()}).\nScore: ${lead.score}, Priority: ${lead.priority}.`,
      leadEngagementPatterns: `Last contact was on ${format(new Date(lead.lastContact), 'PPP')}. Next action scheduled for ${format(new Date(lead.nextAction), 'PPP')}. Source was ${lead.source}.`,
      successfulStrategies: `For leads in the ${lead.industry} sector, a common successful strategy involves sending a detailed case study followed by a demo call. For deals over $50,000, involving a technical specialist early has proven effective.`,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    const response = await recommendNextStepsAction(values);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
      <Card>
        <CardHeader>
          <CardTitle>Recommend Next Steps</CardTitle>
          <CardDescription>Get AI-powered advice on the best next action for this lead.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="leadDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Details</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadEngagementPatterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Engagement Patterns</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="successfulStrategies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Successful Strategies (for context)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Wand2 className="mr-2 h-4 w-4" />
                Get Recommendation
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
              <p className="mt-4 text-muted-foreground">Generating recommendation...</p>
            </div>
          </div>
        )}
        
        {result ? (
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-500"/>Recommended Next Step</h3>
                <p className="p-4 bg-background rounded-md border">{result.recommendedNextStep}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rationale</h3>
                <p className="text-muted-foreground">{result.rationale}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          !isLoading && (
            <Alert>
              <AlertTitle>Your recommendation will appear here</AlertTitle>
              <AlertDescription>
                Provide context about the lead and successful strategies, then click "Get Recommendation" to receive AI-driven advice on your next move.
              </AlertDescription>
            </Alert>
          )
        )}
      </div>
    </div>
  );
}
