'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { updateBlock, type Block } from '@/firebase/services/blocks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Activity, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const itemSchema = z.object({
  number: z.string().min(1, "Number is required"),
  label: z.string().min(1, "Label is required"),
  iconName: z.string().default('Zap'),
});

const blockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  items: z.array(itemSchema)
});

type FormValues = z.infer<typeof blockSchema>;

const iconOptions = ['Users', 'GraduationCap', 'Trophy', 'Shield', 'Zap', 'BookOpen', 'Globe', 'Award'];

export function AdminStatsExpanded({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            title: block.data.title || 'Numbers that Define Us',
            subtitle: block.data.subtitle || '',
            items: block.data.items || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data: values });
            toast({ title: "Stats block updated!" });
            onUpdate();
            onOpenChange(false);
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save block.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Edit Expanded Stats Block
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="stats-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto pr-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="subtitle" render={({ field }) => (
                            <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <FormLabel className="text-lg font-bold">Statistics List</FormLabel>
                                <Button size="sm" type="button" variant="outline" onClick={() => append({number: '0', label: '', iconName: 'Zap'})}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stat
                                </Button>
                            </div>
                            <Accordion type="multiple" className="w-full">
                                {fields.map((field, index) => (
                                    <AccordionItem key={field.id} value={`item-${index}`} className="border rounded-lg mb-2 px-4">
                                        <div className="flex items-center">
                                            <AccordionTrigger className="flex-grow text-sm hover:no-underline">
                                                {form.watch(`items.${index}.number`)} - {form.watch(`items.${index}.label`) || `Stat #${index + 1}`}
                                            </AccordionTrigger>
                                            <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <AccordionContent className="space-y-4 pt-4 pb-6 border-t">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name={`items.${index}.number`} render={({ field }) => (
                                                    <FormItem><FormLabel>Number (can include +, % etc)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name={`items.${index}.label`} render={({ field }) => (
                                                    <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                            <FormField control={form.control} name={`items.${index}.iconName`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Icon</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select icon" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {iconOptions.map(icon => (
                                                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </form>
                </Form>
                <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" form="stats-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
