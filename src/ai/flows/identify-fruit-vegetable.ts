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
    commonName: z.string().describe('The common name of the identified fruit or vegetable, in the requested language.'),
    seedAcquisition: z.string().describe('A simple guide on how to get seeds for the plant, written in easy-to-understand language, in the requested language.'),
    growthConditions: z.string().describe('A friendly description of the best conditions (like sun, soil, and water) for growing the plant, in the requested language.'),
    growthProcess: z.string().describe('An easy-to-follow, step-by-step guide on how to grow the plant from start to finish, in the requested language.'),
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
  prompt: `You are a friendly and helpful gardening expert. Your primary goal is to identify a fruit or vegetable and provide growing information *in the user's specified language*.

**CRITICAL**: You MUST provide the entire response in the language specified by the language code.
- 'en' means English.
- 'hi' means Hindi.

Every field in the JSON output you generate must be fully translated into the requested language.

Identify the fruit or vegetable in the image and provide the information requested in the output schema. Your tone should be simple, encouraging, and easy-to-understand. Avoid technical jargon.

Photo: {{media url=photoDataUri}}
Language Code: {{language}}
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
