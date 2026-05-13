'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  columns?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  background?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  responsiveBreakpoint?: 'sm' | 'md' | 'lg';
  childBlocks?: any[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function Grid({
  columns = 3,
  gap = 'md',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  background,
  padding = 'none',
  childBlocks = [],
  Renderer,
  theme,
}: GridProps) {
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-6',
  }[columns as 1 | 2 | 3 | 4 | 5 | 6];

  const gapClass = { none: 'gap-0', sm: 'gap-4', md: 'gap-8', lg: 'gap-12' }[gap];
  const paddingClass = { none: 'p-0', sm: 'p-4', md: 'p-8', lg: 'p-12' }[padding];

  return (
    <section 
      className={cn("w-full", paddingClass)}
      style={{ backgroundColor: background }}
    >
      <div className={cn(
        "grid", 
        gridCols, 
        gapClass,
        `items-${alignItems}`,
        `justify-items-${justifyItems}`
      )}>
        <Renderer blocks={childBlocks} theme={theme} />
      </div>
    </section>
  );
}
