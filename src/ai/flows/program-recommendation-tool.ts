'use server';
/**
 * @fileOverview An AI tool to provide personalized program recommendations based on academic interests and background.
 *
 * - programRecommendation - A function that handles the program recommendation process.
 * - ProgramRecommendationInput - The input type for the programRecommendation function.
 * - ProgramRecommendationOutput - The return type for the programRecommendation function.
 */

import { ai } from '../genkit-instance';
import { z } from 'genkit';

const ProgramRecommendationInputSchema = z.object({
  academicInterests: z
    .string()
    .describe('Description of the prospective student\'s academic interests.'),
  academicHistory: z
    .string()
    .describe('Summary of the prospective student\'s academic background and qualifications.'),
});

export type ProgramRecommendationInput = z.infer<typeof ProgramRecommendationInputSchema>;

const ProgramRecommendationOutputSchema = z.object({
  recommendedPrograms: z.array(z.object({
    name: z.string().describe('The name of the recommended program.'),
    justification: z.string().describe('Why this program is a good fit for the student.'),
  })).describe('A list of recommended programs and reasons why they are a good fit.'),
});

export type ProgramRecommendationOutput = z.infer<typeof ProgramRecommendationOutputSchema>;

export async function programRecommendation(input: ProgramRecommendationInput): Promise<ProgramRecommendationOutput> {
  return programRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'programRecommendationPrompt',
  input: {schema: ProgramRecommendationInputSchema},
  output: {schema: ProgramRecommendationOutputSchema},
  prompt: `You are an expert academic advisor for G V Hallikeri PU college. A prospective student is seeking program recommendations based on their academic interests and background.

  Provide a list of recommended programs available at our college, and a short justification for each program.

  Academic Interests: {{{academicInterests}}}
  Academic History: {{{academicHistory}}}
  `,
});

const programRecommendationFlow = ai.defineFlow(
  {
    name: 'programRecommendationFlow',
    inputSchema: ProgramRecommendationInputSchema,
    outputSchema: ProgramRecommendationOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in programRecommendationFlow:', error);
      throw new Error('Failed to generate program recommendations.');
    }
  }
);
