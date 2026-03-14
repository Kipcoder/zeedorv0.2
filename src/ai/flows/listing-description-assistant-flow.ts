'use server';
/**
 * @fileOverview An AI assistant for generating or enhancing listing descriptions for the Zeedor marketplace.
 *
 * - generateListingDescription - A function that generates or enhances a listing description.
 * - GenerateListingDescriptionInput - The input type for the generateListingDescription function.
 * - GenerateListingDescriptionOutput - The return type for the generateListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDescriptionInputSchema = z.object({
  category: z
    .string()
    .describe('The category of the listing (e.g., Coaches, Venues, Equipment).'),
  title: z.string().describe('The title of the listing.'),
  keyFeatures: z
    .string()
    .describe('Comma-separated key features or highlights of the listing.'),
  targetAudience: z
    .string()
    .describe('The primary target audience for this listing.'),
  location: z
    .string()
    .optional()
    .describe('The location relevant to the listing, if applicable.'),
  existingDescription: z
    .string()
    .optional()
    .describe(
      'An optional existing description to be enhanced. If provided, the AI should refine this text.'
    ),
});
export type GenerateListingDescriptionInput = z.infer<
  typeof GenerateListingDescriptionInputSchema
>;

const GenerateListingDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated or enhanced listing description.'),
});
export type GenerateListingDescriptionOutput = z.infer<
  typeof GenerateListingDescriptionOutputSchema
>;

export async function generateListingDescription(
  input: GenerateListingDescriptionInput
): Promise<GenerateListingDescriptionOutput> {
  return generateListingDescriptionFlow(input);
}

const generateListingDescriptionPrompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: {schema: GenerateListingDescriptionInputSchema},
  output: {schema: GenerateListingDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in writing compelling and professional listing descriptions for a sports marketplace called "Zeedor". Your goal is to create an engaging description based on the provided details.

Here are the details for the listing:

Category: {{{category}}}
Title: {{{title}}}

{{#if existingDescription}}
The user provided an existing description that needs enhancement:
Existing Description: {{{existingDescription}}}
{{else}}
The user provided key details for a new description.
{{/if}}

Key Features: {{{keyFeatures}}}
Target Audience: {{{targetAudience}}}
{{#if location}}
Location: {{{location}}}
{{#if location}}
Location: {{{location}}}
{{/if}}

Please generate a detailed, compelling, and professional listing description. If an existing description was provided, enhance it significantly using the new details, making it more engaging and persuasive. The description should be at least 150 words and highlight the unique selling points. Focus on attracting the specified target audience.`,
});

const generateListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: GenerateListingDescriptionInputSchema,
    outputSchema: GenerateListingDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateListingDescriptionPrompt(input);
    return output!;
  }
);
