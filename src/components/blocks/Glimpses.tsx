'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GlimpsesItem {
  imageUrl: string;
  category: string;
  title: string;
  caption?: string;
}

interface GlimpsesProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  layout?: 'masonry' | 'grid' | 'carousel';
  columns?: number;
  showFilters?: boolean;
  filterOptions?: string[];
  items: GlimpsesItem[];
  lightbox?: boolean;
}

import { Button } from '@/components/ui/button';

export function Glimpses({
  eyebrowLabel,
  title,
  subtitle,
  layout = 'grid',
  columns = 3,
  showFilters = true,
  items = [],
  lightbox = true,
}: GlimpsesProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  
  // Extract unique categories from items
  const filterOptions = Array.from(new Set(items.map(item => item.category))).filter(Boolean);
  const filters = ['All', ...filterOptions];
  
  const filteredItems = activeFilter === 'All' ? items : items.filter(item => item.category === activeFilter);
  
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  const selectedImage = selectedImageIdx !== null ? filteredItems[selectedImageIdx] : null;

  return (
    <section className="py-20 px-6 container mx-auto">
      <div className="text-center mb-16">
        {eyebrowLabel && <p className="text-primary uppercase tracking-[0.3em] text-[10px] font-black mb-4">{eyebrowLabel}</p>}
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6 tracking-tight">{title || 'Our Visual Story'}</h2>
        {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
      </div>

      {showFilters && filters.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300",
                activeFilter === filter 
                  ? "bg-navy text-white shadow-xl scale-105" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-navy"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className={cn("grid gap-6", gridCols)}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.imageUrl + i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] cursor-pointer bg-muted shadow-sm hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImageIdx(i)}
            >
              <Image 
                src={item.imageUrl} 
                alt={item.title || 'Glimpses image'} 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-2 block">{item.category}</span>
                  <h4 className="text-white font-bold text-xl leading-tight">{item.title}</h4>
                  {item.caption && <p className="text-white/70 text-sm mt-3 line-clamp-2 italic font-medium">"{item.caption}"</p>}
                </div>
                {lightbox && (
                  <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Maximize2 className="text-white w-5 h-5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIdx !== null} onOpenChange={(open) => !open && setSelectedImageIdx(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl p-0 overflow-hidden border-none bg-black/95 shadow-none backdrop-blur-xl h-[90vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedImage?.title || 'Glimpses Image'}</DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedImageIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative w-full h-full"
              >
                <Image 
                  src={selectedImage?.imageUrl || ''} 
                  alt={selectedImage?.title || ''} 
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/90 to-transparent text-white pointer-events-none">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2 block">{selectedImage?.category}</span>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">{selectedImage?.title}</h3>
              {selectedImage?.caption && <p className="text-white/60 text-lg max-w-3xl italic">"{selectedImage.caption}"</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/5 hover:bg-white/20 text-white w-14 h-14"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIdx(prev => prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null);
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/5 hover:bg-white/20 text-white w-14 h-14"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIdx(prev => prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

