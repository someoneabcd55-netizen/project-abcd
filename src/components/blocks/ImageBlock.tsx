'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: 'full' | 'large' | 'medium' | 'small';
  alignment?: 'left' | 'center' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: boolean;
  linkUrl?: string;
  animation?: 'none' | 'fadeIn' | 'zoomIn';
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '3:2';
}

export function ImageBlock({
  src,
  alt,
  caption,
  width = 'large',
  alignment = 'center',
  rounded = 'md',
  shadow = false,
  linkUrl,
  animation = 'none',
  aspectRatio = 'auto',
}: ImageProps) {
  
  const widthClass = { full: 'w-full', large: 'max-w-5xl', medium: 'max-w-2xl', small: 'max-w-sm' }[width];
  const alignClass = { left: 'mr-auto', center: 'mx-auto', right: 'ml-auto' }[alignment];
  const roundedClass = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }[rounded];
  const aspectClass = { 
    auto: 'aspect-auto', 
    '16:9': 'aspect-video', 
    '4:3': 'aspect-[4/3]', 
    '1:1': 'aspect-square', 
    '3:2': 'aspect-[3/2]' 
  }[aspectRatio];

  const content = (
    <figure className={cn(widthClass, alignClass, "py-4")}>
      <motion.div
        initial={animation === 'fadeIn' ? { opacity: 0 } : (animation === 'zoomIn' ? { opacity: 0, scale: 0.9 } : {})}
        whileInView={animation === 'fadeIn' ? { opacity: 1 } : (animation === 'zoomIn' ? { opacity: 1, scale: 1 } : {})}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden",
          roundedClass,
          shadow && "shadow-xl",
          aspectClass
        )}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </motion.div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );

  if (linkUrl) {
    return <a href={linkUrl}>{content}</a>;
  }

  return content;
}

