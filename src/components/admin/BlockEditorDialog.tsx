'use client';

import React, { useState, useEffect } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { componentMap } from '@/components/blocks/blockRegistry';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, Layers } from 'lucide-react';
import { blockSchemas } from '@/lib/blocks';
import { AdminRecursiveEditor } from './AdminRecursiveEditor';
import { updateBlock } from '@/firebase/services/blocks';
import { useToast } from '@/hooks/use-toast';
import { AdminImageUploadField } from './admin-image-upload-field';
import { AdminTagInput } from './admin-tag-input';

interface BlockEditorDialogProps {
  block: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedData?: any) => void;
  isNested?: boolean;
}

const getDefaultValues = (type: string, existingData: any) => {
  const defaults: Record<string, any> = {
    hero: { title: '', subtitle: '', backgroundType: 'image', backgroundValue: '', layout: 'centered', buttons: [], titleAccentWords: [] },
    heading: { text: '', size: 'h2', alignment: 'center' },
    paragraph: { content: '', alignment: 'left' },
    text: { content: '', alignment: 'left' },
    image: { src: '', alt: '', width: 'large', alignment: 'center' },
    video: { videoUrl: '', title: '', subtitle: '' },
    faq: { title: 'FAQ', items: [] },
    timeline: { title: 'History', items: [] },
    cards: { title: 'Features', items: [] },
    gallery: { title: 'Gallery', items: [] },
    announcements: { title: 'Announcements', announcements: [] },
    'stats-expanded': { title: 'Stats', items: [] },
    'cta-banner': { heading: 'Ready to join?', subtext: '', btns: [] },
    'team-showcase': { title: 'Our Team', items: [] },
    'video-embed': { title: 'Featured Video', videoUrl: '', thumbnailUrl: '' },
    'map-location': { title: 'Our Location', address: '', email: '', phone: '' },
    container: { childBlocks: [] },
    grid: { columns: 3, childBlocks: [] },
    columns: { leftBlocks: [], rightBlocks: [] },
    tabs: { tabs: [] },
    section: { childBlocks: [] },
    carousel: { slides: [] },
    accordion: { items: [] },
    split: { split: '50/50', gap: 'md', leftBlocks: [], rightBlocks: [] },
    'image-layout': { title: '', layout: 'mosaic', items: [] },
    'map-location': { title: 'Our Location', address: '', email: '', phone: '' },
    'masonry-gallery': { title: 'Our Gallery', columns: 3, mediaType: 'images', items: [], filterOptions: [] },
    'featured-gallery': { title: 'Featured Collection', featuredItem: { mediaUrl: '', mediaType: 'image' }, gridItems: [], gridColumns: 2, mediaType: 'images' },
    'equal-grid-gallery': { title: 'Gallery Grid', columns: 3, aspectRatio: '1:1', hoverStyle: 'overlay', items: [] },
    'horizontal-scroll-gallery': { title: 'Filmstrip Gallery', itemWidth: 'md', itemHeight: 'md', items: [] },
    'fullscreen-slideshow': { height: '75vh', autoplay: true, autoplayDelay: 5000, transition: 'fade', items: [] },
    'video-gallery': { title: 'Video Gallery', columns: 3, videoSource: 'mixed', items: [] },
  };

  return { ...(defaults[type] || {}), ...(existingData || {}) };
};

