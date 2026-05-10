'use server';

import { z } from 'genkit';

const SimpleGeminiChatInputSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional(),
});

type SimpleGeminiChatInput = z.infer<typeof SimpleGeminiChatInputSchema>;

export async function simpleGeminiChat(input: SimpleGeminiChatInput): Promise<{ reply: string }> {
  const parsed = SimpleGeminiChatInputSchema.parse(input);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in environment.');
  }

  const recentHistory = (parsed.history || []).slice(-6);
  const historyText = recentHistory
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = [
    'You are a helpful, concise assistant.',
    'Keep answers short and clear.',
    historyText ? `Conversation so far:\n${historyText}` : '',
    `User: ${parsed.message}`,
    'Assistant:',
  ]
    .filter(Boolean)
    .join('\n\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${details}`);
  }

  const data = await response.json();
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => (typeof p?.text === 'string' ? p.text : ''))
      .join('')
      .trim() || '';

  if (!reply) {
    return { reply: 'I could not generate a response. Please try again.' };
  }

  return { reply };
}
