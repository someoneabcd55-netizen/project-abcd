# G V Hallikeri PU college Project Code

This file contains the complete source code for your G V Hallikeri PU college application, consolidated for easier copying.

---

## File: `.env`

```
```

---

## File: `README.md`

```md
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
```

---

## File: `apphosting.yaml`

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
```

---

## File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## File: `next.config.ts`

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

## File: `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.14.1",
    "@genkit-ai/next": "^1.14.1",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.14.1",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.14.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## File: `src/ai/dev.ts`

```ts
import '@/ai/flows/program-recommendation-tool.ts';
```

---

## File: `src/ai/flows/program-recommendation-tool.ts`

```ts
// This is a Genkit flow for providing personalized program recommendations to prospective students.

'use server';

/**
 * @fileOverview An AI tool to provide personalized program recommendations based on academic interests and background.
 *
 * - programRecommendation - A function that handles the program recommendation process.
 * - ProgramRecommendationInput - The input type for the programRecommendation function.
 * - ProgramRecommendationOutput - The return type for the programRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  recommendedPrograms: z
    .string()
    .describe('A list of recommended programs and reasons why they are a good fit.'),
});

export type ProgramRecommendationOutput = z.infer<typeof ProgramRecommendationOutputSchema>;

export async function programRecommendation(input: ProgramRecommendationInput): Promise<ProgramRecommendationOutput> {
  return programRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'programRecommendationPrompt',
  input: {schema: ProgramRecommendationInputSchema},
  output: {schema: ProgramRecommendationOutputSchema},
  prompt: `You are an expert academic advisor. A prospective student is seeking program recommendations based on their academic interests and background.

  Provide a list of recommended programs, and a short justification for each program.

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
    const {output} = await prompt(input);
    return output!;
  }
);
```

---

## File: `src/ai/genkit.ts`

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  console.log(
    'AI Startup Error: GEMINI_API_KEY environment variable not found.'
  );
} else {
  console.log(
    'AI Startup Info: GEMINI_API_KEY environment variable loaded successfully.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
```

---

## File: `src/app/admissions/page.tsx`

```tsx
import { ProgramRecommender } from '@/components/admissions/program-recommender';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AdmissionsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Admissions
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Begin your journey with G V Hallikeri PU college. We're excited to help you take the next step in your academic career.
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-headline text-3xl font-bold">Program Recommendation Tool</h2>
          <p className="mt-2 text-muted-foreground">
            Not sure which program is right for you? Use our AI-powered tool to get personalized recommendations based on your interests and background.
          </p>
          <ProgramRecommender />
        </div>
        
        <div className="space-y-8">
            <div>
                <h2 className="font-headline text-3xl font-bold">How to Apply</h2>
                <ol className="mt-4 list-decimal list-inside space-y-3 text-muted-foreground">
                    <li>Explore our programs to find your perfect fit.</li>
                    <li>Review the admission requirements and deadlines.</li>
                    <li>Prepare your application materials, including transcripts and test scores.</li>
                    <li>Complete and submit the online application form.</li>
                    <li>Track your application status through our student portal.</li>
                </ol>
            </div>
          <div>
            <h2 className="font-headline text-3xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are the key admission dates?</AccordionTrigger>
                <AccordionContent>
                  Our early decision deadline is November 1st, and the regular decision deadline is January 15th. We recommend applying as early as possible.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you offer financial aid?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a variety of need-based and merit-based scholarships, grants, and loan options. Please visit our financial aid office page for more details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I visit the campus?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! We encourage prospective students to schedule a campus tour to experience our community firsthand. You can book a tour on our website.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## File: `src/app/contact/page.tsx`

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
    const { toast } = useToast();
    const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  function onSubmit(data: ContactFormValues) {
    console.log(data);
    toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl text-center">
        Contact Us
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-center">
        We're here to help. Reach out to us through any of the channels below.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Phone className="h-8 w-8 text-primary" />
            <CardTitle>By Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">General Inquiries:</p>
            <p className="text-muted-foreground">(123) 456-7890</p>
            <p className="mt-2 font-semibold">Admissions Office:</p>
            <p className="text-muted-foreground">(123) 456-7891</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Mail className="h-8 w-8 text-primary" />
            <CardTitle>By Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">General Inquiries:</p>
            <p className="text-muted-foreground">info@gvh.edu</p>
            <p className="mt-2 font-semibold">Admissions Office:</p>
            <p className="text-muted-foreground">admissions@gvh.edu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <MapPin className="h-8 w-8 text-primary" />
            <CardTitle>Our Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">G V Hallikeri PU college</p>
            <p className="text-muted-foreground">
              123 University Ave,
              <br />
              Knowledge City, 12345
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-center font-headline text-3xl font-bold">Send us a Message</h2>
        <Card className="mt-6">
            <CardContent className="p-6">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Inquiry about admissions" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message here..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## File: `src/app/departments/[slug]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { departments, type Course } from '../data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FlaskConical, Users } from 'lucide-react';

