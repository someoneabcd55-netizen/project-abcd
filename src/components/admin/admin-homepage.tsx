'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContent, CardFooter } from '@/components/ui/card';

import { getBlocksAdmin, deleteBlock, addBlock, reorderBlocks, updateBlock, type Block } from '@/firebase/services/blocks';
import { getPageBySlug, type Page } from '@/firebase/services/pages';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GripVertical, Edit, Trash2, Image as ImageIcon, Pilcrow, Film, Newspaper } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdminAnnouncements } from './admin-announcements';
import { AdminImageUploadField } from './admin-image-upload-field';

const heroBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  imageurl: z.string().url('A valid image URL is required'),
  primaryCtaLabel: z.string().optional(),
  primaryCtaUrl: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaUrl: z.string().optional(),
});

const textBlockSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

const imageBlockSchema = z.object({
    imageUrl: z.string().url('A valid image URL is required'),
    alt: z.string().min(1, 'Alt text is required'),
    height: z.string().default('60vh'),
});


function SortableBlockItem({ block, onEdit, onDelete, onToggleVisibility }: { block: Block, onEdit: () => void, onDelete: () => void, onToggleVisibility: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const getBlockPreview = () => {
    switch (block.type) {
        case 'hero':
            return <><Film className="h-4 w-4 mr-2 text-muted-foreground" /> Hero: {block.data.title}</>;
        case 'text':
            return <><Pilcrow className="h-4 w-4 mr-2 text-muted-foreground" /> Text: "{block.data.content?.substring(0, 30)}..."</>;
        case 'image':
            return <><ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" /> Image: {block.data.alt}</>;
        case 'announcements':
            return <><Newspaper className="h-4 w-4 mr-2 text-muted-foreground" /> Announcements: {block.data.title}</>;
        default:
            return `Unknown block: ${block.type}`;
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-grow text-sm truncate">{getBlockPreview()}</div>
      <div className="flex items-center">
        <Switch checked={block.visible} onCheckedChange={onToggleVisibility} />
        <Button variant="ghost" size="icon" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

function BlockEditorDialog({ block, open, onOpenChange, onUpdate }: { block: Block, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    let form: any;
    let FormFieldsComponent: React.FC<{form: any}> = () => null;

    if (block.type === 'hero') {
        form = useForm({ resolver: zodResolver(heroBlockSchema), defaultValues: block.data });
        FormFieldsComponent = ({form}) => (
            <>
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="subtitle" render={({ field }) => (
                    <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageurl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image</FormLabel>
                      <AdminImageUploadField
                        value={field.value}
                        onChange={field.onChange}
                        previewAlt={form.getValues('title') || 'Hero image preview'}
                        folder="college-portal/home/hero"
                      />
                      <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="primaryCtaLabel" render={({ field }) => (
                        <FormItem><FormLabel>Primary CTA Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="primaryCtaUrl" render={({ field }) => (
                        <FormItem><FormLabel>Primary CTA URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="secondaryCtaLabel" render={({ field }) => (
                        <FormItem><FormLabel>Secondary CTA Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="secondaryCtaUrl" render={({ field }) => (
                        <FormItem><FormLabel>Secondary CTA URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </>
        )
    } else if (block.type === 'text') {
        form = useForm({ resolver: zodResolver(textBlockSchema), defaultValues: block.data });
        FormFieldsComponent = ({form}) => (
             <>
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content (Markdown supported)</FormLabel><FormControl><Textarea className="min-h-[200px] font-mono" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </>
        )
    } else if (block.type === 'image') {
        form = useForm({ resolver: zodResolver(imageBlockSchema), defaultValues: block.data });
        FormFieldsComponent = ({form}) => (
             <>
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <AdminImageUploadField
                        value={field.value}
                        onChange={field.onChange}
                        previewAlt={form.getValues('alt') || 'Image block preview'}
                        folder="college-portal/home/image"
                      />
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="alt" render={({ field }) => (
                    <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </>
        )
    } else if (block.type === 'announcements') {
        return <AdminAnnouncements block={block} open={open} onOpenChange={onOpenChange} onUpdate={onUpdate} />;
    }

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            await updateBlock(block.id, { data });
            toast({ title: "Block saved!" });
            onUpdate();
            onOpenChange(false);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save block.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!form) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit {block.type} block</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-4">
                        <FormFieldsComponent form={form} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Block
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function AdminHomepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [homePage, setHomePage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deleteBlockConfirm, setDeleteBlockConfirm] = useState<Block | null>(null);
  const { toast } = useToast();
  
  const fetchPageAndBlocks = async () => {
    setIsLoading(true);
    const pageData = await getPageBySlug('home');
    if (pageData) {
      setHomePage(pageData);
      const blocksData = await getBlocksAdmin(pageData.id);
      setBlocks(blocksData);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find homepage data.' });
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchPageAndBlocks();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        const newBlockOrder = arrayMove(blocks, oldIndex, newIndex);
        setBlocks(newBlockOrder); // Optimistic update
        
        const reorderPayload = newBlockOrder.map((block, index) => ({ id: block.id, order_position: index }));
        try {
            await reorderBlocks(reorderPayload);
            toast({ title: 'Success', description: 'Block order saved.' });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save block order.' });
            setBlocks(blocks); // Revert on failure
        }
    }
  };

  const handleAddBlock = async (type: Block['type']) => {
    if (!homePage) return;

    const newOrder = blocks.length;
    let defaultData: any;
    switch(type) {
        case 'hero': defaultData = { title: 'New Hero Section', subtitle: 'A stunning hero section to grab attention', imageurl: 'https://picsum.photos/seed/1/1200/800', primaryCtaLabel: 'Learn More', primaryCtaUrl: '/about' }; break;
        case 'text': defaultData = { content: '## New Text Block\n\nStart writing your content here. **Markdown** is supported!' }; break;
        case 'image': defaultData = { imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/400`, alt: 'Placeholder image' }; break;
        case 'announcements': defaultData = { title: 'Announcements', limit: 3 }; break;
        default: return;
    }
    
    try {
        await addBlock({ page_id: homePage.id, type, order_position: newOrder, visible: true, data: defaultData });
        toast({ title: 'Success', description: `Added new ${type} block.` });
        fetchPageAndBlocks();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add block.' });
    }
  };

  const handleToggleBlockVisibility = async (block: Block) => {
      const newBlocks = blocks.map(b => b.id === block.id ? {...b, visible: !b.visible} : b);
      setBlocks(newBlocks); // Optimistic
      try {
        await updateBlock(block.id, { visible: !block.visible });
        toast({ title: 'Success', description: `Block is now ${!block.visible ? 'visible' : 'hidden'}.` });
      } catch (e) {
         toast({ variant: 'destructive', title: 'Error', description: 'Failed to update visibility.' });
         setBlocks(blocks); // Revert
      }
  };

  const handleDeleteBlock = async () => {
    if (!deleteBlockConfirm) return;
    try {
        await deleteBlock(deleteBlockConfirm.id);
        toast({title: "Block deleted"});
        setDeleteBlockConfirm(null);
        fetchPageAndBlocks();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete block.' });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <>
        <CardContent>
            <div className="mt-2 space-y-2 p-2 border rounded-md bg-muted/50 min-h-[100px]">
                    {isLoading ? (
                        <div className="flex flex-grow items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : (
                    <>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {blocks.map((block) => (
                            <SortableBlockItem 
                                key={block.id} 
                                block={block} 
                                onEdit={() => setEditingBlock(block)} 
                                onDelete={() => setDeleteBlockConfirm(block)}
                                onToggleVisibility={() => handleToggleBlockVisibility(block)}
                            />
                        ))}
                        </SortableContext>
                    </DndContext>
                    {blocks.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">This page has no content blocks yet.</p>}
                    </>
                    )}
            </div>
        </CardContent>
         <CardFooter className="border-t pt-6">
            <div className="flex items-center gap-4">
                 <h3 className="text-sm font-medium">Add New Block:</h3>
                <div className="flex gap-2 flex-wrap">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddBlock('hero')}><Film className="h-4 w-4 mr-2" />Hero</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddBlock('text')}><Pilcrow className="h-4 w-4 mr-2" />Text Block</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddBlock('image')}><ImageIcon className="h-4 w-4 mr-2" />Image Block</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddBlock('announcements')}><Newspaper className="h-4 w-4 mr-2" />Announcements</Button>
                </div>
            </div>
        </CardFooter>

        {editingBlock && (
            <BlockEditorDialog 
                block={editingBlock} 
                open={!!editingBlock} 
                onOpenChange={(isOpen) => !isOpen && setEditingBlock(null)}
                onUpdate={fetchPageAndBlocks}
            />
        )}
        <AlertDialog open={!!deleteBlockConfirm} onOpenChange={(isOpen) => !isOpen && setDeleteBlockConfirm(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete this content block.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBlock} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
