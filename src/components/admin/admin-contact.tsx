'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  getContactInfo,
  updateContactInfo,
} from '@/firebase/services/contact';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

const contactFormSchema = z.object({
  generalphone: z.string().min(1, 'General phone is required.'),
  generalemail: z.string().email('A valid email is required for general inquiries.'),
  address: z.string().min(10, 'A full address is required.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function AdminContact() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        generalphone: '',
        generalemail: '',
        address: '',
    }
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      setIsLoading(true);
      const data = await getContactInfo();
      if (data) {
        form.reset(data);
      }
      setIsLoading(false);
    };

    fetchContactInfo();
  }, [form]);

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await updateContactInfo(values);
      toast({ title: 'Success', description: 'Contact information updated successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred while updating.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="generalphone" render={({ field }) => (
                        <FormItem><FormLabel>General Inquiries Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="generalemail" render={({ field }) => (
                        <FormItem><FormLabel>General Inquiries Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea className="min-h-[100px]" placeholder="G. V. Hallikeri College,&#10;Hosaritti, Haveri,&#10;Karnataka, 581110" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <CardFooter className="px-0 pt-6 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </>
  );
}
