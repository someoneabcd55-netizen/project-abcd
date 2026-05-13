'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeadingProps {
  text: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4';
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: 'normal' | 'semibold' | 'bold' | 'extrabold';
  eyebrowLabel?: string;
  underlineAccent?: boolean;
  spacing?: 'tight' | 'normal' | 'loose';
  animation?: 'none' | 'fadeIn' | 'slideUp';
}

export function Heading({
  text,
  size = 'h2',
  alignment = 'center',
  color,
  fontWeight = 'bold',
  eyebrowLabel,
  underlineAccent = false,
  spacing = 'normal',
  animation = 'none',
}: HeadingProps) {
  
  const Tag = size as keyof JSX.IntrinsicElements;
  const alignmentClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[alignment];
  const weightClass = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' }[fontWeight];
  const spacingClass = { tight: 'tracking-tight', normal: 'tracking-normal', loose: 'tracking-loose' }[spacing];
  
  const sizes = {
    h1: 'text-4xl md:text-6xl',
    h2: 'text-3xl md:text-5xl',
    h3: 'text-2xl md:text-4xl',
    h4: 'text-xl md:text-2xl',
  };

  const anim = {
    none: { initial: {}, whileInView: {} },
    fadeIn: { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
    slideUp: { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } },
  };

  return (
    <motion.div 
      initial={anim[animation].initial}
      whileInView={anim[animation].whileInView}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("w-full py-4", alignmentClass)}
    >
      {eyebrowLabel && (
        <p className="text-accent-color uppercase tracking-widest text-sm font-bold mb-2">
          {eyebrowLabel}
        </p>
      )}
      <Tag 
        className={cn(sizes[size], weightClass, spacingClass, "leading-tight")}
        style={{ color: color }}
      >
        {text}
      </Tag>
      {underlineAccent && (
        <div className={cn("h-1.5 w-24 bg-accent-color mt-4", alignment === 'center' ? 'mx-auto' : (alignment === 'right' ? 'ml-auto' : ''))} />
      )}
    </motion.div>
  );
}
