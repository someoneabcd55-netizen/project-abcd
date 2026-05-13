'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

interface TimelineProps {
  eyebrowLabel?: string;
  title: string;
  subtitle?: string;
  layout?: 'vertical-center' | 'vertical-left';
  items: TimelineItem[];
}

export function TimelineBlock({
  eyebrowLabel,
  title,
  subtitle,
  layout = 'vertical-center',
  items = [],
}: TimelineProps) {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-20">
        {eyebrowLabel && <p className="text-accent-color uppercase tracking-widest text-sm font-bold mb-2">{eyebrowLabel}</p>}
        <h2 className="text-4xl font-headline font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      <div className="relative">
        {/* Line */}
        <div className={cn(
          "absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent",
          layout === 'vertical-center' ? "left-1/2 -translate-x-1/2" : "left-4 md:left-8"
        )} />

        <div className="space-y-12">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: layout === 'vertical-center' ? (i % 2 === 0 ? -50 : 50) : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative flex items-center",
                layout === 'vertical-center' 
                  ? (i % 2 === 0 ? "justify-start md:text-right" : "justify-end md:flex-row-reverse")
                  : "pl-12 md:pl-20"
              )}
            >
              {/* Dot */}
              <div className={cn(
                "absolute w-4 h-4 rounded-full border-4 border-background bg-accent-color shadow-[0_0_15px_rgba(255,0,0,0.5)] z-10",
                layout === 'vertical-center' ? "left-1/2 -translate-x-1/2" : "left-4 md:left-8 -translate-x-1/2"
              )} style={{ backgroundColor: item.color }} />

              <div className={cn(
                "w-full md:w-[45%] p-8 card-premium bg-white/5 border border-border/50 rounded-2xl relative",
                layout === 'vertical-center' ? "" : "text-left"
              )}>
                <span className="inline-block px-4 py-1 rounded-full bg-accent-color/10 text-accent-color font-bold text-sm mb-4" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                  {item.year}
                </span>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

