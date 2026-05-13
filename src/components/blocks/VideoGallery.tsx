'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { GalleryLightbox } from './GalleryLightbox';

interface VideoItem {
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  title?: string;
  description?: string;
  duration?: string;
}

interface VideoGalleryProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  columns?: number;
  videoSource?: 'youtube' | 'vimeo' | 'direct' | 'mixed';
  showFilters?: boolean;
  filterOptions?: string[];
  showSearch?: boolean;
  items: VideoItem[];
}

export function VideoGallery({
  eyebrowLabel,
  title,
  subtitle,
  columns = 3,
  showFilters = false,
  filterOptions = [],
  showSearch = false,
  items = []
}: VideoGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  const filteredItems = items.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {eyebrowLabel && <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{eyebrowLabel}</span>}
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          <div className="flex flex-col gap-4 items-end">
            {showSearch && (
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search videos..." 
                  className="pl-10 rounded-full bg-muted/50 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {showFilters && (
              <div className="flex flex-wrap gap-2 justify-end">
                {['All', ...filterOptions].map((filter) => (
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
          "grid gap-8",
          columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col group cursor-pointer"
              onClick={() => setSelectedVideoIndex(index)}
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-muted mb-6">
                <Image
                  src={item.thumbnailUrl || `https://img.youtube.com/vi/${item.videoUrl.split('v=')[1]}/maxresdefault.jpg`}
                  alt={item.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-125 transition-transform duration-500">
                    <Play className="h-8 w-8 fill-white ml-1" />
                  </div>
                </div>
                {item.duration && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.duration}
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/30">
                    {item.category}
                  </div>
                )}
              </div>

              <div className="px-2">
                {item.title && <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h4>}
                {item.description && <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {selectedVideoIndex !== null && (
          <GalleryLightbox
            isOpen={selectedVideoIndex !== null}
            onClose={() => setSelectedVideoIndex(null)}
            items={filteredItems.map(i => ({
              mediaUrl: i.videoUrl,
              mediaType: 'video',
              title: i.title,
              caption: i.description
            }))}
            initialIndex={selectedVideoIndex}
          />
        )}
      </div>
    </section>
  );
}
