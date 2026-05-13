'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GalleryLightbox } from './GalleryLightbox';

interface ScrollItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  category?: string;
  title?: string;
  caption?: string;
}

interface HorizontalScrollGalleryProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  itemWidth?: 'sm' | 'md' | 'lg';
  itemHeight?: 'sm' | 'md' | 'lg';
  autoScroll?: boolean;
  autoScrollSpeed?: 'slow' | 'medium' | 'fast';
  showArrows?: boolean;
  lightbox?: boolean;
  items: ScrollItem[];
}

export function HorizontalScrollGallery({
  eyebrowLabel,
  title,
  subtitle,
  itemWidth = 'md',
  itemHeight = 'md',
  autoScroll = false,
  autoScrollSpeed = 'medium',
  showArrows = true,
  lightbox = true,
  items = []
}: HorizontalScrollGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const widthClass = { sm: 'w-[250px]', md: 'w-[400px]', lg: 'w-[600px]' }[itemWidth];
  const heightClass = { sm: 'h-[200px]', md: 'h-[350px]', lg: 'h-[500px]' }[itemHeight];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const speed = { slow: 1, medium: 2, fast: 3 }[autoScrollSpeed];
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += speed;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollSpeed, isPaused]);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          {eyebrowLabel && <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{eyebrowLabel}</span>}
          <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
        </div>

        {showArrows && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('left')}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll('right')}><ChevronRight /></Button>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1200px)/2)] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative shrink-0 rounded-[2.5rem] overflow-hidden group cursor-pointer bg-muted",
              widthClass,
              heightClass
            )}
            onClick={() => lightbox && setSelectedItemIndex(index)}
          >
            <Image
              src={item.mediaType === 'image' ? item.mediaUrl : (item.thumbnailUrl || item.mediaUrl)}
              alt={item.title || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {item.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
              {item.category && <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{item.category}</span>}
              {item.title && <h4 className="text-white font-bold text-xl">{item.title}</h4>}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedItemIndex !== null && (
        <GalleryLightbox
          isOpen={selectedItemIndex !== null}
          onClose={() => setSelectedItemIndex(null)}
          items={items.map(i => ({
            mediaUrl: i.mediaUrl,
            mediaType: i.mediaType,
            title: i.title,
            caption: i.caption
          }))}
          initialIndex={selectedItemIndex}
        />
      )}
    </section>
  );
}
