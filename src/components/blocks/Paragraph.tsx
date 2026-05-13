'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ParagraphProps {
  content: string;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  color?: string;
  maxWidth?: 'full' | 'prose' | 'narrow';
  background?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animation?: 'none' | 'fadeIn';
}

export function Paragraph({
  content,
  alignment = 'left',
  fontSize = 'base',
  color,
  maxWidth = 'prose',
  background,
  padding = 'md',
  animation = 'none',
}: ParagraphProps) {
  
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[alignment];
  const sizeClass = { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' }[fontSize];
  const widthClass = { full: 'max-w-full', prose: 'max-w-prose', narrow: 'max-w-md' }[maxWidth];
  const paddingClass = { none: 'p-0', sm: 'p-4', md: 'p-8', lg: 'p-12' }[padding];

  return (
    <section 
      className={cn("w-full", paddingClass)}
      style={{ backgroundColor: background }}
    >
      <motion.div 
        initial={animation === 'fadeIn' ? { opacity: 0 } : {}}
        whileInView={animation === 'fadeIn' ? { opacity: 1 } : {}}
        viewport={{ once: true }}
        className={cn(alignClass, sizeClass, widthClass, "mx-auto leading-relaxed prose prose-slate dark:prose-invert")}
        style={{ color: color }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </motion.div>
    </section>
  );
}
