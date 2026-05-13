'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryLightbox } from './GalleryLightbox';

interface EqualGridItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  category?: string;
  title?: string;
  caption?: string;
}

interface EqualGridGalleryProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  columns?: number;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  showFilters?: boolean;
  filterOptions?: string[];
  lightbox?: boolean;
  showCaptions?: boolean;
  hoverStyle?: 'overlay' | 'lift' | 'zoom' | 'border-glow';
  mediaType?: 'images' | 'videos' | 'mixed';
  items: EqualGridItem[];
}

export function EqualGridGallery({
  eyebrowLabel,
  title,
  subtitle,
  columns = 3,
  aspectRatio = '1:1',
  gap = 'md',
  showFilters = false,
  filterOptions = [],
  lightbox = true,
  showCaptions = false,
  hoverStyle = 'overlay',
  items = []
}: EqualGridGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const filteredItems = items.filter(item => 
    activeFilter === 'All' || item.category === activeFilter
  );

  const aspectClass = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]'
  }[aspectRatio];

  const gapClass = {
    'none': 'gap-0',
    'sm': 'gap-4',
    'md': 'gap-6',
    'lg': 'gap-10'
  }[gap];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {eyebrowLabel && <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{eyebrowLabel}</span>}
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 justify-end">
              {['All', ...filterOptions].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeFilter === filter 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={cn(
          "grid",
          gapClass,
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 lg:grid-cols-4"
        )}>
          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col group"
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden cursor-pointer bg-muted transition-all duration-500",
                  aspectClass,
                  hoverStyle === 'lift' && "group-hover:-translate-y-2 group-hover:shadow-2xl rounded-2xl",
                  hoverStyle === 'border-glow' && "group-hover:ring-4 group-hover:ring-primary ring-offset-2 rounded-lg",
                  hoverStyle === 'overlay' && "rounded-2xl",
                  hoverStyle === 'zoom' && "rounded-2xl"
                )}
                onClick={() => lightbox && setSelectedItemIndex(index)}
              >
                <Image
                  src={item.mediaType === 'image' ? item.mediaUrl : (item.thumbnailUrl || item.mediaUrl)}
                  alt={item.title || ''}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700",
                    hoverStyle === 'zoom' && "group-hover:scale-110"
                  )}
                />
                
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                )}

                {hoverStyle === 'overlay' && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    {item.category && <span className="text-primary font-bold text-xs uppercase tracking-widest mb-1">{item.category}</span>}
                    {item.title && <h4 className="text-white font-bold">{item.title}</h4>}
                  </div>
                )}
              </div>

              {showCaptions && (item.title || item.caption) && (
                <div className="mt-4">
                  {item.title && <h4 className="font-bold text-lg mb-1">{item.title}</h4>}
                  {item.caption && <p className="text-muted-foreground text-sm line-clamp-2">{item.caption}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {selectedItemIndex !== null && (
          <GalleryLightbox
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
