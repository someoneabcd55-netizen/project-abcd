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
import { Loader2, Plus, Trash2, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminImageUploadField } from './admin-image-upload-field';

const buttonSchema = z.object({
  label: z.string().min(1, "Label is required"),
  link: z.string().min(1, "Link is required"),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
});

const blockSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subtext: z.string().optional(),
  btns: z.array(buttonSchema),
  bgType: z.enum(['solid', 'gradient', 'image']).default('solid'),
  bgValue: z.string().optional(),
});

type FormValues = z.infer<typeof blockSchema>;

export function AdminCTABanner({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            heading: block.data.heading || 'Ready to Shape Your Future?',
            subtext: block.data.subtext || '',
            btns: block.data.btns || [],
            bgType: block.data.bgType || 'solid',
            bgValue: block.data.bgValue || ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "btns"
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data: values });
            toast({ title: "CTA Banner updated!" });
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
                        <Zap className="h-5 w-5 text-primary" />
                        Edit CTA Banner Block
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="cta-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto pr-4">
                        <FormField control={form.control} name="heading" render={({ field }) => (
                            <FormItem><FormLabel>Main Heading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="subtext" render={({ field }) => (
                            <FormItem><FormLabel>Subtext</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="bgType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="solid">Solid Color (Theme Default)</SelectItem>
                                            <SelectItem value="gradient">Custom Gradient</SelectItem>
                                            <SelectItem value="image">Image Background</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="bgValue" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Value (Color/URL)</FormLabel>
                                    {form.watch('bgType') === 'image' ? (
                                        <AdminImageUploadField 
                                            value={field.value} 
                                            onChange={field.onChange}
                                            folder="college-portal/home/cta"
                                        />
                                    ) : (
                                        <FormControl><Input placeholder={form.watch('bgType') === 'gradient' ? 'linear-gradient(...)' : '#000'} {...field} /></FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <FormLabel className="text-lg font-bold">Action Buttons</FormLabel>
                                <Button size="sm" type="button" variant="outline" onClick={() => append({label: '', link: '', variant: 'primary'})}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Button
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg relative group">
                                        <div className="flex-grow grid grid-cols-3 gap-2">
                                            <FormField control={form.control} name={`btns.${index}.label`} render={({ field }) => (
                                                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name={`btns.${index}.link`} render={({ field }) => (
                                                <FormItem><FormLabel>URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name={`btns.${index}.variant`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Style</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="primary">Primary</SelectItem>
                                                            <SelectItem value="secondary">Secondary</SelectItem>
                                                            <SelectItem value="outline">Outline</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )} />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" form="cta-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

