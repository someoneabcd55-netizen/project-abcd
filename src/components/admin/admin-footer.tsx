'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { getFooterContent, updateFooterContent } from '@/firebase/services/footer';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const linkSchema = z.object({
  label: z.string().min(1, 'Link text is required.'),
  url: z.string().min(1, 'Link URL is required.'),
});

const linkColumnSchema = z.object({
  title: z.string().min(1, 'Column title is required.'),
  links: z.array(linkSchema),
});

const socialLinkSchema = z.object({
  platform: z.enum(['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'Youtube']),
  url: z.string().url('Must be a valid URL.'),
});

const footerFormSchema = z.object({
  linkColumns: z.array(linkColumnSchema),
  socialLinks: z.array(socialLinkSchema),
  copyrightText: z.string().min(1, 'Copyright text is required.'),
});

type FooterFormValues = z.infer<typeof footerFormSchema>;

const defaultFooterValues: FooterFormValues = {
  linkColumns: [],
  socialLinks: [],
  copyrightText: `© ${new Date().getFullYear()} Modern School. All Rights Reserved.`,
};

export function AdminFooter() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerFormSchema),
    defaultValues: defaultFooterValues,
  });

  const { fields: columnFields, append: appendColumn, remove: removeColumn, replace: replaceColumns } = useFieldArray({
    control: form.control,
    name: 'linkColumns',
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial, replace: replaceSocials } = useFieldArray({
      control: form.control,
      name: 'socialLinks',
  });

  useEffect(() => {
    const fetchFooterContent = async () => {
      setIsLoading(true);
      const data = await getFooterContent();
      if (data) {
        form.reset({
            ...defaultFooterValues,
            ...data,
        });
      }
      setIsLoading(false);
    };
    fetchFooterContent();
  }, [form]);

  const onSubmit = async (values: FooterFormValues) => {
    setIsSubmitting(true);
    try {
      await updateFooterContent(values);
      toast({ title: 'Success', description: 'Footer content updated successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred while updating.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <CardContent className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 pt-6">
          
          <div>
            <h3 className="text-lg font-medium mb-2">Link Columns</h3>
            <Accordion type="multiple" className="w-full" defaultValue={columnFields.map((_, i) => `col-${i}`)}>
              {columnFields.map((column, colIndex) => (
                <AccordionItem key={column.id} value={`col-${colIndex}`}>
                  <div className="flex items-center">
                    <AccordionTrigger className="flex-grow">{form.watch(`linkColumns.${colIndex}.title`) || "New Column"}</AccordionTrigger>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(colIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <AccordionContent className="pl-2">
                    <div className="space-y-4 p-4 border rounded-md">
                        <FormField control={form.control} name={`linkColumns.${colIndex}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Column Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <FieldArrayLinks control={form.control} name={`linkColumns.${colIndex}.links`} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
             <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendColumn({ title: 'New Column', links: [{ label: 'New Link', url: '/' }]})}>
                <Plus className="mr-2 h-4 w-4" /> Add Link Column
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Social Media Links</h3>
            <div className="space-y-4">
              {socialFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 p-3 border rounded-md">
                    <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field }) => (
                            <FormItem className="w-1/3">
                                <FormLabel>Platform</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Youtube">Youtube</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                    )} />
                  <FormField control={form.control} name={`socialLinks.${index}.url`} render={({ field }) => (
                    <FormItem className="flex-grow"><FormLabel>URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
               <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ platform: 'Facebook', url: 'https://facebook.com' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Social Link
              </Button>
            </div>
          </div>
          
           <FormField control={form.control} name="copyrightText" render={({ field }) => (
              <FormItem><FormLabel>Copyright Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Footer Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}


function FieldArrayLinks({ control, name }: { control: any, name: string }) {
    const { fields, append, remove } = useFieldArray({ control, name });
    
    return (
        <div className="space-y-2">
            <FormLabel>Links</FormLabel>
            {fields.map((link, linkIndex) => (
                <div key={link.id} className="flex items-end gap-2">
                    <FormField control={control} name={`${name}.${linkIndex}.label`} render={({ field }) => (
                        <FormItem className="flex-grow"><FormControl><Input placeholder="Link Text" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={control} name={`${name}.${linkIndex}.url`} render={({ field }) => (
                        <FormItem className="flex-grow"><FormControl><Input placeholder="/url-slug" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(linkIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ label: 'New Link', url: '/' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
        </div>
    )
}
