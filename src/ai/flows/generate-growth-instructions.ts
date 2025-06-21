// src/ai/flows/generate-growth-instructions.ts
'use server';

/**
 * @fileOverview Generates step-by-step instructions on how to grow a specific fruit or vegetable.
 *
 * - generateGrowthInstructions - A function that generates growth instructions.
 * - GenerateGrowthInstructionsInput - The input type for the generateGrowthInstructions function.
 * - GenerateGrowthInstructionsOutput - The return type for the generateGrowthInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGrowthInstructionsInputSchema = z.object({
  produceName: z.string().describe('The name of the fruit or vegetable to generate growing instructions for.'),
});
export type GenerateGrowthInstructionsInput = z.infer<typeof GenerateGrowthInstructionsInputSchema>;

const GenerateGrowthInstructionsOutputSchema = z.object({
  growthInstructions: z.string().describe('Step-by-step instructions on how to grow the specified fruit or vegetable.'),
});
export type GenerateGrowthInstructionsOutput = z.infer<typeof GenerateGrowthInstructionsOutputSchema>;

export async function generateGrowthInstructions(input: GenerateGrowthInstructionsInput): Promise<GenerateGrowthInstructionsOutput> {
  return generateGrowthInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGrowthInstructionsPrompt',
  input: {schema: GenerateGrowthInstructionsInputSchema},
  output: {schema: GenerateGrowthInstructionsOutputSchema},
  prompt: `You are an expert agriculturalist. Generate step-by-step instructions on how to grow the following fruit or vegetable:

{{{produceName}}}

Instructions:`,
});

const generateGrowthInstructionsFlow = ai.defineFlow(
  {
    name: 'generateGrowthInstructionsFlow',
    inputSchema: GenerateGrowthInstructionsInputSchema,
    outputSchema: GenerateGrowthInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
