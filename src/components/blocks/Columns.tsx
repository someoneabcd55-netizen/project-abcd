'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ColumnsProps {
  leftWidth?: '1/4' | '1/3' | '1/2' | '2/3' | '3/4';
  gap?: 'sm' | 'md' | 'lg';
  stackOnMobile?: boolean;
  reverseOnMobile?: boolean;
  background?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  leftBlocks?: any[];
  rightBlocks?: any[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function Columns({
  leftWidth = '1/2',
  gap = 'md',
  stackOnMobile = true,
  reverseOnMobile = false,
  background,
  padding = 'none',
  leftBlocks = [],
  rightBlocks = [],
  Renderer,
  theme,
}: ColumnsProps) {
  
  const widthClasses = {
    '1/4': { left: 'lg:w-1/4', right: 'lg:w-3/4' },
    '1/3': { left: 'lg:w-1/3', right: 'lg:w-2/3' },
    '1/2': { left: 'lg:w-1/2', right: 'lg:w-1/2' },
    '2/3': { left: 'lg:w-2/3', right: 'lg:w-1/3' },
    '3/4': { left: 'lg:w-3/4', right: 'lg:w-1/4' }
  }[leftWidth];

  const gapClass = { sm: 'gap-4', md: 'gap-8', lg: 'gap-12' }[gap];
  const paddingClass = { none: 'p-0', sm: 'p-4', md: 'p-8', lg: 'p-12' }[padding];

  return (
    <section 
      className={cn("w-full", paddingClass)}
      style={{ backgroundColor: background }}
    >
      <div className={cn(
        "flex flex-col",
        stackOnMobile ? "lg:flex-row" : "flex-row",
        reverseOnMobile && "flex-col-reverse lg:flex-row",
        gapClass
      )}>
        <div className={cn("w-full", widthClasses.left)}>
          <Renderer blocks={leftBlocks} theme={theme} />
        </div>
        <div className={cn("w-full", widthClasses.right)}>
          <Renderer blocks={rightBlocks} theme={theme} />
        </div>
      </div>
    </section>
  );
}
