'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryLightbox } from './GalleryLightbox';

interface FeaturedItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  category?: string;
  title?: string;
  caption?: string;
}

interface FeaturedGalleryProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  featuredItem: FeaturedItem;
  gridItems: FeaturedItem[];
  gridColumns?: number;
  showFilters?: boolean;
  filterOptions?: string[];
  lightbox?: boolean;
  mediaType?: 'images' | 'videos' | 'mixed';
}

export function FeaturedGallery({
  eyebrowLabel,
  title,
  subtitle,
  featuredItem,
  gridItems = [],
  gridColumns = 2,
  showFilters = false,
  filterOptions = [],
  lightbox = true
}: FeaturedGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const allItems = [featuredItem, ...gridItems];
  const filters = ['All', ...filterOptions];

  const filteredGridItems = gridItems.filter(item => 
    activeFilter === 'All' || item.category === activeFilter
  );

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
              {filters.map((filter) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[800px]">
          {/* Main Featured Item */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="relative h-[500px] lg:h-full rounded-[3rem] overflow-hidden group cursor-pointer bg-muted"
            onClick={() => lightbox && setSelectedItemIndex(0)}
          >
            <Image
              src={featuredItem.mediaType === 'image' ? featuredItem.mediaUrl : (featuredItem.thumbnailUrl || featuredItem.mediaUrl)}
              alt={featuredItem.title || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {featuredItem.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <Play className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 flex flex-col justify-end">
              {featuredItem.category && (
                <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">{featuredItem.category}</span>
              )}
              {featuredItem.title && (
                <h3 className="text-white text-4xl md:text-5xl font-bold mb-4">{featuredItem.title}</h3>
              )}
              {featuredItem.caption && (
                <p className="text-gray-300 text-lg max-w-lg line-clamp-2">{featuredItem.caption}</p>
              )}
            </div>
          </motion.div>

          {/* Grid Side */}
          <div className={cn(
            "grid gap-6 h-full",
            gridColumns === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
          )}>
            {filteredGridItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 0.98 }}
                className="relative h-full min-h-[250px] rounded-[2.5rem] overflow-hidden group cursor-pointer bg-muted"
                onClick={() => lightbox && setSelectedItemIndex(index + 1)}
              >
                <Image
                  src={item.mediaType === 'image' ? item.mediaUrl : (item.thumbnailUrl || item.mediaUrl)}
                  alt={item.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  {item.title && <h4 className="text-white font-bold text-lg">{item.title}</h4>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedItemIndex !== null && (
          <GalleryLightbox
            isOpen={selectedItemIndex !== null}
            onClose={() => setSelectedItemIndex(null)}
            items={allItems.map(i => ({
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
