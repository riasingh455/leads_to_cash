'use server';

/**
 * @fileOverview Provides AI-driven recommendations for the next best action or approach based on lead engagement patterns.
 *
 * - recommendNextSteps - A function that handles the recommendation process.
 * - RecommendNextStepsInput - The input type for the recommendNextSteps function.
 * - RecommendNextStepsOutput - The return type for the recommendNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNextStepsInputSchema = z.object({
  leadEngagementPatterns: z.string().describe('The engagement patterns of the lead, including communication history, interactions, and responses.'),
  successfulStrategies: z.string().describe('Successful strategies used by other users with similar leads.'),
  leadDetails: z.string().describe('Details about the lead, including their industry, company size, and geography.'),
});
export type RecommendNextStepsInput = z.infer<typeof RecommendNextStepsInputSchema>;

const RecommendNextStepsOutputSchema = z.object({
  recommendedNextStep: z.string().describe('The AI-driven recommendation for the next best action or approach.'),
  rationale: z.string().describe('The rationale behind the recommendation, explaining why it is the most suitable option.'),
});
export type RecommendNextStepsOutput = z.infer<typeof RecommendNextStepsOutputSchema>;

export async function recommendNextSteps(input: RecommendNextStepsInput): Promise<RecommendNextStepsOutput> {
  return recommendNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNextStepsPrompt',
  input: {schema: RecommendNextStepsInputSchema},
  output: {schema: RecommendNextStepsOutputSchema},
  prompt: `You are an AI-powered sales assistant that provides recommendations for the next best action or approach based on lead engagement patterns and successful strategies of other users.

  Lead Details: {{{leadDetails}}}
  Lead Engagement Patterns: {{{leadEngagementPatterns}}}
  Successful Strategies: {{{successfulStrategies}}}

  Based on the lead engagement patterns and successful strategies of other users, provide a recommendation for the next best action or approach. Also, provide a rationale behind the recommendation, explaining why it is the most suitable option.
  `,
});

const recommendNextStepsFlow = ai.defineFlow(
  {
    name: 'recommendNextStepsFlow',
    inputSchema: RecommendNextStepsInputSchema,
    outputSchema: RecommendNextStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
