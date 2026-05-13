'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LightboxItem {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title?: string;
  caption?: string;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  initialIndex: number;
}

export function GalleryLightbox({ isOpen, onClose, items, initialIndex }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  }, [onClose, handlePrevious, handleNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentItem = items[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-[110]">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Media Container */}
        <div className="relative w-full h-full flex items-center justify-center max-w-7xl">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 md:-left-16 text-white hover:bg-white/10 z-[110]" 
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              <div className={cn(
                "relative w-full h-full transition-all duration-500",
                isFullscreen ? "max-w-none" : "max-w-5xl max-h-[80vh]"
              )}>
                {currentItem.mediaType === 'image' ? (
                  <Image
                    src={currentItem.mediaUrl}
                    alt={currentItem.title || ''}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={currentItem.mediaUrl.includes('youtube.com') 
                        ? currentItem.mediaUrl.replace('watch?v=', 'embed/') 
                        : currentItem.mediaUrl}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Info Overlay */}
              <div className="mt-6 text-center text-white max-w-2xl">
                {currentItem.title && <h3 className="text-xl font-bold mb-2">{currentItem.title}</h3>}
                {currentItem.caption && <p className="text-sm text-gray-300">{currentItem.caption}</p>}
                <div className="mt-4 text-xs text-gray-500 font-mono">
                  {currentIndex + 1} / {items.length}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 md:-right-16 text-white hover:bg-white/10 z-[110]" 
            onClick={handleNext}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
