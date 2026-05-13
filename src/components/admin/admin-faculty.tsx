'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContent, CardFooter } from '@/components/ui/card';

import { getBlocksAdmin, updatePageBlocks, type Block } from '@/firebase/services/blocks';
import { getPageBySlug, type Page } from '@/firebase/services/pages';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, GripVertical, Edit, Trash2, Image as ImageIcon, 
  Pilcrow, Film, Newspaper, MessageSquareQuote, HelpCircle, 
  History, Activity, Zap, Users, PlayCircle, MapPin, Layout, 
  Grid as GridIcon, Columns as ColumnsIcon, Bookmark, List, 
  ChevronRight, Layers, Split 
} from 'lucide-react';
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
        case 'text':
        case 'paragraph':
            return <><Pilcrow className="h-4 w-4 mr-2 text-muted-foreground" /> Text: "{block.data.content?.substring(0, 30)}..."</>;
        case 'image':
            return <><ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" /> Image: {block.data.alt}</>;
        case 'announcements':
            return <><Newspaper className="h-4 w-4 mr-2 text-muted-foreground" /> Announcements: {block.data.title}</>;
        case 'faq':
            return <><HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" /> FAQ: {block.data.title}</>;
        case 'timeline':
            return <><History className="h-4 w-4 mr-2 text-muted-foreground" /> Timeline: {block.data.title}</>;
        case 'stats-expanded':
            return <><Activity className="h-4 w-4 mr-2 text-muted-foreground" /> Stats: {block.data.title}</>;
        case 'cta-banner':
            return <><Zap className="h-4 w-4 mr-2 text-muted-foreground" /> CTA Banner: {block.data.heading}</>;
        case 'team-showcase':
            return <><Users className="h-4 w-4 mr-2 text-muted-foreground" /> Team: {block.data.title}</>;
        case 'video-embed':
            return <><PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" /> Video: {block.data.title}</>;
        case 'map-location':
            return <><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> Map: {block.data.title}</>;
        case 'container':
            return <><Layout className="h-4 w-4 mr-2 text-muted-foreground" /> Container: {block.data.childBlocks?.length || 0} blocks</>;
        case 'section':
            return <><Layers className="h-4 w-4 mr-2 text-muted-foreground" /> Section: {block.data.childBlocks?.length || 0} blocks</>;
        default:
            return <><Bookmark className="h-4 w-4 mr-2 text-muted-foreground" /> {block.type.toUpperCase()}</>;
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-grow text-sm truncate font-medium">{getBlockPreview()}</div>
      <div className="flex items-center gap-1">
        <Switch checked={block.visible} onCheckedChange={onToggleVisibility} />
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

