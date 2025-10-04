'use server';
/**
 * @fileOverview Summarizes study metadata from the OSDR API.
 *
 * - summarizeStudyMetadata - A function that summarizes the study metadata.
 * - SummarizeStudyMetadataInput - The input type for the summarizeStudyMetadata function.
 * - SummarizeStudyMetadataOutput - The return type for the summarizeStudyMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudyMetadataInputSchema = z.object({
  studyId: z.string().describe('The study ID to summarize.'),
});
export type SummarizeStudyMetadataInput = z.infer<typeof SummarizeStudyMetadataInputSchema>;

const SummarizeStudyMetadataOutputSchema = z.object({
  summary: z.string().describe('A summary of the study metadata.'),
});
export type SummarizeStudyMetadataOutput = z.infer<typeof SummarizeStudyMetadataOutputSchema>;

export async function summarizeStudyMetadata(input: SummarizeStudyMetadataInput): Promise<SummarizeStudyMetadataOutput> {
  return summarizeStudyMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStudyMetadataPrompt',
  input: {schema: SummarizeStudyMetadataInputSchema},
  output: {schema: SummarizeStudyMetadataOutputSchema},
  prompt: `You are an expert in summarizing scientific study metadata.

  Given the study ID, fetch the study metadata from the NASA Open Science Data Repository (OSDR) API and provide a concise summary of the study, focusing on the key findings, objectives, and methodology.

  Study ID: {{{studyId}}}
  `, 
});

const summarizeStudyMetadataFlow = ai.defineFlow(
  {
    name: 'summarizeStudyMetadataFlow',
    inputSchema: SummarizeStudyMetadataInputSchema,
    outputSchema: SummarizeStudyMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
