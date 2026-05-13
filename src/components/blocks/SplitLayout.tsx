'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SplitLayoutProps {
  split?: '50/50' | '40/60' | '60/40' | '33/67' | '67/33';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  verticalAlign?: 'top' | 'center' | 'bottom';
  stackOnMobile?: boolean;
  reverseOnMobile?: boolean;
  divider?: boolean;
  background?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  leftBlocks?: any[];
  rightBlocks?: any[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function SplitLayout({
  split = '50/50',
  gap = 'md',
  verticalAlign = 'center',
  stackOnMobile = true,
  reverseOnMobile = false,
  divider = false,
  background,
  padding = 'none',
  leftBlocks = [],
  rightBlocks = [],
  Renderer,
  theme,
}: SplitLayoutProps) {
  
  const splitClasses = {
    '50/50': { left: 'lg:w-1/2', right: 'lg:w-1/2' },
    '40/60': { left: 'lg:w-2/5', right: 'lg:w-3/5' },
    '60/40': { left: 'lg:w-3/5', right: 'lg:w-2/5' },
    '33/67': { left: 'lg:w-1/3', right: 'lg:w-2/3' },
    '67/33': { left: 'lg:w-2/3', right: 'lg:w-1/3' }
  }[split];

  const gapClass = { sm: 'gap-4', md: 'gap-8', lg: 'gap-12', xl: 'gap-20' }[gap];
  const alignClass = { top: 'items-start', center: 'items-center', bottom: 'items-end' }[verticalAlign];
  const paddingClass = { none: 'p-0', sm: 'p-4', md: 'p-8', lg: 'p-12', xl: 'p-20' }[padding];

  return (
    <section 
      className={cn("w-full relative", paddingClass)}
      style={{ backgroundColor: background }}
    >
      <div className={cn(
        "flex flex-col",
        stackOnMobile ? "lg:flex-row" : "flex-row",
        reverseOnMobile && "flex-col-reverse lg:flex-row",
        gapClass,
        alignClass
      )}>
        <div className={cn("w-full relative", splitClasses.left)}>
          <Renderer blocks={leftBlocks} theme={theme} />
        </div>
        
        {divider && <div className="hidden lg:block w-px bg-border self-stretch mx-4" />}
        
        <div className={cn("w-full relative", splitClasses.right)}>
          <Renderer blocks={rightBlocks} theme={theme} />
        </div>
      </div>
    </section>
  );
}

