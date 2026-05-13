'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlimpsesLightbox } from './GlimpsesLightbox';

interface SlideItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  overlayButton?: { label: string; link: string };
}

interface FullscreenSlideshowProps {
  eyebrowLabel?: string;
  title?: string;
  height?: '50vh' | '75vh' | '100vh';
  autoplay?: boolean;
  autoplayDelay?: number;
  transition?: 'fade' | 'slide' | 'zoom';
  showDots?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  lightbox?: boolean;
  items: SlideItem[];
}

export function FullscreenSlideshow({
  eyebrowLabel,
  title,
  height = '75vh',
  autoplay = true,
  autoplayDelay = 5000,
  transition = 'fade',
  showDots = true,
  showArrows = true,
  showThumbnails = false,
  lightbox = true,
  items = []
}: FullscreenSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoplay || isPaused) return;
    const interval = setInterval(handleNext, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isPaused, handleNext]);

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    },
    zoom: {
      initial: { scale: 1.2, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 }
    }
  }[transition];

  return (
    <section 
      className="relative w-full overflow-hidden" 
      style={{ height }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {items[currentIndex].mediaType === 'image' ? (
            <Image
              src={items[currentIndex].mediaUrl}
              alt=""
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-black">
              <iframe
                src={items[currentIndex].mediaUrl}
                className="w-full h-full opacity-60"
                allow="autoplay; fullscreen"
              />
            </div>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-24">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {eyebrowLabel && <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{eyebrowLabel}</span>}
                {items[currentIndex].overlayTitle && (
                  <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {items[currentIndex].overlayTitle}
                  </h2>
                )}
                {items[currentIndex].overlaySubtitle && (
                  <p className="text-gray-300 text-lg md:text-2xl mb-8 max-w-2xl">
                    {items[currentIndex].overlaySubtitle}
                  </p>
                )}
                {items[currentIndex].overlayButton && (
                  <Button size="lg" className="rounded-full px-8" asChild>
                    <a href={items[currentIndex].overlayButton?.link}>
                      {items[currentIndex].overlayButton?.label}
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none">
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white pointer-events-auto" onClick={handlePrev}>
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white pointer-events-auto" onClick={handleNext}>
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                currentIndex === i ? "w-10 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 px-4 overflow-x-auto no-scrollbar hidden md:flex">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all",
                currentIndex === i ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <Image src={item.thumbnailUrl || item.mediaUrl} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

