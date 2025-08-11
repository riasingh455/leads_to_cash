'use server';

import { identifyStakeholders, type IdentifyStakeholdersInput, type IdentifyStakeholdersOutput } from '@/ai/flows/identify-stakeholders';

export async function identifyStakeholdersAction(values: IdentifyStakeholdersInput): Promise<IdentifyStakeholdersOutput | { error: string }> {
  try {
    const result = await identifyStakeholders(values);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to identify stakeholders. Please try again.' };
  }
}