export async function generateStaticParams() {
  return departments.map((dept) => ({
    slug: dept.slug,
  }));
}

export default function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  const department = departments.find((dept) => dept.slug === params.slug);

  if (!department) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src={department.imageUrl}
          alt={`Image for ${department.name}`}
          data-ai-hint={department.dataAiHint}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            {department.name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <p className="text-center text-lg text-muted-foreground md:text-xl">
          {department.longDescription}
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Faculty Section */}
          <div className="lg:col-span-2">
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <Users className="h-8 w-8 text-primary" /> Faculty
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {department.faculty.map((member) => (
                <Card key={member.id} className="flex items-center p-4 gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.title}</p>
                     <Link href={`/faculty#${member.id}`} className="text-sm text-primary hover:underline">View Profile</Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Research Areas */}
          <div>
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <FlaskConical className="h-8 w-8 text-primary" /> Research Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {department.researchAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-sm">{area}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mt-16">
          <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
            <BookOpen className="h-8 w-8 text-primary" /> Featured Courses
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {department.courses.map((course: Course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <p className="text-sm font-mono text-muted-foreground pt-1">{course.id}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## File: `src/app/departments/data.ts`

```ts
import type { FacultyMember } from '@/app/faculty/data';
import { faculty } from '@/app/faculty/data';

export interface Course {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  faculty: FacultyMember[];
  courses: Course[];
  researchAreas: string[];
  imageUrl: string;
  dataAiHint: string;
}

export const departments: Department[] = [
  {
    name: 'Computer Science',
    slug: 'computer-science',
    shortDescription: 'Pioneering the digital future through cutting-edge research and innovation in computing.',
    longDescription: 'The Department of Computer Science is at the forefront of the digital revolution. We offer comprehensive programs that cover the theoretical foundations of computation and the practical techniques for their implementation and application. Our students engage in hands-on projects, from developing complex software systems to exploring the frontiers of artificial intelligence.',
    faculty: faculty.filter(f => f.department === 'Computer Science'),
    courses: [
      { id: 'CS101', name: 'Introduction to Programming', description: 'Learn the fundamentals of programming using Python.' },
      { id: 'CS201', name: 'Data Structures & Algorithms', description: 'A deep dive into essential data structures and algorithms.' },
      { id: 'CS301', name: 'Machine Learning', description: 'Explore the theories and applications of machine learning.' },
    ],
    researchAreas: ['Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Human-Computer Interaction'],
    imageUrl: 'https://picsum.photos/1200/800?random=1',
    dataAiHint: 'computer science'
  },
  {
    name: 'Mechanical Engineering',
    slug: 'mechanical-engineering',
    shortDescription: 'Designing and building the machines and systems that power our world.',
    longDescription: 'Mechanical Engineering is a broad discipline that involves the design, analysis, and manufacturing of mechanical systems. Our curriculum provides a strong foundation in core concepts such as mechanics, thermodynamics, and materials science, while also offering specializations in areas like robotics, sustainable energy, and biomechanics.',
    faculty: faculty.filter(f => f.department === 'Mechanical Engineering'),
    courses: [
      { id: 'ME101', name: 'Introduction to Thermodynamics', description: 'Principles of energy, heat, and work.' },
      { id: 'ME201', name: 'Fluid Mechanics', description: 'The study of fluids in motion.' },
      { id: 'ME301', name: 'Robotics Design', description: 'Design and build autonomous robots.' },
    ],
    researchAreas: ['Robotics and Automation', 'Sustainable Energy Systems', 'Advanced Manufacturing', 'Biomechanics'],
    imageUrl: 'https://picsum.photos/1200/800?random=2',
    dataAiHint: 'mechanical engineering'
  },
  {
    name: 'Business Administration',
    slug: 'business-administration',
    shortDescription: 'Cultivating the next generation of business leaders and entrepreneurs.',
    longDescription: 'Our Business Administration program equips students with the critical thinking and leadership skills needed to succeed in the dynamic world of business. The curriculum covers a wide range of topics, including marketing, finance, management, and entrepreneurship, all taught through a combination of case studies, real-world projects, and internships.',
    faculty: faculty.filter(f => f.department === 'Business Administration'),
    courses: [
      { id: 'BA101', name: 'Principles of Marketing', description: 'Understanding market dynamics and consumer behavior.' },
      { id: 'BA201', name: 'Corporate Finance', description: 'Financial decision-making in a corporate setting.' },
      { id: 'BA301', name: 'Strategic Management', description: 'Developing and implementing business strategies.' },
    ],
    researchAreas: ['Corporate Strategy', 'Financial Markets', 'Consumer Behavior', 'Entrepreneurship and Innovation'],
    imageUrl: 'https://picsum.photos/1200/800?random=3',
    dataAiHint: 'business meeting'
  },
  {
    name: 'Arts & Humanities',
    slug: 'arts-humanities',
    shortDescription: 'Exploring human culture, creativity, and critical thought across history.',
    longDescription: 'The Department of Arts & Humanities offers a rich exploration of human expression and experience. Through the study of literature, history, philosophy, and the arts, students develop invaluable skills in critical analysis, creative thinking, and effective communication. Our programs foster a deep appreciation for the cultural forces that shape our world.',
    faculty: faculty.filter(f => f.department === 'Arts & Humanities'),
    courses: [
      { id: 'AH101', name: 'World Literature', description: 'A survey of major literary works from around the globe.' },
      { id: 'AH201', name: 'Introduction to Philosophy', description: 'Exploring fundamental questions of existence, knowledge, and ethics.' },
      { id: 'AH301', name: 'Modern Art History', description: 'An analysis of artistic movements from the 19th century to the present.' },
    ],
    researchAreas: ['Postcolonial Literature', 'Ethics and Political Philosophy', 'Digital Humanities', 'Contemporary Art Theory'],
    imageUrl: 'https://picsum.photos/1200/800?random=4',
    dataAiHint: 'art gallery'
  },
  {
    name: 'Electrical Engineering',
    slug: 'electrical-engineering',
    shortDescription: 'Powering innovation in electronics, communication, and energy systems.',
    longDescription: 'The Electrical Engineering department focuses on the study and application of electricity, electronics, and electromagnetism. Students gain expertise in areas ranging from microelectronics and circuit design to communication systems and power grids. Our labs are equipped with state-of-the-art technology to support hands-on learning and research.',
    faculty: faculty.filter(f => f.department === 'Electrical Engineering'),
    courses: [
      { id: 'EE101', name: 'Circuit Analysis', description: 'Fundamental analysis of electrical circuits.' },
      { id: 'EE201', name: 'Digital Systems Design', description: 'Design and implementation of digital logic circuits.' },
      { id: 'EE301', name: 'Communication Systems', description: 'Principles of analog and digital communication.' },
    ],
    researchAreas: ['Wireless Communications', 'Power Electronics', 'Semiconductor Devices', 'Signal Processing'],
    imageUrl: 'https://picsum.photos/1200/800?random=5',
    dataAiHint: 'circuit board'
  },
    {
    name: 'Civil Engineering',
    slug: 'civil-engineering',
    shortDescription: 'Building the infrastructure of modern society, from bridges to water systems.',
    longDescription: 'Civil Engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment. Our program covers structural engineering, environmental engineering, and transportation engineering, preparing students to tackle some of society\'s most pressing infrastructure challenges.',
    faculty: faculty.filter(f => f.department === 'Civil Engineering'),
    courses: [
      { id: 'CE101', name: 'Statics and Dynamics', description: 'Fundamentals of mechanics for civil engineers.' },
      { id: 'CE201', name: 'Structural Analysis', description: 'Analysis of trusses, beams, and frames.' },
      { id: 'CE301', name: 'Environmental Engineering', description: 'Principles of water and wastewater treatment.' },
    ],
    researchAreas: ['Sustainable Infrastructure', 'Earthquake Engineering', 'Water Resource Management', 'Transportation Systems'],
    imageUrl: 'https://picsum.photos/1200/800?random=6',
    dataAiHint: 'bridge construction'
  }
];
```

---

## File: `src/app/departments/page.tsx`

```tsx
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, FlaskConical, Briefcase, Paintbrush, ArrowRight } from 'lucide-react';
import { departments, type Department } from './data';

const iconMap: { [key: string]: React.ElementType } = {
  'computer-science': Building2,
  'mechanical-engineering': FlaskConical,
  'business-administration': Briefcase,
  'arts-humanities': Paintbrush,
  'electrical-engineering': FlaskConical,
  'civil-engineering': Building2,
};

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Academic Departments
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Explore our diverse range of departments, each a center of excellence in its field.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept: Department) => {
          const Icon = iconMap[dept.slug] || Building2;
          return (
            <Link key={dept.slug} href={`/departments/${dept.slug}`} className="group block">
              <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <Icon className="h-16 w-16 text-primary transition-colors duration-300 group-hover:text-accent" />
                  <h2 className="mt-4 font-headline text-xl font-semibold">{dept.name}</h2>
                  <p className="mt-2 flex-grow text-muted-foreground">{dept.shortDescription}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

---

## File: `src/app/events/data.ts`

```ts
export interface Event {
  title: string;
  date: string; // YYYY-MM-DD format
  location: string;
  type: 'Academic' | 'Extracurricular';
  description: string;
}

export const events: Event[] = [
  {
    title: 'Guest Lecture: The Future of Quantum Computing',
    date: '2024-10-15',
    location: 'Auditorium A',
    type: 'Academic',
    description: 'A talk by Dr. Evelyn Reed on the next frontier of computing technology.',
  },
  {
    title: 'Campus-wide Sports Day',
    date: '2024-10-22',
    location: 'University Sports Complex',
    type: 'Extracurricular',
    description: 'An exciting day of friendly competition between departments.',
  },
  {
    title: 'Mid-term Examinations Begin',
    date: '2024-10-28',
    location: 'All Departments',
    type: 'Academic',
    description: 'The mid-term examination period for the fall semester starts today.',
  },
  {
    title: 'Alumni Homecoming Weekend',
    date: '2024-11-05',
    location: 'Main Campus',
    type: 'Extracurricular',
    description: 'Welcome back our esteemed alumni for a weekend of networking and celebration.',
  },
  {
    title: 'Computer Science Hackathon',
    date: '2024-11-12',
    location: 'CS Department Labs',
    type: 'Academic',
    description: 'A 24-hour coding challenge to build innovative software solutions.',
  },
  {
    title: 'Annual Drama Club Production',
    date: '2024-11-18',
    location: 'University Theater',
    type: 'Extracurricular',
    description: 'This year\'s production is "A Midsummer Night\'s Dream".',
  },
  {
    title: 'Fall Semester Ends',
    date: '2024-12-15',
    location: 'Campus-wide',
    type: 'Academic',
    description: 'Final day of classes for the fall semester.',
  },
];
```

---

## File: `src/app/events/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { events as allEvents, Event } from './data';
import { format } from 'date-fns';

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = allEvents.filter(event => 
    date && format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const eventsToShow = date && selectedDateEvents.length > 0 ? selectedDateEvents : upcomingEvents.slice(0, 5);

  const eventDates = allEvents.map(event => new Date(event.date));

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Campus Events
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Stay up-to-date with all the academic and extracurricular activities happening at G V Hallikeri PU college.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {date && selectedDateEvents.length > 0 ? `Events on ${format(date, 'PPP')}` : 'Upcoming Events'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsToShow.length > 0 ? (
                <div className="space-y-4">
                  {eventsToShow.map((event: Event) => (
                    <div key={event.title} className="flex flex-col sm:flex-row gap-4 rounded-lg border p-4">
                       <div className="flex-shrink-0 text-center sm:w-24">
                        <p className="text-sm text-primary">{format(new Date(event.date), 'MMM')}</p>
                        <p className="text-3xl font-bold">{format(new Date(event.date), 'd')}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'yyyy')}</p>
                      </div>
                      <div>
                        <Badge variant={event.type === 'Academic' ? 'default' : 'secondary'} className="mb-2">{event.type}</Badge>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <p className="mt-2 text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events scheduled for this day. Check out the upcoming events!</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="row-start-1 lg:row-start-auto">
          <Card className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiers={{ event: eventDates }}
              modifiersClassNames={{
                event: 'bg-accent/30 rounded-full',
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## File: `src/app/faculty/data.ts`

```ts
export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  expertise: string[];
  imageUrl: string;
}

export const faculty: FacultyMember[] = [
  {
    id: 'john-doe',
    name: 'Dr. John Doe',
    title: 'Professor & Head of Department',
    department: 'Computer Science',
    email: 'john.doe@gvh.edu',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing'],
    imageUrl: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: 'jane-smith',
    name: 'Dr. Jane Smith',
    title: 'Associate Professor',
    department: 'Computer Science',
    email: 'jane.smith@gvh.edu',
    expertise: ['Cybersecurity', 'Network Security', 'Cryptography'],
    imageUrl: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: 'emily-jones',
    name: 'Dr. Emily Jones',
    title: 'Professor',
    department: 'Mechanical Engineering',
    email: 'emily.jones@gvh.edu',
    expertise: ['Robotics', 'Control Systems', 'Automation'],
    imageUrl: 'https://picsum.photos/200/200?random=3',
  },
  {
    id: 'michael-brown',
    name: 'Dr. Michael Brown',
    title: 'Assistant Professor',
    department: 'Mechanical Engineering',
    email: 'michael.brown@gvh.edu',
    expertise: ['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics'],
    imageUrl: 'https://picsum.photos/200/200?random=4',
  },
  {
    id: 'sarah-davis',
    name: 'Prof. Sarah Davis',
    title: 'Professor of Marketing',
    department: 'Business Administration',
    email: 'sarah.davis@gvh.edu',
    expertise: ['Digital Marketing', 'Consumer Behavior', 'Brand Management'],
    imageUrl: 'https://picsum.photos/200/200?random=5',
  },
  {
    id: 'david-wilson',
    name: 'Dr. David Wilson',
    title: 'Associate Professor of Finance',
    department: 'Business Administration',
    email: 'david.wilson@gvh.edu',
    expertise: ['Corporate Finance', 'Investment Analysis', 'Financial Markets'],
    imageUrl: 'https://picsum.photos/200/200?random=6',
  },
  {
    id: 'laura-taylor',
    name: 'Dr. Laura Taylor',
    title: 'Professor of English Literature',
    department: 'Arts & Humanities',
    email: 'laura.taylor@gvh.edu',
    expertise: ['Modernism', 'Postcolonial Theory', 'Literary Criticism'],
    imageUrl: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: 'chris-anderson',
    name: 'Prof. Chris Anderson',
    title: 'Professor of Philosophy',
    department: 'Arts & Humanities',
    email: 'chris.anderson@gvh.edu',
    expertise: ['Ethics', 'Political Philosophy', 'Metaphysics'],
    imageUrl: 'https://picsum.photos/200/200?random=8',
  },
  {
    id: 'olivia-white',
    name: 'Dr. Olivia White',
    title: 'Professor',
    department: 'Electrical Engineering',
    email: 'olivia.white@gvh.edu',
    expertise: ['Signal Processing', 'Communication Systems', 'Information Theory'],
    imageUrl: 'https://picsum.photos/200/200?random=9',
  },
  {
    id: 'james-harris',
    name: 'Dr. James Harris',
    title: 'Professor',
    department: 'Civil Engineering',
    email: 'james.harris@gvh.edu',
    expertise: ['Structural Engineering', 'Earthquake Resistance', 'Sustainable Materials'],
    imageUrl: 'https://picsum.photos/200/200?random=10',
  }
];
```

---

## File: `src/app/faculty/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { faculty, type FacultyMember } from './data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FacultyPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaculty = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Our Faculty
        </h1>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
          Meet the brilliant minds shaping the future of education and research at G V Hallikeri PU college.
        </p>
      </div>

      <div className="relative mt-12 mb-8 max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, department, or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((member: FacultyMember) => (
          <Card key={member.id} id={member.id} className="group overflow-hidden transition-shadow hover:shadow-xl">
            <CardContent className="p-0 text-center">
              <div className="relative h-48 w-full bg-secondary">
                 <Avatar className="h-32 w-32 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 border-4 border-background rounded-full transition-transform duration-300 group-hover:scale-110">
                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person" />
                    <AvatarFallback className="text-4xl">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="pt-12 pb-6 px-6">
                <h2 className="font-headline text-xl font-semibold">{member.name}</h2>
                <p className="text-primary">{member.title}</p>
                <p className="text-muted-foreground text-sm">{member.department}</p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {member.expertise.slice(0,3).map((area) => (
                        <Badge key={area} variant="outline">{area}</Badge>
                    ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">{member.email}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {filteredFaculty.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No faculty members found matching your search.</p>
          </div>
        )}
    </div>
  );
}
```

---

## File: `src/app/gallery/page.tsx`

```tsx
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const galleryImages = [
  { src: 'https://picsum.photos/800/600?random=11', alt: 'Students studying in the library', dataAiHint: 'students library' },
  { src: 'https://picsum.photos/800/600?random=12', alt: 'University main building', dataAiHint: 'university building' },
  { src: 'https://picsum.photos/800/600?random=13', alt: 'Graduation ceremony', dataAiHint: 'graduation ceremony' },
  { src: 'https://picsum.photos/800/600?random=14', alt: 'Students participating in a sports event', dataAiHint: 'students sports' },
  { src: 'https://picsum.photos/800/600?random=15', alt: 'A science lab with students', dataAiHint: 'science lab' },
  { src: 'https://picsum.photos/800/600?random=16', alt: 'Campus gardens in spring', dataAiHint: 'campus garden' },
  { src: 'https://picsum.photos/800/600?random=17', alt: 'An art exhibition on campus', dataAiHint: 'art exhibition' },
  { src: 'https://picsum.photos/800/600?random=18', alt: 'Students collaborating on a project', dataAiHint: 'students collaborating' },
  { src: 'https://picsum.photos/800/600?random=19', alt: 'A concert on the main lawn', dataAiHint: 'campus concert' },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl text-center">
        Campus Life Gallery
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-center">
        A glimpse into the vibrant life at G V Hallikeri PU college.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  data-ai-hint={image.dataAiHint}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
              <Image
                src={image.src.replace('800/600', '1200/800')}
                alt={image.alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
```

---

## File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 17% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 222 65% 32%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215 25% 45%;
    --accent: 49 96% 52%;
    --accent-foreground: 35 92% 30%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222 65% 32%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 222 47% 11%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 11%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 27.9% 60%;
    --accent: 49 96% 52%;
    --accent-foreground: 35 92% 30%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## File: `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'G V Hallikeri PU college',
  description: 'Your gateway to higher education.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
```

---

## File: `src/app/page.tsx`

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, Calendar, Building2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const announcements = [
  {
    title: 'Fall 2024 Admissions Now Open',
    date: '2024-09-01',
    description: 'Apply now for our wide range of undergraduate and postgraduate programs.',
  },
  {
    title: 'Annual Tech Fest "Innovate 2024" Announced',
    date: '2024-08-28',
    description: 'Get ready for three days of coding, robotics, and innovation.',
  },
  {
    title: 'New Research Center for AI Ethics Launched',
    date: '2024-08-25',
    description: 'Our new center will focus on the ethical implications of artificial intelligence.',
  },
];

const events = [
  {
    title: 'Guest Lecture: The Future of Quantum Computing',
    date: 'October 15, 2024',
    location: 'Auditorium A',
  },
  {
    title: 'Campus-wide Sports Day',
    date: 'October 22, 2024',
    location: 'University Sports Complex',
  },
  {
    title: 'Alumni Homecoming Weekend',
    date: 'November 5-6, 2024',
    location: 'Main Campus',
  },
];

const departments = [
  { name: 'Computer Science', slug: 'computer-science' },
  { name: 'Mechanical Engineering', slug: 'mechanical-engineering' },
  { name: 'Business Administration', slug: 'business-administration' },
  { name: 'Arts & Humanities', slug: 'arts-humanities' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4noIVsrSvStYl6uIr9X6zW4_JbXjH55JP4QstkqdaAzAnbj4zGirFA7kOYaXoCa4QMD_BAmx0zmB_1kvJ280qx1g5dTmZbpvQk039_FDTzC72AEaIJHbGh030FUtTw-akxn3WTH-nQ=s1360-w1360-h1020-rw"
          alt="G V Hallikeri PU college Campus"
          data-ai-hint="university campus"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Welcome to G V Hallikeri PU college
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Excellence in Education, Innovation in Research.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/admissions">Apply Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/departments">Explore Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Announcements Section */}
        <section>
          <h2 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">
            Announcements & News
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Newspaper className="mt-1 h-6 w-6 text-primary" />
                    <span className="flex-1">{item.title}</span>
                  </CardTitle>
                  <CardDescription>{item.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Events & Departments */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Upcoming Events */}
          <section>
            <h2 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <Card key={index} className="transition-transform hover:scale-[1.02] hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Calendar className="h-8 w-8 text-accent" />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} - {event.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button asChild variant="link" className="float-right text-primary">
                <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </section>

          {/* Departments */}
          <section>
            <h2 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">
              Our Departments
            </h2>
            <div className="space-y-6">
              {departments.map((dept, index) => (
                <Card key={index} className="transition-transform hover:scale-[1.02] hover:shadow-lg">
                   <Link href={`/departments/${dept.slug}`} className="block h-full w-full">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Building2 className="h-8 w-8 text-accent" />
                      <h3 className="flex-1 font-semibold">{dept.name}</h3>
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </CardContent>
                  </Link>
                </Card>
              ))}
               <Button asChild variant="link" className="float-right text-primary">
                <Link href="/departments">All Departments <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

---

## File: `src/components/admissions/program-recommender.tsx`

```tsx
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  programRecommendation,
  type ProgramRecommendationOutput,
} from '@/ai/flows/program-recommendation-tool';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const FormSchema = z.object({
  academicInterests: z
    .string()
    .min(30, {
      message: 'Please describe your academic interests in at least 30 characters.',
    })
    .max(1000, {
      message: 'Please keep your description under 1000 characters.',
    }),
  academicHistory: z
    .string()
    .min(30, {
      message: 'Please summarize your academic history in at least 30 characters.',
    })
    .max(1000, {
        message: 'Please keep your summary under 1000 characters.',
    }),
});

export function ProgramRecommender() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProgramRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      academicInterests: '',
      academicHistory: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await programRecommendation(data);
      setResult(res);
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: errorMessage,
      });
    }
    setLoading(false);
  }

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="academicInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Academic Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I'm passionate about artificial intelligence, machine learning, and their applications in healthcare...'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="academicHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Academic History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a high school diploma with a focus on science and math, and I've completed online courses in Python and data structures...'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI advisor is thinking...</p>
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>
             <pre className="text-xs whitespace-pre-wrap">
                {error}
              </pre>
            </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="mt-8">
            <h3 className="font-headline text-2xl font-bold">Our Recommendations For You</h3>
            <Card className="mt-4 bg-secondary/50">
              <CardContent className="p-6">
                <div className="whitespace-pre-wrap font-body text-foreground">
                    {result.recommendedPrograms}
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
```

---

## File: `src/components/layout/footer.tsx`

```tsx
import { GraduationCap, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">G V Hallikeri PU college</span>
            </Link>
            <p className="text-muted-foreground">
              123 University Ave, Knowledge City, 12345
            </p>
            <p className="text-muted-foreground">
              Email: info@gvh.edu
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/admissions" className="text-muted-foreground hover:text-primary">Admissions</Link></li>
              <li><Link href="/departments" className="text-muted-foreground hover:text-primary">Departments</Link></li>
              <li><Link href="/faculty" className="text-muted-foreground hover:text-primary">Faculty</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-headline font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Student Portal</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Library</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="mb-4 font-headline font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} G V Hallikeri PU college. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## File: `src/components/layout/header.tsx`

```tsx
'use client';

import {
  GraduationCap,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/departments', label: 'Departments' },
  { href: '/faculty', label: 'Faculty' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              G V Hallikeri PU college
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                href="/"
                className="mb-6 flex items-center"
              >
                <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                <span className="font-bold text-lg font-headline">G V Hallikeri PU college</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'transition-colors hover:text-primary',
                       pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
           <div className="md:hidden flex items-center">
             <Link href="/" className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">
                  G V Hallikeri PU college
                </span>
              </Link>
           </div>
          <div className="flex items-center">
            <Button asChild className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/admissions">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## File: `src/components/ui/* (27 files)`

Omitted for brevity. You can view them in the file explorer.

---

## File: `src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---

## File: `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

## File: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## File: `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
