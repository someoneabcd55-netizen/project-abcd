'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  background?: 'white' | 'light' | 'dark' | 'navy' | 'accent' | 'image' | 'gradient';
  backgroundValue?: string;
  overlayOpacity?: number;
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  childBlocks?: any[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function SectionWrapper({
  background = 'white',
  backgroundValue,
  overlayOpacity = 0,
  paddingTop = 'md',
  paddingBottom = 'md',
  fullWidth = false,
  childBlocks = [],
  Renderer,
  theme,
}: SectionWrapperProps) {
  
  const bgClasses = {
    white: 'bg-white text-black',
    light: 'bg-muted/30 text-foreground',
    dark: 'bg-[#0a0f1e] text-white',
    navy: 'bg-[#0d1b3e] text-white',
    accent: 'bg-accent-color text-white',
    image: 'bg-cover bg-center',
    gradient: ''
  }[background];

  const ptClass = { none: 'pt-0', sm: 'pt-8', md: 'pt-16', lg: 'pt-24', xl: 'pt-32' }[paddingTop];
  const pbClass = { none: 'pb-0', sm: 'pb-8', md: 'pb-16', lg: 'pb-24', xl: 'pb-32' }[paddingBottom];

  return (
    <section 
      className={cn("relative", bgClasses, ptClass, pbClass)}
      style={{ 
        backgroundImage: background === 'image' ? `url(${backgroundValue})` : undefined,
        background: background === 'gradient' ? backgroundValue : undefined
      }}
    >
      {background === 'image' && overlayOpacity > 0 && (
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />
      )}
      <div className={cn("relative z-10", !fullWidth && "container mx-auto px-6")}>
        <Renderer blocks={childBlocks} theme={theme} />
      </div>
    </section>
  );
}
