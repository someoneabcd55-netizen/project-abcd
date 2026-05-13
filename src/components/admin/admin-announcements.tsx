'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import { updateBlock, type Block } from '@/firebase/services/blocks';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, Plus, Trash2, Newspaper, Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';


const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
});

const announcementsBlockSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  announcements: z.array(announcementSchema)
});

type AnnouncementsFormValues = z.infer<typeof announcementsBlockSchema>;

interface AdminAnnouncementsProps {
    block: Block;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function AdminAnnouncements({ block, open, onOpenChange, onUpdate }: AdminAnnouncementsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<AnnouncementsFormValues>({
        resolver: zodResolver(announcementsBlockSchema),
        defaultValues: {
            title: block.data.title || 'Announcements',
            announcements: block.data.announcements || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "announcements"
    });

    const onSubmit = async (values: AnnouncementsFormValues) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data: values });
            toast({ title: "Announcements block updated!" });
            onUpdate();
            onOpenChange(false);
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save announcements.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Announcements Block</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="announcements-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <FormLabel>Announcements List</FormLabel>
                                <Button size="sm" type="button" variant="outline" onClick={() => append({title: '', date: format(new Date(), 'yyyy-MM-dd'), description: ''})}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Announcement
                                </Button>
                            </div>
                            <Accordion type="multiple" className="w-full" defaultValue={['ann-0']}>
                                {fields.map((field, index) => (
                                    <AccordionItem key={field.id} value={`ann-${index}`}>
                                        <div className="flex items-center">
                                            <AccordionTrigger className="flex-grow text-sm">
                                                {form.watch(`announcements.${index}.title`) || `Announcement #${index + 1}`}
                                            </AccordionTrigger>
                                            <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <AccordionContent className="p-4 border rounded-md">
                                            <div className="space-y-4">
                                                <FormField control={form.control} name={`announcements.${index}.title`} render={({ field }) => (
                                                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name={`announcements.${index}.date`} render={({ field }) => (
                                                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name={`announcements.${index}.description`} render={({ field }) => (
                                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </form>
                </Form>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Close</Button></DialogClose>
                    <Button type="submit" form="announcements-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

