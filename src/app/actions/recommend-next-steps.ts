'use server';

import { recommendNextSteps, type RecommendNextStepsInput, type RecommendNextStepsOutput } from "@/ai/flows/recommend-next-steps";

export async function recommendNextStepsAction(values: RecommendNextStepsInput): Promise<RecommendNextStepsOutput | { error: string }> {
  try {
    return await recommendNextSteps(values);
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get recommendation. Please try again.' };
  }
}
