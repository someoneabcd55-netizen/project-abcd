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
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlayCircle } from 'lucide-react';
import { AdminImageUploadField } from './admin-image-upload-field';

const blockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  videoUrl: z.string().url('A valid URL is required'),
  thumbnailUrl: z.string().url('A valid image URL is required'),
  caption: z.string().optional(),
});

type FormValues = z.infer<typeof blockSchema>;

export function AdminVideoEmbed({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            title: block.data.title || 'Experience Our Campus',
            subtitle: block.data.subtitle || '',
            videoUrl: block.data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnailUrl: block.data.thumbnailUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80\u0026w=1200',
            caption: block.data.caption || ''
        }
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data: values });
            toast({ title: "Video block updated!" });
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
                        <PlayCircle className="h-5 w-5 text-primary" />
                        Edit Video Embed Block
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="video-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="subtitle" render={({ field }) => (
                            <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="videoUrl" render={({ field }) => (
                            <FormItem><FormLabel>Video URL (Embed Link)</FormLabel><FormControl><Input placeholder="https://www.youtube.com/embed/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbnail Image</FormLabel>
                                <AdminImageUploadField 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    folder="college-portal/home/video"
                                />
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="caption" render={({ field }) => (
                            <FormItem><FormLabel>Caption (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" form="video-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
