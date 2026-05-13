'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateBlock, type Block } from '@/firebase/services/blocks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';

const blockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  address: z.string().min(1, 'Address is required'),
  embedUrl: z.string().url('A valid URL is required'),
  phone: z.string().optional(),
  email: z.string().optional(),
  hours: z.string().optional(),
});

type FormValues = z.infer<typeof blockSchema>;

export function AdminMapLocation({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            title: block.data.title || 'Find Us Here',
            address: block.data.address || '',
            embedUrl: block.data.embedUrl || '',
            phone: block.data.phone || '',
            email: block.data.email || '',
            hours: block.data.hours || ''
        }
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data: values });
            toast({ title: "Map block updated!" });
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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Edit Map / Location Block
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="map-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="embedUrl" render={({ field }) => (
                            <FormItem><FormLabel>Google Maps Embed URL</FormLabel><FormControl><Input placeholder="https://www.google.com/maps/embed?..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="hours" render={({ field }) => (
                            <FormItem><FormLabel>Office Hours</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" form="map-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

