'use server';
/**
 * @fileOverview A Genkit flow for parsing natural language queries into a structured search format.
 *
 * - naturalLanguageSearch - A function that handles natural language search queries.
 * - NaturalLanguageSearchInput - The input type for the naturalLanguageSearch function.
 * - NaturalLanguageSearchOutput - The return type for the naturalLanguageSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ZeedorCategories = z.enum([
  'Coaches',
  'Venues',
  'Equipment',
  'Events',
  'Teams',
  'Training Programs',
  'Fitness Trainers',
  'Physiotherapists',
  'Nutritionists',
  'Sports Transport',
  'Accommodation',
  'Repairs',
]);

const NaturalLanguageSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The natural language search query from the user.'),
});
export type NaturalLanguageSearchInput = z.infer<
  typeof NaturalLanguageSearchInputSchema
>;

const NaturalLanguageSearchOutputSchema = z.object({
  categories: z
    .array(ZeedorCategories)
    .describe(
      'An array of identified Zeedor categories relevant to the query.'
    ),
  location: z
    .string()
    .optional()
    .describe('The geographical location mentioned in the query.'),
  sport: z
    .string()
    .optional()
    .describe('The specific sport identified in the query (e.g., "soccer").'),
  ageGroup: z
    .string()
    .optional()
    .describe(
      'The target age group or age mentioned in the query (e.g., "10-year-old", "adults").'
    ),
  availability: z
    .string()
    .optional()
    .describe(
      'The availability preference mentioned in the query (e.g., "weekends", "evenings").'
    ),
  keywords: z
    .array(z.string())
    .optional()
    .describe(
      'Additional keywords or search terms not covered by other fields.'
    ),
});
export type NaturalLanguageSearchOutput = z.infer<
  typeof NaturalLanguageSearchOutputSchema
>;

export async function naturalLanguageSearch(
  input: NaturalLanguageSearchInput
): Promise<NaturalLanguageSearchOutput> {
  return naturalLanguageSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageSearchPrompt',
  input: { schema: NaturalLanguageSearchInputSchema },
  output: { schema: NaturalLanguageSearchOutputSchema },
  prompt: `You are an AI assistant designed to parse natural language queries for sports services on the Zeedor marketplace.
Your task is to extract relevant information from the user's query and categorize it into a structured JSON object.

Here are the available Zeedor categories:
- Coaches
- Venues
- Equipment
- Events
- Teams
- Training Programs
- Fitness Trainers
- Physiotherapists
- Nutritionists
- Sports Transport
- Accommodation
- Repairs

Prioritize identifying categories first. If multiple categories are implied, list all of them. If no specific category is mentioned, try to infer the most likely one based on context. If no category can be inferred, return an empty array for categories.

Extract the following details:
- 'categories': An array of one or more identified Zeedor categories. Must be from the list above.
- 'location': The geographical location mentioned.
- 'sport': The specific sport.
- 'ageGroup': The target age group.
- 'availability': Mentioned availability.
- 'keywords': Any other relevant terms.`,
});

const naturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSearchFlow',
    inputSchema: NaturalLanguageSearchInputSchema,
    outputSchema: NaturalLanguageSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
