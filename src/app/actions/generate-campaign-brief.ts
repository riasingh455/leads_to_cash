'use server';

import { generateCampaignBrief, type GenerateCampaignBriefInput, type GenerateCampaignBriefOutput } from '@/ai/flows/generate-campaign-brief';

export async function generateCampaignBriefAction(values: GenerateCampaignBriefInput): Promise<GenerateCampaignBriefOutput | { error: string }> {
  try {
    const result = await generateCampaignBrief(values);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate campaign brief. Please try again.' };
  }
}
