'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  childBlocks?: any[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function Container({
  maxWidth = 'xl',
  padding = 'md',
  background,
  borderRadius = 'none',
  shadow = 'none',
  childBlocks = [],
  Renderer,
  theme,
}: ContainerProps) {
  
  const widthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  }[maxWidth];

  const paddingClass = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
    xl: 'p-20'
  }[padding];

  const radiusClass = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg' }[borderRadius];
  const shadowClass = { none: 'shadow-none', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' }[shadow];

  return (
    <div className="w-full py-4 px-6">
      <div 
        className={cn("mx-auto", widthClass, paddingClass, radiusClass, shadowClass)}
        style={{ backgroundColor: background }}
      >
        <Renderer blocks={childBlocks} theme={theme} />
      </div>
    </div>
  );
}

