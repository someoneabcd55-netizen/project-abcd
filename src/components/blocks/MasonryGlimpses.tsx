'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { GlimpseLightbox } from './GlimpseLightbox';

interface MasonryGlimpsesProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  columns?: number;
  showFilters?: boolean;
  filterOptions?: string[];
  showSearch?: boolean;
  lightbox?: boolean;
  mediaType?: 'images' | 'videos' | 'mixed';
  items: Array<{
    mediaUrl: string;
    mediaType: 'image' | 'video';
    thumbnailUrl?: string;
    category?: string;
    title?: string;
    caption?: string;
  }>;
}

export function MasonryGlimpses({
  eyebrowLabel,
  title,
  subtitle,
  columns = 3,
  showFilters = false,
  filterOptions = [],
  showSearch = false,
  lightbox = true,
  items = []
}: MasonryGlimpsesProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [items, activeFilter, searchQuery]);

  const filters = useMemo(() => ['All', ...filterOptions], [filterOptions]);

  return (
    <section className="py-24 px-6 bg-background overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {eyebrowLabel && <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{eyebrowLabel}</span>}
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          <div className="flex flex-col gap-6 items-end">
            {showSearch && (
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search Glimpses..." 
                  className="pl-10 rounded-full bg-muted/50 border-none focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {showFilters && (
              <div className="flex flex-wrap gap-2 justify-end">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      activeFilter === filter 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "grid gap-4 md:gap-6",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.mediaUrl + index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={cn(
                  "relative group cursor-pointer overflow-hidden rounded-[2rem] bg-muted",
                  index % 3 === 0 ? "h-[400px] md:h-[500px]" : "h-[300px] md:h-[400px]"
                )}
                onClick={() => lightbox && setSelectedItemIndex(index)}
              >
                <Image
                  src={item.mediaType === 'image' ? item.mediaUrl : (item.thumbnailUrl || item.mediaUrl)}
                  alt={item.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  {item.category && (
                    <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">{item.category}</span>
                  )}
                  {item.title && (
                    <h4 className="text-white font-bold text-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h4>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selectedItemIndex !== null && (
          <GlimpseLightbox
            isOpen={selectedItemIndex !== null}
            onClose={() => setSelectedItemIndex(null)}
            items={filteredItems.map(i => ({
              mediaUrl: i.mediaUrl,
              mediaType: i.mediaType,
              title: i.title,
              caption: i.caption
            }))}
            initialIndex={selectedItemIndex}
          />
        )}
      </div>
    </section>
  );
}

