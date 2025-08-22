'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/identify-stakeholders.ts';
import '@/ai/flows/generate-campaign-brief.ts';
