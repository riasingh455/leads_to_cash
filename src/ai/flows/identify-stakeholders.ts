'use server';

/**
 * @fileOverview An AI agent to identify key decision-makers and stakeholders within a prospect organization.
 *
 * - identifyStakeholders - A function that handles the stakeholder identification process.
 * - IdentifyStakeholdersInput - The input type for the identifyStakeholders function.
 * - IdentifyStakeholdersOutput - The return type for the identifyStakeholders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyStakeholdersInputSchema = z.object({
  companyDescription: z
    .string()
    .describe('A detailed description of the prospect company, including its industry, size, and business model.'),
  objective: z.string().describe('The specific objective of the sales outreach.'),
});

export type IdentifyStakeholdersInput = z.infer<typeof IdentifyStakeholdersInputSchema>;

const IdentifyStakeholdersOutputSchema = z.object({
  stakeholders: z.array(
    z.object({
      name: z.string().describe('The name of the stakeholder.'),
      title: z.string().describe('The job title of the stakeholder.'),
      role: z
        .string()
        .describe(
          'The role of the stakeholder in the decision-making process. Possible values include: Decision Maker, Influencer, Approver, Gatekeeper, User.'
        ),
      influenceLevel: z
        .string()
        .describe(
          'The level of influence the stakeholder has in the decision-making process. Possible values include: High, Medium, Low.'
        ),
      contactInformation: z.string().optional().describe('Available contact information for the stakeholder, such as email address or phone number.'),
      reason: z
        .string()
        .describe('The reason why this person is considered a key stakeholder for the specified objective.'),
    })
  ).describe('A list of key stakeholders within the prospect organization.'),
});

export type IdentifyStakeholdersOutput = z.infer<typeof IdentifyStakeholdersOutputSchema>;

export async function identifyStakeholders(input: IdentifyStakeholdersInput): Promise<IdentifyStakeholdersOutput> {
  return identifyStakeholdersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyStakeholdersPrompt',
  input: {schema: IdentifyStakeholdersInputSchema},
  output: {schema: IdentifyStakeholdersOutputSchema},
  prompt: `You are an AI assistant helping sales representatives identify key stakeholders within prospect organizations.

  Based on the provided company description and the specific objective of the sales outreach, identify the key decision-makers and stakeholders within the organization.

  Company Description: {{{companyDescription}}}
  Objective: {{{objective}}}

  Identify the name, title, role, influence level, contact information (if available) and a brief reason for each stakeholder.

  Ensure that the response is well-structured and easy to understand. Focus on identifying individuals who can significantly impact the success of the sales outreach.
  Return a single JSON array of stakeholders.`,
});

const identifyStakeholdersFlow = ai.defineFlow(
  {
    name: 'identifyStakeholdersFlow',
    inputSchema: IdentifyStakeholdersInputSchema,
    outputSchema: IdentifyStakeholdersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
