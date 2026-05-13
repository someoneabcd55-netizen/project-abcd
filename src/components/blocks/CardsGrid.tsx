'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CardItem {
  imageUrl?: string;
  icon?: string;
  badgeLabel?: string;
  title: string;
  description: string;
  tags?: string[];
  linkLabel?: string;
  linkUrl?: string;
}

interface CardsGridProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllLink?: string;
  columns?: 2 | 3 | 4;
  cardStyle?: 'image-top' | 'icon-top' | 'horizontal' | 'overlay';
  items: CardItem[];
  hoverEffect?: 'none' | 'lift' | 'glow' | 'border';
  animation?: 'none' | 'staggered' | 'fadeIn';
}

export function CardsGrid({
  eyebrowLabel,
  title,
  subtitle,
  viewAllLabel,
  viewAllLink,
  columns = 3,
  cardStyle = 'image-top',
  items = [],
  hoverEffect = 'lift',
  animation = 'staggered',
}: CardsGridProps) {
  
  const gridCols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[columns as 2 | 3 | 4];
  
  const hoverClass = {
    none: '',
    lift: 'hover:-translate-y-2',
    glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]',
    border: 'hover:border-accent-color'
  }[hoverEffect];

  return (
    <section className="py-20 px-6 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl text-left">
          {eyebrowLabel && <p className="text-accent-color uppercase tracking-widest text-sm font-bold mb-2">{eyebrowLabel}</p>}
          <h2 className="text-4xl font-headline font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllLabel && viewAllLink && (
          <Link href={viewAllLink} className="group flex items-center gap-2 font-bold text-accent-color hover:underline">
            {viewAllLabel} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className={cn("grid gap-8", gridCols)}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={animation === 'staggered' ? { opacity: 0, y: 30 } : {}}
            whileInView={animation === 'staggered' ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "card-premium group overflow-hidden bg-white/5 border border-border/50 rounded-2xl transition-all duration-300",
              hoverClass,
              cardStyle === 'horizontal' ? "flex flex-col md:flex-row text-left" : "flex flex-col text-left"
            )}
          >
            {item.imageUrl && cardStyle !== 'icon-top' && (
              <div className={cn(
                "overflow-hidden",
                cardStyle === 'horizontal' ? "w-full md:w-1/3 aspect-square" : "w-full aspect-[4/3]"
              )}>
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            )}
            
            <div className="p-8 flex flex-col flex-grow">
              {item.badgeLabel && (
                <span className="text-[10px] font-extrabold uppercase tracking-tighter px-2 py-0.5 bg-accent-color text-white rounded mb-4 w-fit">
                  {item.badgeLabel}
                </span>
              )}
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{item.description}</p>
              
              {item.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tag, j) => (
                    <span key={j} className="text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              )}

              {item.linkLabel && item.linkUrl && (
                <Link href={item.linkUrl} className="mt-auto text-sm font-bold flex items-center gap-1 hover:text-accent-color">
                  {item.linkLabel} <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
