'use server';
/**
 * @fileOverview A personalized listing recommendation AI agent.
 *
 * - personalizeListingRecommendations - A function that generates personalized listing recommendations.
 * - PersonalizedListingRecommendationsInput - The input type for the personalizeListingRecommendations function.
 * - PersonalizedListingRecommendationsOutput - The return type for the personalizeListingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedListingRecommendationsInputSchema = z.object({
  userProfile: z.object({
    sportsInterests: z.array(z.string()).describe('A list of sports the user is interested in (e.g., "football", "basketball", "tennis").'),
    location: z.string().describe('The geographical location of the user (e.g., "London, UK", "New York, USA").'),
    skillLevel: z.string().optional().describe('The user\'s skill level in sports (e.g., "beginner", "intermediate", "advanced").'),
    pastBookings: z.array(z.string()).optional().describe('A list of past booking categories or services the user has used.'),
  }).describe('The profile of the user requesting recommendations.'),
  searchHistory: z.array(z.string()).describe('A list of recent search queries or keywords from the user.'),
  viewedListings: z.array(z.string()).optional().describe('A list of names or IDs of listings the user has recently viewed.'),
});
export type PersonalizedListingRecommendationsInput = z.infer<typeof PersonalizedListingRecommendationsInputSchema>;

const PersonalizedListingRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      category: z.enum([
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
      ]).describe('The category of the recommended listing.'),
      name: z.string().describe('The name of the recommended listing.'),
      description: z.string().describe('A brief description of the recommended listing.'),
      relevanceScore: z.number().min(0).max(1).describe('A score indicating how relevant this recommendation is to the user, from 0.0 to 1.0.'),
    })
  ).describe('A list of personalized listing recommendations.'),
});
export type PersonalizedListingRecommendationsOutput = z.infer<typeof PersonalizedListingRecommendationsOutputSchema>;

export async function personalizeListingRecommendations(input: PersonalizedListingRecommendationsInput): Promise<PersonalizedListingRecommendationsOutput> {
  return personalizedListingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedListingRecommendationsPrompt',
  input: { schema: PersonalizedListingRecommendationsInputSchema },
  output: { schema: PersonalizedListingRecommendationsOutputSchema },
  prompt: `You are an AI-powered recommendation engine for Zeedor, a sports marketplace.
Your goal is to provide personalized recommendations for coaches, venues, equipment, events, teams, training programs, fitness trainers, physiotherapists, nutritionists, sports transport, accommodation, and repairs, based on the user's profile and recent activity.

Consider the user's sports interests, location, skill level, past bookings, search history, and viewed listings to generate highly relevant suggestions.

Provide a list of at least 3 to 5 recommendations, ensuring each recommendation includes a category, name, a brief description, and a relevance score between 0.0 and 1.0, where 1.0 is most relevant.

User Profile:
- Sports Interests: {{userProfile.sportsInterests}}
- Location: {{userProfile.location}}
{{#if userProfile.skillLevel}}
- Skill Level: {{userProfile.skillLevel}}
{{/if}}
{{#if userProfile.pastBookings}}
- Past Bookings: {{userProfile.pastBookings}}
{{/if}}

User Activity:
- Search History: {{searchHistory}}
{{#if viewedListings}}
- Viewed Listings: {{viewedListings}}
{{/if}}

Generate the recommendations in a structured JSON format as described by the output schema.`,
});

const personalizedListingRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedListingRecommendationsFlow',
    inputSchema: PersonalizedListingRecommendationsInputSchema,
    outputSchema: PersonalizedListingRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
