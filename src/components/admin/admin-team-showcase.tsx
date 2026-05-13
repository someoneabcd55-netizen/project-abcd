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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { AdminImageUploadField } from './admin-image-upload-field';

const socialSchema = z.object({
  platform: z.enum(['facebook', 'twitter', 'linkedin', 'github', 'instagram']),
  url: z.string().url('A valid URL is required'),
});

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  bio: z.string().optional(),
  socials: z.array(socialSchema).optional(),
});

const blockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  items: z.array(memberSchema)
});

type FormValues = z.infer<typeof blockSchema>;

export function AdminTeamShowcase({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            title: block.data.title || 'Meet Our Visionaries',
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
            toast({ title: "Team block updated!" });
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
            <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Edit Team Showcase Block
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="team-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto pr-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="subtitle" render={({ field }) => (
                                <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <FormLabel className="text-lg font-bold">Team Members</FormLabel>
                                <Button size="sm" type="button" variant="outline" onClick={() => append({name: '', designation: '', photoUrl: '', bio: '', socials: []})}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </div>
                            <Accordion type="multiple" className="w-full">
                                {fields.map((field, index) => (
                                    <AccordionItem key={field.id} value={`item-${index}`} className="border rounded-lg mb-4 px-4 overflow-hidden">
                                        <div className="flex items-center">
                                            <AccordionTrigger className="flex-grow text-sm hover:no-underline py-4">
                                                {form.watch(`items.${index}.name`) || `Member #${index + 1}`} - {form.watch(`items.${index}.designation`)}
                                            </AccordionTrigger>
                                            <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <AccordionContent className="space-y-6 pt-4 pb-8 border-t">
                                            <div className="grid grid-cols-12 gap-6">
                                                <div className="col-span-4">
                                                    <FormField control={form.control} name={`items.${index}.photoUrl`} render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Member Photo</FormLabel>
                                                            <AdminImageUploadField 
                                                                value={field.value} 
                                                                onChange={field.onChange}
                                                                folder="college-portal/home/team"
                                                                previewAlt={form.watch(`items.${index}.name`)}
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </div>
                                                <div className="col-span-8 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (
                                                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={form.control} name={`items.${index}.designation`} render={({ field }) => (
                                                            <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </div>
                                                    <FormField control={form.control} name={`items.${index}.bio`} render={({ field }) => (
                                                        <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                                                    )} />
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </form>
                </Form>
                <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" form="team-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

