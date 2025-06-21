// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates information about how to acquire seeds for a specific fruit or vegetable.
 *
 * - generateSeedAcquisitionInfo - A function that generates seed acquisition information.
 * - GenerateSeedAcquisitionInfoInput - The input type for the generateSeedAcquisitionInfo function.
 * - GenerateSeedAcquisitionInfoOutput - The return type for the generateSeedAcquisitionInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeedAcquisitionInfoInputSchema = z.object({
  fruitOrVegetable: z
    .string()
    .describe('The name of the fruit or vegetable to get seed acquisition information for.'),
});

export type GenerateSeedAcquisitionInfoInput = z.infer<
  typeof GenerateSeedAcquisitionInfoInputSchema
>;

const GenerateSeedAcquisitionInfoOutputSchema = z.object({
  seedAcquisitionInfo: z
    .string()
    .describe('Information about how to acquire seeds for the specified fruit or vegetable.'),
});

export type GenerateSeedAcquisitionInfoOutput = z.infer<
  typeof GenerateSeedAcquisitionInfoOutputSchema
>;

export async function generateSeedAcquisitionInfo(
  input: GenerateSeedAcquisitionInfoInput
): Promise<GenerateSeedAcquisitionInfoOutput> {
  return generateSeedAcquisitionInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeedAcquisitionInfoPrompt',
  input: {schema: GenerateSeedAcquisitionInfoInputSchema},
  output: {schema: GenerateSeedAcquisitionInfoOutputSchema},
  prompt: `You are an expert in agriculture and horticulture. A user wants to grow their own
{{fruitOrVegetable}} and needs information on how to acquire the seeds to grow it.

Provide detailed information on how to acquire seeds for {{fruitOrVegetable}}. Include information
about where to buy seeds, how to harvest seeds from existing plants, and any other relevant
information.`,
});

const generateSeedAcquisitionInfoFlow = ai.defineFlow(
  {
    name: 'generateSeedAcquisitionInfoFlow',
    inputSchema: GenerateSeedAcquisitionInfoInputSchema,
    outputSchema: GenerateSeedAcquisitionInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
