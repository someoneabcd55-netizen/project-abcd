'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContent, CardFooter } from '@/components/ui/card';

import { getBlocksAdmin, updatePageBlocks, type Block } from '@/firebase/services/blocks';
import { getPageBySlug, type Page } from '@/firebase/services/pages';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GripVertical, Edit, Trash2, Image as ImageIcon, Pilcrow, Film, Newspaper, MessageSquareQuote, HelpCircle, History, Activity, Zap, Users, PlayCircle, MapPin, Layout, Grid as GridIcon, Columns as ColumnsIcon, Bookmark, List, ChevronRight, Layers, Split, ImagePlus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { BlockEditorDialog } from './BlockEditorDialog';

function SortableBlockItem({ block, onEdit, onDelete, onToggleVisibility }: { block: Block, onEdit: () => void, onDelete: () => void, onToggleVisibility: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const getBlockPreview = () => {
    switch (block.type) {
        case 'hero':
            return <><Film className="h-4 w-4 mr-2 text-muted-foreground" /> Hero: {block.data.title}</>;
        case 'image-layout':
            return <><ImagePlus className="h-4 w-4 mr-2 text-muted-foreground" /> Image Layout: {block.data.layout}</>;
        case 'masonry-gallery':
            return <><GridIcon className="h-4 w-4 mr-2 text-muted-foreground" /> Masonry Gallery: {block.data.title}</>;
        case 'featured-gallery':
            return <><Layout className="h-4 w-4 mr-2 text-muted-foreground" /> Featured Gallery: {block.data.title}</>;
        case 'equal-grid-gallery':
            return <><GridIcon className="h-4 w-4 mr-2 text-muted-foreground" /> Grid Gallery: {block.data.title}</>;
        case 'horizontal-scroll-gallery':
            return <><ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" /> Scroll Gallery: {block.data.title}</>;
        case 'fullscreen-slideshow':
            return <><Film className="h-4 w-4 mr-2 text-muted-foreground" /> Slideshow</>;
        case 'video-gallery':
            return <><PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" /> Video Gallery: {block.data.title}</>;
        case 'gallery':
            return <><ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" /> Legacy Gallery: {block.data.title}</>;
        case 'heading':
            return <><Pilcrow className="h-4 w-4 mr-2 text-muted-foreground" /> Heading: {block.data.text}</>;
        default:
            return `${block.type} section`;
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

export function AdminGalleryBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [originalBlocks, setOriginalBlocks] = useState<Block[]>([]);
  const [galleryPage, setGalleryPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deleteBlockConfirm, setDeleteBlockConfirm] = useState<Block | null>(null);
  const { toast } = useToast();

  const fetchPageAndBlocks = async () => {
    setIsLoading(true);
    try {
      const pageData = await getPageBySlug('gallery');
      if (pageData) {
        setGalleryPage(pageData);
        const blocksData = await getBlocksAdmin(pageData.id);
        setBlocks(blocksData);
        setOriginalBlocks(JSON.parse(JSON.stringify(blocksData)));
        setHasChanges(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find gallery page data.' });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load page data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageAndBlocks();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        const newBlockOrder = arrayMove(blocks, oldIndex, newIndex);
        setBlocks(newBlockOrder);
        setHasChanges(true);
    }
  };

  const handleAddBlock = (type: string) => {
    if (!galleryPage) return;

    const newBlock: Block = {
        id: `temp-${uuidv4()}`,
        page_id: galleryPage.id,
        type: type as any,
        order_position: blocks.length,
        visible: true,
        data: getDefaultData(type)
    };
    
    setBlocks([...blocks, newBlock]);
    setHasChanges(true);
  };

  const handleToggleBlockVisibility = (block: Block) => {
      setBlocks(blocks.map(b => b.id === block.id ? {...b, visible: !b.visible} : b));
      setHasChanges(true);
  };

  const handleDeleteBlock = () => {
    if (!deleteBlockConfirm) return;
    setBlocks(blocks.filter(b => b.id !== deleteBlockConfirm.id));
    setDeleteBlockConfirm(null);
    setHasChanges(true);
  }

  const savePageStructure = async () => {
    if (!galleryPage) return;
    setIsSaving(true);
    try {
        await updatePageBlocks(galleryPage.id, blocks);
        toast({ title: 'Success', description: 'Gallery layout saved!' });
        fetchPageAndBlocks();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save changes.' });
    } finally {
        setIsSaving(false);
    }
  };

  const discardChanges = () => {
    setBlocks(JSON.parse(JSON.stringify(originalBlocks)));
    setHasChanges(false);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <>
        <div className="flex justify-between items-center mb-6 bg-muted/30 p-4 rounded-xl border">
            <div>
                <h2 className="text-xl font-bold">Gallery Page Layout</h2>
                <p className="text-sm text-muted-foreground">{blocks.length} sections on this page</p>
            </div>
            {hasChanges && (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={discardChanges} disabled={isSaving}>Discard</Button>
                    <Button size="sm" onClick={savePageStructure} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Layout
                    </Button>
                </div>
            )}
        </div>

        <CardContent>
            <div className="space-y-3 p-4 border-2 border-dashed rounded-2xl bg-background/50 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
                        {blocks.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                <p>No blocks added yet. Start by adding a Hero or Image Layout.</p>
                            </div>
                        )}
                    </>
                    )}
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-6 border-t pt-6">
            <div className="w-full">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/60 mb-4">Gallery Components</h3>
                <div className="flex gap-2 flex-wrap">
                    <BlockAdder type="hero" icon={<Film className="w-4 h-4" />} label="Hero" onClick={handleAddBlock} />
                    <BlockAdder type="masonry-gallery" icon={<GridIcon className="w-4 h-4" />} label="Masonry" onClick={handleAddBlock} />
                    <BlockAdder type="featured-gallery" icon={<Layout className="w-4 h-4" />} label="Featured" onClick={handleAddBlock} />
                    <BlockAdder type="equal-grid-gallery" icon={<GridIcon className="w-4 h-4" />} label="Eq Grid" onClick={handleAddBlock} />
                    <BlockAdder type="horizontal-scroll-gallery" icon={<ChevronRight className="w-4 h-4" />} label="Scroll" onClick={handleAddBlock} />
                    <BlockAdder type="fullscreen-slideshow" icon={<Film className="w-4 h-4" />} label="Slideshow" onClick={handleAddBlock} />
                    <BlockAdder type="video-gallery" icon={<PlayCircle className="w-4 h-4" />} label="Video Gal" onClick={handleAddBlock} />
                    <BlockAdder type="image-layout" icon={<ImagePlus className="w-4 h-4" />} label="Mosaic/Bento" onClick={handleAddBlock} />
                    <BlockAdder type="gallery" icon={<ImageIcon className="w-4 h-4" />} label="Filterable Gallery" onClick={handleAddBlock} />
                    <BlockAdder type="heading" icon={<Pilcrow className="w-4 h-4" />} label="Heading" onClick={handleAddBlock} />
                    <BlockAdder type="paragraph" icon={<List className="w-4 h-4" />} label="Text" onClick={handleAddBlock} />
                    <BlockAdder type="section" icon={<Layers className="w-4 h-4" />} label="Section Wrap" onClick={handleAddBlock} />
                </div>
            </div>
        </CardFooter>

        {editingBlock && (
            <BlockEditorDialog 
                block={editingBlock} 
                open={!!editingBlock} 
                onOpenChange={(isOpen) => !isOpen && setEditingBlock(null)}
                onUpdate={(updatedData) => {
                    if (updatedData) {
                        setBlocks(blocks.map(b => b.id === editingBlock.id ? {...b, data: updatedData} : b));
                        setHasChanges(true);
                    } else {
                        fetchPageAndBlocks();
                    }
                }}
            />
        )}
        <AlertDialog open={!!deleteBlockConfirm} onOpenChange={(isOpen) => !isOpen && setDeleteBlockConfirm(null)}>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Remove Block?</AlertDialogTitle><AlertDialogDescription>This will remove this section from your gallery page.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteBlock} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

function BlockAdder({ icon, label, onClick, type }: { icon: React.ReactNode, label: string, onClick: (type: string) => void, type: string }) {
    return (
        <Button type="button" variant="outline" size="sm" onClick={() => onClick(type)} className="hover:bg-primary/5 transition-all">
            <span className="mr-2 text-primary/60">{icon}</span>
            {label}
        </Button>
    )
}

function getDefaultData(type: string) {
    switch(type) {
        case 'hero': return { title: 'Our Campus Gallery', subtitle: 'Explore our vibrant life', backgroundType: 'image', backgroundValue: 'https://picsum.photos/seed/g/1200/800', layout: 'centered' };
        case 'image-layout': return { title: 'Life at Campus', layout: 'mosaic', items: [{imageUrl: 'https://picsum.photos/seed/m1/800/800'}] };
        case 'masonry-gallery': return { title: 'Masonry Gallery', columns: 3, mediaType: 'images', items: [{ mediaUrl: 'https://picsum.photos/seed/m1/800/1000', mediaType: 'image', category: 'Category' }] };
        case 'featured-gallery': return { title: 'Featured Gallery', featuredItem: { mediaUrl: 'https://picsum.photos/seed/f1/1200/800', mediaType: 'image', title: 'Main Story' }, gridItems: [{ mediaUrl: 'https://picsum.photos/seed/f2/600/600', mediaType: 'image' }] };
        case 'equal-grid-gallery': return { title: 'Grid Gallery', columns: 3, aspectRatio: '1:1', items: [{ mediaUrl: 'https://picsum.photos/seed/e1/800/800', mediaType: 'image' }] };
        case 'horizontal-scroll-gallery': return { title: 'Scroll Gallery', items: [{ mediaUrl: 'https://picsum.photos/seed/s1/800/600', mediaType: 'image' }] };
        case 'fullscreen-slideshow': return { height: '75vh', items: [{ mediaUrl: 'https://picsum.photos/seed/sl1/1920/1080', mediaType: 'image', overlayTitle: 'Hero Slide' }] };
        case 'video-gallery': return { title: 'Video Gallery', columns: 3, items: [{ videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Featured Video' }] };
        case 'gallery': return { title: 'Photo Collection', items: [] };
        case 'heading': return { text: 'New Section', size: 'h2', alignment: 'center' };
        case 'paragraph': return { content: '' };
        case 'section': return { childBlocks: [] };
        default: return {};
    }
}
