'use server';

/**
 * @fileOverview An AI agent to generate a detailed campaign brief from a simple idea.
 *
 * - generateCampaignBrief - A function that handles the campaign brief generation.
 * - GenerateCampaignBriefInput - The input type for the generateCampaignBrief function.
 * - GenerateCampaignBriefOutput - The return type for the generateCampaignBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignBriefInputSchema = z.object({
  campaignIdea: z.string().describe('A short description of the campaign idea, including the name and type if known.'),
  companyInfo: z.string().describe('Brief information about the company running the campaign.'),
});

export type GenerateCampaignBriefInput = z.infer<typeof GenerateCampaignBriefInputSchema>;

const GenerateCampaignBriefOutputSchema = z.object({
  name: z.string().describe('A catchy and descriptive name for the campaign.'),
  description: z.string().describe('A one-paragraph summary of the campaign.'),
  targetAudience: z.string().describe('A detailed description of the target audience for this campaign.'),
  keyMessages: z.string().describe('The main messages and value propositions to communicate during the campaign.'),
  goals: z.string().describe('The primary goals and objectives of the campaign, including measurable KPIs.'),
});

export type GenerateCampaignBriefOutput = z.infer<typeof GenerateCampaignBriefOutputSchema>;

export async function generateCampaignBrief(input: GenerateCampaignBriefInput): Promise<GenerateCampaignBriefOutput> {
  return generateCampaignBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignBriefPrompt',
  input: {schema: GenerateCampaignBriefInputSchema},
  output: {schema: GenerateCampaignBriefOutputSchema},
  prompt: `You are an expert marketing strategist. Your task is to take a simple campaign idea and expand it into a comprehensive campaign brief.

Company Information: {{{companyInfo}}}
Campaign Idea: {{{campaignIdea}}}

Based on the provided information, generate a detailed campaign brief covering the following aspects:
- A compelling campaign name.
- A concise and engaging description of the campaign.
- A clear definition of the target audience.
- The key messages that should be conveyed.
- Specific, measurable, achievable, relevant, and time-bound (SMART) goals for the campaign.

Ensure the output is creative, strategic, and ready to be used by a marketing team to execute the campaign.`,
});

const generateCampaignBriefFlow = ai.defineFlow(
  {
    name: 'generateCampaignBriefFlow',
    inputSchema: GenerateCampaignBriefInputSchema,
    outputSchema: GenerateCampaignBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
