// src/ai/flows/identify-fruit-vegetable.ts
'use server';

/**
 * @fileOverview Identifies a fruit or vegetable from an image and provides information about it.
 *
 * - identifyFruitVegetable - A function that handles the identification process.
 * - IdentifyFruitVegetableInput - The input type for the identifyFruitVegetable function.
 * - IdentifyFruitVegetableOutput - The return type for the identifyFruitVegetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFruitVegetableInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a fruit or vegetable, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFruitVegetableInput = z.infer<typeof IdentifyFruitVegetableInputSchema>;

const IdentifyFruitVegetableOutputSchema = z.object({
  identification: z.object({
    commonName: z.string().describe('The common name of the identified fruit or vegetable.'),
    seedAcquisition: z.string().describe('Information about how to get the seeds of the identified fruit or vegetable.'),
    growthConditions: z.string().describe('Suitable conditions to grow the identified fruit or vegetable.'),
    growthProcess: z.string().describe('Step-by-step process to grow the identified fruit or vegetable.'),
  }),
});
export type IdentifyFruitVegetableOutput = z.infer<typeof IdentifyFruitVegetableOutputSchema>;

export async function identifyFruitVegetable(input: IdentifyFruitVegetableInput): Promise<IdentifyFruitVegetableOutput> {
  return identifyFruitVegetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFruitVegetablePrompt',
  input: {schema: IdentifyFruitVegetableInputSchema},
  output: {schema: IdentifyFruitVegetableOutputSchema},
  prompt: `You are an expert in identifying fruits and vegetables from images and providing information about them.

  Identify the fruit or vegetable in the image. Then, provide information about how to get its seeds, suitable conditions to grow it, and a step-by-step process to grow it.

  Photo: {{media url=photoDataUri}}
  `,
});

const identifyFruitVegetableFlow = ai.defineFlow(
  {
    name: 'identifyFruitVegetableFlow',
    inputSchema: IdentifyFruitVegetableInputSchema,
    outputSchema: IdentifyFruitVegetableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
