'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2, Plus, Film, Pilcrow, Image as ImageIcon, Newspaper, MessageSquareQuote, HelpCircle, History, Activity, Zap, Users, PlayCircle, MapPin, Layout, Grid as GridIcon, Columns as ColumnsIcon, Bookmark, List, ChevronRight, Layers, Split, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface AdminRecursiveEditorProps {
  blocks: any[];
  onChange: (blocks: any[]) => void;
  onEditBlock: (block: any, onSave: (updatedBlock: any) => void) => void;
}

export function AdminRecursiveEditor({ blocks, onChange, onEditBlock }: AdminRecursiveEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const handleAddBlock = (type: string) => {
    const newBlock = {
      id: uuidv4(),
      type,
      visible: true,
      data: getDefaultDataForType(type)
    };
    onChange([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const handleUpdateBlock = (id: string, updatedBlock: any) => {
    onChange(blocks.map(b => b.id === id ? updatedBlock : b));
  };

  return (
    <div className="space-y-4">
      <div className="min-h-[100px] p-4 border rounded-xl bg-muted/20 space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableItem 
                key={block.id} 
                block={block} 
                onEdit={() => onEditBlock(block, (updated) => handleUpdateBlock(block.id, updated))}
                onDelete={() => handleDeleteBlock(block.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {blocks.length === 0 && (
          <div className="py-8 text-center text-muted-foreground italic text-sm">
            No blocks here yet. Add one below.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-background">
        <p className="w-full text-[10px] font-bold uppercase text-muted-foreground mb-1 ml-1">Add Block</p>
        <BlockTypeButton icon={<Film size={14}/>} label="Hero" onClick={() => handleAddBlock('hero')} />
        <BlockTypeButton icon={<Pilcrow size={14}/>} label="Heading" onClick={() => handleAddBlock('heading')} />
        <BlockTypeButton icon={<List size={14}/>} label="Text" onClick={() => handleAddBlock('paragraph')} />
        <BlockTypeButton icon={<ImageIcon size={14}/>} label="Image" onClick={() => handleAddBlock('image')} />
        <BlockTypeButton icon={<PlayCircle size={14}/>} label="Video" onClick={() => handleAddBlock('video')} />
        <BlockTypeButton icon={<MessageSquareQuote size={14}/>} label="Quote" onClick={() => handleAddBlock('quote')} />
        <BlockTypeButton icon={<HelpCircle size={14}/>} label="FAQ" onClick={() => handleAddBlock('faq')} />
        <BlockTypeButton icon={<History size={14}/>} label="Timeline" onClick={() => handleAddBlock('timeline')} />
        <BlockTypeButton icon={<Bookmark size={14}/>} label="Cards" onClick={() => handleAddBlock('cards')} />
        <BlockTypeButton icon={<ImageIcon size={14}/>} label="Glimpses" onClick={() => handleAddBlock('Glimpses')} />
        <BlockTypeButton icon={<List size={14}/>} label="Table" onClick={() => handleAddBlock('table')} />
        <BlockTypeButton icon={<Activity size={14}/>} label="Stats" onClick={() => handleAddBlock('stats')} />
        <BlockTypeButton icon={<ImagePlus size={14}/>} label="ImgLayout" onClick={() => handleAddBlock('image-layout')} />
        <BlockTypeButton icon={<GridIcon size={14}/>} label="Masonry" onClick={() => handleAddBlock('masonry-Glimpses')} />
        <BlockTypeButton icon={<Layout size={14}/>} label="Featured" onClick={() => handleAddBlock('featured-Glimpses')} />
        <BlockTypeButton icon={<GridIcon size={14}/>} label="EqGrid" onClick={() => handleAddBlock('equal-grid-Glimpses')} />
        <BlockTypeButton icon={<ChevronRight size={14}/>} label="Scroll" onClick={() => handleAddBlock('horizontal-scroll-Glimpses')} />
        <BlockTypeButton icon={<Film size={14}/>} label="Slideshow" onClick={() => handleAddBlock('fullscreen-slideshow')} />
        <BlockTypeButton icon={<PlayCircle size={14}/>} label="VideoGal" onClick={() => handleAddBlock('video-Glimpses')} />
        
        <div className="w-full h-px bg-border my-1" />
        <p className="w-full text-[10px] font-bold uppercase text-muted-foreground mb-1 ml-1">Layout</p>
        <BlockTypeButton icon={<Layout size={14}/>} label="Container" onClick={() => handleAddBlock('container')} />
        <BlockTypeButton icon={<GridIcon size={14}/>} label="Grid" onClick={() => handleAddBlock('grid')} />
        <BlockTypeButton icon={<ColumnsIcon size={14}/>} label="Columns" onClick={() => handleAddBlock('columns')} />
        <BlockTypeButton icon={<Bookmark size={14}/>} label="Tabs" onClick={() => handleAddBlock('tabs')} />
        <BlockTypeButton icon={<List size={14}/>} label="Accordion" onClick={() => handleAddBlock('accordion')} />
        <BlockTypeButton icon={<ChevronRight size={14}/>} label="Carousel" onClick={() => handleAddBlock('carousel')} />
        <BlockTypeButton icon={<Layers size={14}/>} label="Section" onClick={() => handleAddBlock('section')} />
        <BlockTypeButton icon={<Split size={14}/>} label="Split" onClick={() => handleAddBlock('split')} />
      </div>
    </div>
  );
}

function SortableItem({ block, onEdit, onDelete }: { block: any, onEdit: () => void, onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const getIcon = () => {
    switch(block.type) {
      case 'hero': return <Film size={14}/>;
      case 'heading': return <Pilcrow size={14}/>;
      case 'paragraph': return <List size={14}/>;
      case 'container': return <Layout size={14}/>;
      case 'grid': return <GridIcon size={14}/>;
      case 'columns': return <ColumnsIcon size={14}/>;
      default: return <Bookmark size={14}/>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm group">
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical size={16} />
      </button>
      <div className="flex items-center gap-2 flex-grow min-w-0">
        <div className="p-1.5 rounded bg-muted text-muted-foreground">
          {getIcon()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">{block.type}</span>
          <span className="text-sm font-medium truncate">{block.data.title || block.data.text || block.data.heading || "Untitled Block"}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Edit size={14}/></Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}><Trash2 size={14}/></Button>
      </div>
    </div>
  );
}

function BlockTypeButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} className="h-8 px-2 text-[11px] flex gap-1.5 items-center">
      {icon} {label}
    </Button>
  );
}

function getDefaultDataForType(type: string) {
  switch(type) {
    case 'hero': return { title: 'New Hero', backgroundType: 'image', backgroundValue: 'https://picsum.photos/seed/hero/1200/800', layout: 'centered' };
    case 'paragraph': return { content: 'New text block...' };
    case 'heading': return { text: 'New Heading', size: 'h2' };
    case 'image': return { src: 'https://picsum.photos/seed/img/800/600', alt: 'Image' };
    case 'video': return { videoUrl: '', title: 'New Video' };
    case 'faq': return { title: 'FAQ', items: [{ question: 'Sample Question?', answer: 'Sample Answer' }] };
    case 'timeline': return { title: 'History', items: [{ year: '2024', title: 'Event', description: 'Description' }] };
    case 'cards': return { title: 'Features', items: [{ title: 'Feature 1', description: 'Details' }] };
    case 'Glimpses': return { title: 'Glimpses', items: [{ imageUrl: 'https://picsum.photos/seed/g1/800/600' }] };
    case 'stats': return { title: 'Stats', items: [{ label: 'Users', value: '10K+' }] };
    case 'container': return { childBlocks: [] };
    case 'grid': return { columns: 3, childBlocks: [] };
    case 'columns': return { leftBlocks: [], rightBlocks: [] };
    case 'tabs': return { tabs: [{ label: 'Tab 1', childBlocks: [] }] };
    case 'accordion': return { items: [{ title: 'Item 1', childBlocks: [] }] };
    case 'carousel': return { slides: [{ childBlocks: [] }] };
    case 'section': return { background: 'white', childBlocks: [] };
    case 'split': return { split: '50/50', leftBlocks: [], rightBlocks: [] };
    case 'image-layout': return { title: 'Image Layout', layout: 'mosaic', items: [{ imageUrl: 'https://picsum.photos/seed/im1/800/800' }, { imageUrl: 'https://picsum.photos/seed/im2/800/800' }] };
    case 'masonry-Glimpses': return { title: 'Masonry Glimpses', columns: 3, mediaType: 'images', items: [{ mediaUrl: 'https://picsum.photos/seed/m1/800/1000', mediaType: 'image', category: 'Category' }] };
    case 'featured-Glimpses': return { title: 'Featured Glimpses', featuredItem: { mediaUrl: 'https://picsum.photos/seed/f1/1200/800', mediaType: 'image', title: 'Main Story' }, gridItems: [{ mediaUrl: 'https://picsum.photos/seed/f2/600/600', mediaType: 'image' }] };
    case 'equal-grid-Glimpses': return { title: 'Grid Glimpses', columns: 3, aspectRatio: '1:1', items: [{ mediaUrl: 'https://picsum.photos/seed/e1/800/800', mediaType: 'image' }] };
    case 'horizontal-scroll-Glimpses': return { title: 'Scroll Glimpses', items: [{ mediaUrl: 'https://picsum.photos/seed/s1/800/600', mediaType: 'image' }] };
    case 'fullscreen-slideshow': return { height: '75vh', items: [{ mediaUrl: 'https://picsum.photos/seed/sl1/1920/1080', mediaType: 'image', overlayTitle: 'Hero Slide' }] };
    case 'video-Glimpses': return { title: 'Video Glimpses', items: [{ videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Featured Video' }] };
    default: return {};
  }
}