export function AdminFaculty() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [originalBlocks, setOriginalBlocks] = useState<Block[]>([]);
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deleteBlockConfirm, setDeleteBlockConfirm] = useState<Block | null>(null);
  const { toast } = useToast();

  const fetchPageAndBlocks = async () => {
    setIsLoading(true);
    try {
      const pageData = await getPageBySlug('faculty');
      if (pageData) {
        setPage(pageData);
        const blocksData = await getBlocksAdmin(pageData.id);
        setBlocks(blocksData);
        setOriginalBlocks(JSON.parse(JSON.stringify(blocksData)));
        setHasChanges(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find faculty page data.' });
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
    if (!page) return;

    const newBlock: Block = {
        id: `temp-${uuidv4()}`,
        page_id: page.id,
        type: type as any,
        order_position: blocks.length,
        visible: true,
        data: getDefaultData(type)
    };
    
    setBlocks([...blocks, newBlock]);
    setHasChanges(true);
    toast({ title: 'Block added locally', description: 'Save changes to make it permanent.' });
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
    if (!page) return;
    setIsSaving(true);
    try {
        await updatePageBlocks(page.id, blocks);
        toast({ title: 'Success', description: 'Page structure saved!' });
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
    toast({ title: 'Changes discarded' });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <>
        <div className="flex justify-between items-center mb-6 bg-muted/30 p-4 rounded-xl border">
            <div>
                <h2 className="text-xl font-bold text-primary">Faculty Page Blocks</h2>
                <p className="text-sm text-muted-foreground">{blocks.length} sections on this page</p>
            </div>
            {hasChanges && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                    <Button variant="ghost" size="sm" onClick={discardChanges} disabled={isSaving}>Discard</Button>
                    <Button size="sm" onClick={savePageStructure} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Page Structure
                    </Button>
                </div>
            )}
        </div>

        <CardContent>
            <div className="space-y-3 p-4 border-2 border-dashed rounded-2xl bg-background/50 min-h-[200px] transition-all">
                    {isLoading ? (
                        <div className="flex flex-grow items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
                        <div className="text-center py-12">
                            <Layers className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-sm text-muted-foreground">This page is empty. Use the buttons below to add content.</p>
                        </div>
                    )}
                    </>
                    )}
            </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-6 border-t pt-6">
            <div className="w-full">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/60 mb-4">Content Blocks</h3>
                <div className="flex gap-2 flex-wrap">
                    <BlockAdder type="hero" icon={<Film className="w-4 h-4" />} label="Hero" onClick={handleAddBlock} />
                    <BlockAdder type="heading" icon={<Pilcrow className="w-4 h-4" />} label="Heading" onClick={handleAddBlock} />
                    <BlockAdder type="paragraph" icon={<Pilcrow className="w-4 h-4" />} label="Paragraph" onClick={handleAddBlock} />
                    <BlockAdder type="image" icon={<ImageIcon className="w-4 h-4" />} label="Image" onClick={handleAddBlock} />
                    <BlockAdder type="video" icon={<PlayCircle className="w-4 h-4" />} label="Video" onClick={handleAddBlock} />
                    <BlockAdder type="quote" icon={<MessageSquareQuote className="w-4 h-4" />} label="Quote" onClick={handleAddBlock} />
                    <BlockAdder type="faq" icon={<HelpCircle className="w-4 h-4" />} label="FAQ" onClick={handleAddBlock} />
                    <BlockAdder type="timeline" icon={<History className="w-4 h-4" />} label="Timeline" onClick={handleAddBlock} />
                    <BlockAdder type="cards" icon={<Layout className="w-4 h-4" />} label="Cards" onClick={handleAddBlock} />
                    <BlockAdder type="gallery" icon={<ImageIcon className="w-4 h-4" />} label="Gallery" onClick={handleAddBlock} />
                    <BlockAdder type="table" icon={<List className="w-4 h-4" />} label="Table" onClick={handleAddBlock} />
                    <BlockAdder type="stats" icon={<Activity className="w-4 h-4" />} label="Stats" onClick={handleAddBlock} />
                </div>
            </div>

            <div className="w-full">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/60 mb-4">Layout Blocks</h3>
                <div className="flex gap-2 flex-wrap">
                    <BlockAdder type="container" icon={<Layout className="w-4 h-4" />} label="Container" onClick={handleAddBlock} />
                    <BlockAdder type="grid" icon={<GridIcon className="w-4 h-4" />} label="Grid" onClick={handleAddBlock} />
                    <BlockAdder type="columns" icon={<ColumnsIcon className="w-4 h-4" />} label="Columns" onClick={handleAddBlock} />
                    <BlockAdder type="tabs" icon={<Bookmark className="w-4 h-4" />} label="Tabs" onClick={handleAddBlock} />
                    <BlockAdder type="accordion" icon={<List className="w-4 h-4" />} label="Accordion" onClick={handleAddBlock} />
                    <BlockAdder type="carousel" icon={<ChevronRight className="w-4 h-4" />} label="Carousel" onClick={handleAddBlock} />
                    <BlockAdder type="section" icon={<Layers className="w-4 h-4" />} label="Section" onClick={handleAddBlock} />
                    <BlockAdder type="split" icon={<Split className="w-4 h-4" />} label="Split" onClick={handleAddBlock} />
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
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will remove this block from the faculty page. This cannot be undone once the page structure is saved.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBlock} className="bg-destructive hover:bg-destructive/90">Remove Block</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

function BlockAdder({ icon, label, onClick, type }: { icon: React.ReactNode, label: string, onClick: (type: string) => void, type: string }) {
    return (
        <Button type="button" variant="outline" size="sm" onClick={() => onClick(type)} className="hover:bg-primary/5 hover:border-primary/30 transition-all font-medium">
            <span className="mr-2 text-primary/60">{icon}</span>
            {label}
        </Button>
    )
}

function getDefaultData(type: string) {
    switch(type) {
        case 'hero': return { title: 'Faculty & Educators', subtitle: 'Meet the brilliant minds shaping our students future', backgroundType: 'image', backgroundValue: 'https://images.unsplash.com/photo-1524178232363-1fb280d91f39?auto=format&fit=crop&q=80', layout: 'centered' };
        case 'heading': return { text: 'Academic Departments', size: 'h2', alignment: 'center' };
        case 'paragraph': return { content: 'Our faculty members are not just teachers; they are mentors, researchers, and experts in their fields.' };
        case 'image': return { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80', alt: 'Faculty Portrait', width: 'large' };
        case 'video': return { videoType: 'youtube', videoUrl: '', aspectRatio: '16:9' };
        case 'quote': return { quote: 'Education is the most powerful weapon which you can use to change the world.', authorName: 'Nelson Mandela', style: 'card' };
        case 'faq': return { title: 'Faculty FAQ', items: [{question: 'How can I contact a professor?', answer: 'You can find the email addresses of all faculty members in their profiles below.'}] };
        case 'timeline': return { title: 'Academic Milestones', items: [{year: '2024', title: 'Excellence Award', description: 'Awarded for best teaching standards.'}] };
        case 'cards': return { title: 'Our Core Values', items: [{title: 'Innovation', description: 'Embracing new teaching methodologies.'}] };
        case 'gallery': return { title: 'Faculty in Action', items: [{imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80'}] };
        case 'table': return { title: 'Faculty Directory', headers: ['Name', 'Department', 'Email'], rows: [['John Doe', 'Science', 'john@school.edu']] };
        case 'stats': return { title: 'Faculty Stats', items: [{label: 'PhD Holders', value: '45+'}, {label: 'Avg Experience', value: '15 Years'}] };
        case 'container': return { childBlocks: [] };
        case 'grid': return { columns: 3, childBlocks: [] };
        case 'columns': return { leftBlocks: [], rightBlocks: [] };
        case 'tabs': return { tabs: [{label: 'Science', childBlocks: []}, {label: 'Arts', childBlocks: []}] };
        case 'accordion': return { items: [{title: 'Administration', childBlocks: []}] };
        case 'carousel': return { slides: [{childBlocks: []}] };
        case 'section': return { background: 'white', childBlocks: [] };
        case 'split': return { split: '50/50', leftBlocks: [], rightBlocks: [] };
        default: return {};
    }
}
