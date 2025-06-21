// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates the optimal growth conditions for a given fruit or vegetable.
 *
 * - generateOptimalGrowthConditions - A function that generates optimal growth conditions.
 * - GenerateOptimalGrowthConditionsInput - The input type for the generateOptimalGrowthConditions function.
 * - GenerateOptimalGrowthConditionsOutput - The return type for the generateOptimalGrowthConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimalGrowthConditionsInputSchema = z.object({
  produceName: z.string().describe('The name of the fruit or vegetable.'),
});
export type GenerateOptimalGrowthConditionsInput = z.infer<typeof GenerateOptimalGrowthConditionsInputSchema>;

const GenerateOptimalGrowthConditionsOutputSchema = z.object({
  sunlight: z.string().describe('The optimal amount of sunlight required.'),
  soil: z.string().describe('The optimal soil conditions required.'),
  watering: z.string().describe('The optimal watering schedule.'),
  temperature: z.string().describe('The optimal temperature range.'),
});
export type GenerateOptimalGrowthConditionsOutput = z.infer<typeof GenerateOptimalGrowthConditionsOutputSchema>;

export async function generateOptimalGrowthConditions(
  input: GenerateOptimalGrowthConditionsInput
): Promise<GenerateOptimalGrowthConditionsOutput> {
  return generateOptimalGrowthConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOptimalGrowthConditionsPrompt',
  input: {schema: GenerateOptimalGrowthConditionsInputSchema},
  output: {schema: GenerateOptimalGrowthConditionsOutputSchema},
  prompt: `You are an expert agriculturalist.

  Provide the optimal growth conditions for the following produce:

  Produce: {{{produceName}}}
  `,
});

const generateOptimalGrowthConditionsFlow = ai.defineFlow(
  {
    name: 'generateOptimalGrowthConditionsFlow',
    inputSchema: GenerateOptimalGrowthConditionsInputSchema,
    outputSchema: GenerateOptimalGrowthConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