export function BlockEditorDialog({ block, open, onOpenChange, onUpdate, isNested = false }: BlockEditorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNestedBlock, setEditingNestedBlock] = useState<{block: any, index: number, fieldName: string} | null>(null);
  const { toast } = useToast();

  // Generate a unique form ID for this specific dialog instance
  const formId = React.useMemo(() => `form-${block.id || 'nested'}-${Math.random().toString(36).substr(2, 9)}`, [block.id]);

  const schema = blockSchemas[block.type] || z.any();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(block.type, block.data)
  });

  // Reset form when block changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(block.type, block.data));
    }
  }, [block, open, form]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // We always delegate the update to the parent component
      // This supports the draft-to-save workflow correctly.
      onUpdate(values);
      onOpenChange(false);
    } catch(e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to apply changes.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNested = (updatedData: any) => {
    if (!editingNestedBlock) return;
    
    const { fieldName, index } = editingNestedBlock;
    const currentBlocks = form.getValues(fieldName as any) || [];
    const newBlocks = [...currentBlocks];
    newBlocks[index] = { ...newBlocks[index], data: updatedData };
    
    form.setValue(fieldName as any, newBlocks as any, { shouldDirty: true });
    setEditingNestedBlock(null);
    toast({ title: 'Changes applied', description: 'Changes kept in draft. Save page structure to make permanent.' });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm uppercase tracking-wider">{block.type}</span>
              Edit Block Content
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form 
              id={formId} 
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error('Form Validation Errors:', JSON.stringify(errors, null, 2));
                toast({ 
                  variant: 'destructive', 
                  title: 'Validation Error', 
                  description: 'Please check the form for missing or invalid fields. Check console for details.' 
                });
              })} 
              className="space-y-8 py-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RenderFields 
                  type={block.type} 
                  form={form} 
                  onEditNested={(nb, idx, field) => setEditingNestedBlock({block: nb, index: idx, fieldName: field})} 
                />
              </div>
            </form>
          </Form>

          <DialogFooter className="sticky bottom-0 bg-background pt-6 border-t mt-8">
            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
            <Button type="submit" form={formId} disabled={isSubmitting} className="px-8">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNested ? 'Apply Changes' : 'Save Block Settings'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingNestedBlock && (
        <BlockEditorDialog 
          block={editingNestedBlock.block}
          open={!!editingNestedBlock}
          onOpenChange={(isOpen) => !isOpen && setEditingNestedBlock(null)}
          onUpdate={handleSaveNested}
          isNested={true}
        />
      )}
    </>
  );
}

