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
  language: z.enum(['en', 'hi']).describe('The language for the output. Can be "en" for English or "hi" for Hindi.'),
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

Identify the fruit or vegetable in the image. Then, provide the requested information in the language specified by the language code '{{language}}'. 'en' is for English, and 'hi' is for Hindi.

The entire response, including the common name and all descriptions, must be in the requested language.

- **commonName**: The common name of the identified fruit or vegetable, in the requested language.
- **seedAcquisition**: A simple guide on how to get seeds for this plant. Explain if they can be bought online, at a local store, or harvested from the fruit itself.
- **growthConditions**: A friendly description of the best conditions (like sun, soil, and water) for growing this plant. Explain it like you're talking to a beginner gardener.
- **growthProcess**: An easy-to-follow, step-by-step guide on how to grow this plant, from planting the seed to when it's ready to eat.

Your goal is to make the user feel excited and confident that they can grow this themselves. Avoid technical jargon.

Photo: {{media url=photoDataUri}}
Language: {{language}}
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
