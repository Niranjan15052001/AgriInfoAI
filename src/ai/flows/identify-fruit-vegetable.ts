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
    seedAcquisition: z.string().describe('A simple guide on how to get seeds for the plant, written in easy-to-understand language.'),
    growthConditions: z.string().describe('A friendly description of the best conditions (like sun, soil, and water) for growing the plant.'),
    growthProcess: z.string().describe('An easy-to-follow, step-by-step guide on how to grow the plant from start to finish.'),
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
  prompt: `You are a friendly and helpful gardening expert who loves making gardening accessible to everyone. Your tone should be encouraging and simple.

Identify the fruit or vegetable in the image. Then, using simple, everyday language, provide the following information:

1.  **Seed Acquisition**: Explain how someone can get seeds for this plant. For example, can they be bought online, at a local store, or harvested from the fruit itself?
2.  **Growth Conditions**: Describe the best conditions for this plant to grow well. Think about sunlight, what kind of soil it likes, and how much water it needs. Explain it like you're talking to a beginner gardener.
3.  **Growth Process**: Give a clear, step-by-step guide on how to grow this plant. Break it down into easy stages, from planting the seed to when it's ready to eat.

Your goal is to make the user feel excited and confident that they can grow this themselves. Avoid technical jargon.

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