function RenderFields({ type, form, onEditNested }: { type: string, form: any, onEditNested: (block: any, index: number, field: string) => void }) {
  const { control, getValues, setValue, watch } = form;

  const renderRecursiveField = (name: string, label: string) => (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem className="col-span-2 p-6 border-2 border-dashed rounded-2xl bg-muted/20">
        <FormLabel className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-primary" /> {label}
        </FormLabel>
        <AdminRecursiveEditor 
          blocks={field.value || []} 
          onChange={field.onChange} 
          onEditBlock={(block, _) => {
            const index = (field.value || []).findIndex((b: any) => b.id === block.id);
            onEditNested(block, index, name);
          }}
        />
      </FormItem>
    )} />
  );

  const renderListEditor = (name: string, label: string, itemFields: (index: number) => React.ReactNode, defaultItem: any = {}) => {
    const items = watch(name) || [];
    return (
      <div className="col-span-2 space-y-4">
        <FormLabel className="text-lg font-bold flex justify-between items-center">
          {label}
          <Button type="button" size="sm" variant="outline" onClick={() => setValue(name, [...items, defaultItem])}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </FormLabel>
        <div className="space-y-4">
          {items.map((item: any, index: number) => (
            <div key={index} className="p-4 border rounded-xl bg-background shadow-sm space-y-4 relative">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive" 
                onClick={() => setValue(name, items.filter((_: any, i: number) => i !== index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemFields(index)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* --- CONTENT BLOCKS --- */}
      {type === 'hero' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Main Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="subtitle" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="backgroundType" render={({ field }) => (
            <FormItem><FormLabel>Background Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem><SelectItem value="gradient">Gradient</SelectItem><SelectItem value="solid">Solid</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="backgroundValue" render={({ field }) => (
            <FormItem>
              <FormLabel>Background Value</FormLabel>
              {getValues('backgroundType') === 'image' ? (
                <AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Hero" folder="hero" />
              ) : <FormControl><Input {...field} value={field.value || ''} /></FormControl>}
            </FormItem>
          )} />
        </>
      )}

      {type === 'heading' && (
        <>
          <FormField control={control} name="text" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="size" render={({ field }) => (
            <FormItem><FormLabel>Size</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="h1">H1</SelectItem><SelectItem value="h2">H2</SelectItem><SelectItem value="h3">H3</SelectItem><SelectItem value="h4">H4</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="alignment" render={({ field }) => (
            <FormItem><FormLabel>Alignment</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="left">Left</SelectItem><SelectItem value="center">Center</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent></Select></FormItem>
          )} />
        </>
      )}

      {type === 'image' && (
        <>
          <FormField control={control} name="src" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Image</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Image" folder="content" /></FormItem>
          )} />
          <FormField control={control} name="alt" render={({ field }) => (
            <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="width" render={({ field }) => (
            <FormItem><FormLabel>Width</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="full">Full</SelectItem><SelectItem value="large">Large</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="small">Small</SelectItem></SelectContent></Select></FormItem>
          )} />
        </>
      )}

      {type === 'faq' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>FAQ Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'FAQ Items', (i) => (
            <>
              <FormField control={control} name={`items.${i}.question`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Question</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.answer`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { question: '', answer: '' })}
        </>
      )}

      {type === 'timeline' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Timeline Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Timeline Events', (i) => (
            <>
              <FormField control={control} name={`items.${i}.year`} render={({ field }) => (
                <FormItem><FormLabel>Year/Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.description`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { year: '', title: '', description: '' })}
        </>
      )}

      {type === 'cards' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Cards', (i) => (
            <>
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Card Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.badgeLabel`} render={({ field }) => (
                <FormItem><FormLabel>Badge</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.imageUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Card Image</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Card" folder="cards" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.description`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { title: '', badgeLabel: '', imageUrl: '', description: '' })}
        </>
      )}

      {type === 'gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Gallery Images', (i) => (
            <>
              <FormField control={control} name={`items.${i}.imageUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Image</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Gallery" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.category`} render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { imageUrl: '', title: '', category: '' })}
        </>
      )}

      {type === 'announcements' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Section Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          {renderListEditor('announcements', 'Announcements', (i) => (
            <>
              <FormField control={control} name={`announcements.${i}.title`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Announcement Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`announcements.${i}.date`} render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`announcements.${i}.description`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl></FormItem>
              )} />
            </>
          ), { title: '', date: new Date().toISOString().split('T')[0], description: '' })}
        </>
      )}

      {type === 'stats-expanded' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Stat Items', (i) => (
            <>
              <FormField control={control} name={`items.${i}.number`} render={({ field }) => (
                <FormItem><FormLabel>Number (e.g. 100+)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.label`} render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.iconName`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Lucide Icon Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { number: '', label: '', iconName: 'Zap' })}
        </>
      )}

      {type === 'cta-banner' && (
        <>
          <FormField control={control} name="heading" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="subtext" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Subtext</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="bgType" render={({ field }) => (
            <FormItem><FormLabel>Background Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="solid">Solid</SelectItem><SelectItem value="gradient">Gradient</SelectItem><SelectItem value="image">Image</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="bgValue" render={({ field }) => (
            <FormItem><FormLabel>Background Value (Color/URL)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          {renderListEditor('btns', 'Buttons', (i) => (
            <>
              <FormField control={control} name={`btns.${i}.label`} render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`btns.${i}.link`} render={({ field }) => (
                <FormItem><FormLabel>Link</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { label: '', link: '', variant: 'primary' })}
        </>
      )}

      {type === 'team-showcase' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Team Members', (i) => (
            <>
              <FormField control={control} name={`items.${i}.name`} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.designation`} render={({ field }) => (
                <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.photoUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Photo URL</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Member" folder="team" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.email`} render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.department`} render={({ field }) => (
                <FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="col-span-2">
                <FormLabel>Areas of Expertise</FormLabel>
                <FormField control={control} name={`items.${i}.expertise`} render={({ field }) => (
                  <AdminTagInput 
                    value={field.value || []} 
                    onChange={field.onChange} 
                  />
                )} />
              </div>
              <FormField control={control} name={`items.${i}.bio`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { name: '', designation: '', photoUrl: '', bio: '', email: '', department: '' })}
        </>
      )}

      {type === 'video-embed' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="videoUrl" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Embed URL (YouTube/Vimeo)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="thumbnailUrl" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Thumbnail Image</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Video" folder="video" /></FormItem>
          )} />
        </>
      )}

      {type === 'map-location' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="address" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="embedUrl" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Google Maps Embed URL</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
        </>
      )}

      {/* --- LAYOUT BLOCKS --- */}
      {['container', 'grid', 'section'].includes(type) && renderRecursiveField('childBlocks', 'Nested Blocks')}

      {type === 'columns' && (
        <>
          {renderRecursiveField('leftBlocks', 'Left Column Content')}
          {renderRecursiveField('rightBlocks', 'Right Column Content')}
        </>
      )}

      {type === 'tabs' && renderListEditor('tabs', 'Tabs', (i) => (
        <>
          <FormField control={control} name={`tabs.${i}.label`} render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Tab Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name={`tabs.${i}.childBlocks`} render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Tab Content (Blocks)</FormLabel>
              <AdminRecursiveEditor 
                blocks={field.value || []} 
                onChange={field.onChange} 
                onEditBlock={(block, _) => {
                  const index = (field.value || []).findIndex((b: any) => b.id === block.id);
                  onEditNested(block, index, `tabs.${i}.childBlocks`);
                }}
              />
            </FormItem>
          )} />
        </>
      ), { label: '', childBlocks: [] })}

      {type === 'accordion' && renderListEditor('items', 'Accordion Items', (i) => (
        <>
          <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name={`items.${i}.childBlocks`} render={({ field }) => (
            <FormItem className="col-span-2">
               <FormLabel>Content Blocks</FormLabel>
               <AdminRecursiveEditor 
                 blocks={field.value || []} 
                 onChange={field.onChange} 
                 onEditBlock={(block, _) => {
                   const index = (field.value || []).findIndex((b: any) => b.id === block.id);
                   onEditNested(block, index, `items.${i}.childBlocks`);
                 }}
               />
            </FormItem>
          )} />
        </>
      ), { title: '', childBlocks: [] })}

      {type === 'carousel' && renderListEditor('slides', 'Slides', (i) => (
        <FormField control={control} name={`slides.${i}.childBlocks`} render={({ field }) => (
          <FormItem className="col-span-2">
             <FormLabel>Slide Content</FormLabel>
             <AdminRecursiveEditor 
               blocks={field.value || []} 
               onChange={field.onChange} 
               onEditBlock={(block, _) => {
                 const index = (field.value || []).findIndex((b: any) => b.id === block.id);
                 onEditNested(block, index, `slides.${i}.childBlocks`);
               }}
             />
          </FormItem>
        )} />
      ), { childBlocks: [] })}

      {type === 'split' && (
        <>
          <FormField control={control} name="split" render={({ field }) => (
            <FormItem><FormLabel>Split Ratio</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="50/50">50/50</SelectItem><SelectItem value="40/60">40/60</SelectItem><SelectItem value="60/40">60/40</SelectItem><SelectItem value="33/67">33/67</SelectItem><SelectItem value="67/33">67/33</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="gap" render={({ field }) => (
            <FormItem><FormLabel>Gap Size</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="sm">Small</SelectItem><SelectItem value="md">Medium</SelectItem><SelectItem value="lg">Large</SelectItem><SelectItem value="xl">Extra Large</SelectItem></SelectContent></Select></FormItem>
          )} />
          {renderRecursiveField('leftBlocks', 'Left Column Content')}
          {renderRecursiveField('rightBlocks', 'Right Column Content')}
        </>
      )}

      {type === 'announcements' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Section Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          {renderListEditor('announcements', 'Announcements', (i) => (
            <>
              <FormField control={control} name={`announcements.${i}.title`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`announcements.${i}.date`} render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`announcements.${i}.description`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>
              )} />
            </>
          ), { title: '', date: '', description: '' })}
        </>
      )}

      {type === 'stats-expanded' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          {renderListEditor('items', 'Stats', (i) => (
            <>
              <FormField control={control} name={`items.${i}.number`} render={({ field }) => (
                <FormItem><FormLabel>Number/Value</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.label`} render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.iconName`} render={({ field }) => (
                <FormItem><FormLabel>Icon Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { number: '', label: '', iconName: 'Zap' })}
        </>
      )}

      {type === 'cta-banner' && (
        <>
          <FormField control={control} name="heading" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="subtext" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Subtext</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl></FormItem>
          )} />
          {renderListEditor('btns', 'Buttons', (i) => (
            <>
              <FormField control={control} name={`btns.${i}.label`} render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`btns.${i}.link`} render={({ field }) => (
                <FormItem><FormLabel>Link URL</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`btns.${i}.variant`} render={({ field }) => (
                <FormItem><FormLabel>Variant</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="primary">Primary</SelectItem><SelectItem value="secondary">Secondary</SelectItem><SelectItem value="outline">Outline</SelectItem></SelectContent></Select></FormItem>
              )} />
            </>
          ), { label: '', link: '', variant: 'primary' })}
        </>
      )}

      {type === 'image-layout' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Section Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="layout" render={({ field }) => (
            <FormItem><FormLabel>Layout Style</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="mosaic">Mosaic</SelectItem><SelectItem value="bento">Bento Grid</SelectItem><SelectItem value="overlap">Creative Overlap</SelectItem><SelectItem value="stack">Stack</SelectItem></SelectContent></Select></FormItem>
          )} />
          {renderListEditor('items', 'Layout Images', (i) => (
            <>
              <FormField control={control} name={`items.${i}.imageUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Image</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Layout Image" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.description`} render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          ), { imageUrl: '', title: '', description: '' })}
        </>
      )}

      {type === 'masonry-gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="subtitle" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="columns" render={({ field }) => (
            <FormItem><FormLabel>Columns (Desktop)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value))} value={field.value ?? ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="mediaType" render={({ field }) => (
            <FormItem><FormLabel>Allowed Media</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="images">Images Only</SelectItem><SelectItem value="videos">Videos Only</SelectItem><SelectItem value="mixed">Mixed</SelectItem></SelectContent></Select></FormItem>
          )} />
          {renderListEditor('items', 'Gallery Items', (i) => (
            <>
              <FormField control={control} name={`items.${i}.mediaType`} render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.mediaUrl`} render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Media URL</FormLabel>
                  <AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Media" folder="gallery" />
                </FormItem>
              )} />
              <FormField control={control} name={`items.${i}.category`} render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { mediaUrl: '', mediaType: 'image', category: '', title: '' })}
        </>
      )}

      {type === 'featured-gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <div className="col-span-2 p-6 border rounded-3xl bg-primary/5 space-y-4">
            <h4 className="font-bold">Featured Main Item</h4>
            <FormField control={control} name="featuredItem.mediaUrl" render={({ field }) => (
              <FormItem><FormLabel>Media</FormLabel><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Featured" folder="gallery" /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={control} name="featuredItem.title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name="featuredItem.category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </div>
          </div>
          {renderListEditor('gridItems', 'Supporting Grid Items', (i) => (
            <>
              <FormField control={control} name={`gridItems.${i}.mediaUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Grid Item" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`gridItems.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`gridItems.${i}.category`} render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { mediaUrl: '', mediaType: 'image', category: '', title: '' })}
        </>
      )}

      {type === 'equal-grid-gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="aspectRatio" render={({ field }) => (
            <FormItem><FormLabel>Aspect Ratio</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="1:1">1:1 Square</SelectItem><SelectItem value="4:3">4:3 Photo</SelectItem><SelectItem value="16:9">16:9 Video</SelectItem><SelectItem value="3:2">3:2 Standard</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="hoverStyle" render={({ field }) => (
            <FormItem><FormLabel>Hover Animation</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="overlay">Dark Overlay</SelectItem><SelectItem value="lift">Card Lift</SelectItem><SelectItem value="zoom">Inner Zoom</SelectItem><SelectItem value="border-glow">Border Glow</SelectItem></SelectContent></Select></FormItem>
          )} />
          {renderListEditor('items', 'Grid Media', (i) => (
            <>
              <FormField control={control} name={`items.${i}.mediaUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Grid" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { mediaUrl: '', mediaType: 'image', title: '' })}
        </>
      )}

      {type === 'horizontal-scroll-gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="itemWidth" render={({ field }) => (
            <FormItem><FormLabel>Item Width</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="sm">Small</SelectItem><SelectItem value="md">Medium</SelectItem><SelectItem value="lg">Large</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="autoScroll" render={({ field }) => (
            <FormItem><FormLabel>Auto Scroll</FormLabel><Select onValueChange={v => field.onChange(v === 'true')} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="true">Enabled</SelectItem><SelectItem value="false">Disabled</SelectItem></SelectContent></Select></FormItem>
          )} />
          {renderListEditor('items', 'Scroll Items', (i) => (
            <>
              <FormField control={control} name={`items.${i}.mediaUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Scroll" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { mediaUrl: '', mediaType: 'image', title: '' })}
        </>
      )}

      {type === 'fullscreen-slideshow' && (
        <>
          <FormField control={control} name="height" render={({ field }) => (
            <FormItem><FormLabel>Section Height</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="50vh">Half Screen (50vh)</SelectItem><SelectItem value="75vh">Three Quarters (75vh)</SelectItem><SelectItem value="100vh">Full Screen (100vh)</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="transition" render={({ field }) => (
            <FormItem><FormLabel>Transition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="fade">Smooth Fade</SelectItem><SelectItem value="slide">Horizontal Slide</SelectItem><SelectItem value="zoom">Immersive Zoom</SelectItem></SelectContent></Select></FormItem>
          )} />
          <FormField control={control} name="autoplayDelay" render={({ field }) => (
            <FormItem><FormLabel>Autoplay Delay (ms)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value))} value={field.value ?? 5000} /></FormControl></FormItem>
          )} />
          {renderListEditor('items', 'Slides', (i) => (
            <>
              <FormField control={control} name={`items.${i}.mediaUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><AdminImageUploadField value={field.value} onChange={field.onChange} previewAlt="Slide" folder="gallery" /></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.overlayTitle`} render={({ field }) => (
                <FormItem><FormLabel>Overlay Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.overlaySubtitle`} render={({ field }) => (
                <FormItem><FormLabel>Overlay Subtitle</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { mediaUrl: '', mediaType: 'image', overlayTitle: '', overlaySubtitle: '' })}
        </>
      )}

      {type === 'video-gallery' && (
        <>
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Gallery Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={control} name="columns" render={({ field }) => (
            <FormItem><FormLabel>Columns</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value))} value={field.value ?? ''} /></FormControl></FormItem>
          )} />
          {renderListEditor('items', 'Videos', (i) => (
            <>
              <FormField control={control} name={`items.${i}.videoUrl`} render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Video URL (YouTube/Vimeo)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
              <FormField control={control} name={`items.${i}.duration`} render={({ field }) => (
                <FormItem><FormLabel>Duration (e.g. 05:20)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
              )} />
            </>
          ), { videoUrl: '', title: '', duration: '' })}
        </>
      )}

      {/* Basic text fallback */}
      {['paragraph', 'text'].includes(type) && (
        <FormField control={control} name="content" render={({ field }) => (
          <FormItem className="col-span-2"><FormLabel>Text Content</FormLabel><FormControl><Textarea {...field} rows={8} /></FormControl><FormMessage /></FormItem>
        )} />
      )}
    </>
  );
}
