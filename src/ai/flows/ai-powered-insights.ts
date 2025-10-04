'use server';

/**
 * @fileOverview An AI-powered insights engine for space biology, leveraging NASA OSDR data.
 *
 * - generateInsight - A function that generates insights based on user questions about space biology.
 * - AIPoweredInsightsInput - The input type for the generateInsight function.
 * - AIPoweredInsightsOutput - The return type for the generateInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredInsightsInputSchema = z.object({
  question: z.string().describe('The user question about space biology.'),
});
export type AIPoweredInsightsInput = z.infer<typeof AIPoweredInsightsInputSchema>;

const AIPoweredInsightsOutputSchema = z.object({
  insight: z.string().describe('The AI-generated insight based on the question and OSDR data.'),
});
export type AIPoweredInsightsOutput = z.infer<typeof AIPoweredInsightsOutputSchema>;

export async function generateInsight(input: AIPoweredInsightsInput): Promise<AIPoweredInsightsOutput> {
  return aiPoweredInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredInsightsPrompt',
  input: {schema: AIPoweredInsightsInputSchema},
  output: {schema: AIPoweredInsightsOutputSchema},
  prompt: `You are a space biology expert. Use the NASA OSDR data to answer the user's question.

  Question: {{{question}}}
  
  Provide a comprehensive answer, linking related experiments, payloads, vehicles, people, and missions where available.
  Ensure the insight is accurate and informative.
  
  If the question cannot be answered using OSDR data, respond appropriately.
  `,
});

const aiPoweredInsightsFlow = ai.defineFlow(
  {
    name: 'aiPoweredInsightsFlow',
    inputSchema: AIPoweredInsightsInputSchema,
    outputSchema: AIPoweredInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
