import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const defaultModel = process.env.GEMINI_MODEL || 'googleai/gemini-2.5-flash';

export const ai = genkit({
  plugins: geminiApiKey
    ? [
        googleAI({
          apiKey: geminiApiKey,
        }),
      ]
    : [],
  model: defaultModel,
});

if (!geminiApiKey) {
  console.warn('AI Startup Warning: GEMINI_API_KEY is missing. Chatbot requests will fail until it is set.');
}
