'use server';
/**
 * @fileOverview A chatbot flow that provides information about the college by querying Firestore services.
 */

import { ai } from '../genkit-instance';
import { z } from 'genkit';
import { getDepartments } from '@/firebase/services/departments';
import { getActivities } from '@/firebase/services/activities';
import { getTeamMembers } from '@/firebase/services/team';
import { getEvents } from '@/firebase/services/events';
import { getContactInfo } from '@/firebase/services/contact';

const SiteChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});

const SiteChatOutputSchema = z.object({
  reply: z.string().describe('The AI\'s response to the user.'),
});

// Tools for the AI to query the site's data
const getDepartmentsTool = ai.defineTool(
  {
    name: 'getDepartments',
    description: 'Returns a list of academic departments and their details.',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    try {
      return await getDepartments();
    } catch (e) {
      console.error('Error in getDepartmentsTool:', e);
      return [];
    }
  }
);

const getActivitiesTool = ai.defineTool(
  {
    name: 'getActivities',
    description: 'Returns a list of college activities like NCC, NSS, and Sports.',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    try {
      return await getActivities();
    } catch (e) {
      console.error('Error in getActivitiesTool:', e);
      return [];
    }
  }
);

const getTeamMembersTool = ai.defineTool(
  {
    name: 'getTeamMembers',
    description: 'Returns a list of faculty and staff members.',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    try {
      return await getTeamMembers();
    } catch (e) {
      console.error('Error in getTeamMembersTool:', e);
      return [];
    }
  }
);

const getEventsTool = ai.defineTool(
  {
    name: 'getEvents',
    description: 'Returns a list of upcoming and past campus events.',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    try {
      return await getEvents();
    } catch (e) {
      console.error('Error in getEventsTool:', e);
      return [];
    }
  }
);

const getContactInfoTool = ai.defineTool(
  {
    name: 'getContactInfo',
    description: 'Returns the general contact information for the college (phone, email, address).',
    inputSchema: z.void(),
    outputSchema: z.any(),
  },
  async () => {
    try {
      return await getContactInfo();
    } catch (e) {
      console.error('Error in getContactInfoTool:', e);
      return null;
    }
  }
);

export async function siteChat(input: z.infer<typeof SiteChatInputSchema>) {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error('Chatbot is not configured. Set GEMINI_API_KEY in your environment.');
  }
  return siteChatFlow(input);
}

const siteChatFlow = ai.defineFlow(
  {
    name: 'siteChatFlow',
    inputSchema: SiteChatInputSchema,
    outputSchema: SiteChatOutputSchema,
  },
  async (input) => {
    const { message, history = [] } = input;

    try {
      const response = await ai.generate({
        system: `You are a helpful and polite AI assistant for Modern School. 
        Your goal is to assist students, parents, and visitors by providing accurate information about the school.
        
        You have access to tools to look up departments, activities (like NCC/NSS), faculty, events, and contact info. 
        Always use these tools if the user asks about specific offerings, people, or details of the college.
        
        Be concise, informative, and maintain a professional yet friendly tone. If you don't know something and can't find it with tools, politely say so.`,
        prompt: message,
        messages: history.map(m => ({ 
          role: m.role, 
          content: [{ text: m.content }] 
        })),
        tools: [getDepartmentsTool, getActivitiesTool, getTeamMembersTool, getEventsTool, getContactInfoTool],
      });

      const reply = response.text?.trim();
      return {
        reply: reply || 'I could not generate a response just now. Please try asking again.',
      };
    } catch (error) {
      console.error('Error in siteChatFlow:', error);
      throw new Error('AI Generation failed. Please check your API key and network connection.');
    }
  }
);
