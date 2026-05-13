'use server';
/**
 * @fileOverview An AI tool to provide personalized program recommendations based on academic interests and background.
 *
 * - programRecommendation - A function that handles the program recommendation process.
 * - nccInformation - A function that answers common NCC admissions and training questions.
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

const NccInformationInputSchema = z.object({
  question: z.string().describe('A prospective cadet question about joining NCC.'),
});

export type NccInformationInput = z.infer<typeof NccInformationInputSchema>;

const NccInformationOutputSchema = z.object({
  answer: z.string().describe('A concise, helpful answer about NCC participation.'),
});

export type NccInformationOutput = z.infer<typeof NccInformationOutputSchema>;

export async function programRecommendation(input: ProgramRecommendationInput): Promise<ProgramRecommendationOutput> {
  return programRecommendationFlow(input);
}

export async function nccInformation(input: NccInformationInput): Promise<NccInformationOutput> {
  return nccInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'programRecommendationPrompt',
  input: {schema: ProgramRecommendationInputSchema},
  output: {schema: ProgramRecommendationOutputSchema},
  prompt: `You are an expert academic advisor for Modern School. A prospective student is seeking program recommendations based on their academic interests and background.

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

const nccInformationPrompt = ai.definePrompt({
  name: 'nccInformationPrompt',
  input: {schema: NccInformationInputSchema},
  output: {schema: NccInformationOutputSchema},
  prompt: `You are a helpful NCC admissions assistant for Modern School.

Answer the prospective cadet's question clearly and practically. Cover eligibility, discipline, training, camps, certificates, leadership, fitness, and service benefits when relevant. If the question needs school-specific dates or fees, tell the student to contact the NCC office for the latest details.

Question: {{{question}}}
  `,
});

const nccInformationFlow = ai.defineFlow(
  {
    name: 'nccInformationFlow',
    inputSchema: NccInformationInputSchema,
    outputSchema: NccInformationOutputSchema,
  },
  async input => {
    try {
      const {output} = await nccInformationPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in nccInformationFlow:', error);
      throw new Error('Failed to answer the NCC question.');
    }
  }
);
