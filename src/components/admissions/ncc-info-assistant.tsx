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
  nccInformation,
  type NccInformationOutput,
} from '@/ai/flows/program-recommendation-tool';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const FormSchema = z.object({
  question: z
    .string()
    .min(10, {
      message: 'Please ask a question that is at least 10 characters long.',
    })
    .max(500, {
      message: 'Please keep your question under 500 characters.',
    }),
});

export function NccInfoAssistant() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NccInformationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await nccInformation(data);
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
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ask about joining the NCC</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'What are the benefits of joining the NCC?' or 'What kind of training will I receive?'"
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
                Ask Assistant
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI assistant is thinking...</p>
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
            <h3 className="font-headline text-2xl font-bold">Answer from our AI Assistant</h3>
            <Card className="mt-4 bg-secondary/50">
              <CardContent className="p-6">
                <div className="whitespace-pre-wrap font-body text-foreground">
                    {result.answer}
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
