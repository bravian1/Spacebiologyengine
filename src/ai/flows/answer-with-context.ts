'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions with context from the NASA OSDR.
 *
 * It includes:
 * - answerWithContext - A function to answer user questions with context from the NASA OSDR.
 * - AnswerWithContextInput - The input type for the answerWithContext function.
 * - AnswerWithContextOutput - The output type for the answerWithContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerWithContextInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  relevantData: z.string().describe('Relevant data from the NASA OSDR.'),
});
export type AnswerWithContextInput = z.infer<typeof AnswerWithContextInputSchema>;

const AnswerWithContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, with context.'),
});
export type AnswerWithContextOutput = z.infer<typeof AnswerWithContextOutputSchema>;

export async function answerWithContext(input: AnswerWithContextInput): Promise<AnswerWithContextOutput> {
  return answerWithContextFlow(input);
}

const answerWithContextPrompt = ai.definePrompt({
  name: 'answerWithContextPrompt',
  input: {schema: AnswerWithContextInputSchema},
  output: {schema: AnswerWithContextOutputSchema},
  prompt: `You are a space biology knowledge engine. Use the following data from the NASA OSDR to answer the user's question. Provide context and explain how you derived the answer from the data.

Question: {{{question}}}

Data: {{{relevantData}}}

Answer: `,
});

const answerWithContextFlow = ai.defineFlow(
  {
    name: 'answerWithContextFlow',
    inputSchema: AnswerWithContextInputSchema,
    outputSchema: AnswerWithContextOutputSchema,
  },
  async input => {
    const {output} = await answerWithContextPrompt(input);
    return output!;
  }
);
