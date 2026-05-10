
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
import { Card, CardContent } from '@/components/ui/card';
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
                        placeholder="e.g., 'I'm passionate about business, accounting, and financial markets...'"
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
                        placeholder="e.g., 'I have completed my 2nd PUC in Commerce and have a strong interest in economics...'"
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
             <div className="mt-4 space-y-4">
              {result.recommendedPrograms?.map((program, index) => (
                <Card key={index} className="bg-secondary/50">
                    <CardContent className="p-6">
                        <h4 className="font-semibold text-lg text-primary">{program.name}</h4>
                        <p className="mt-2 text-sm text-foreground">{program.justification}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
        </div>
      )}
    </div>
  );
}
