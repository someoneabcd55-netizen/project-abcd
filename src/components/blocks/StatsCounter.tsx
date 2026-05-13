'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatItem {
  number: string;
  suffix?: string;
  label: string;
  icon?: string;
}

interface StatsCounterProps {
  eyebrowLabel?: string;
  title?: string;
  subtitle?: string;
  background?: 'light' | 'dark' | 'accent';
  columns?: 2 | 3 | 4;
  items: StatItem[];
  countUpAnimation?: boolean;
}

export function StatsCounter({
  eyebrowLabel,
  title,
  subtitle,
  background = 'light',
  columns = 4,
  items = [],
  countUpAnimation = true,
}: StatsCounterProps) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[columns as 2 | 3 | 4];
  
  const bgClasses = {
    light: 'bg-background',
    dark: 'bg-foreground text-background',
    accent: 'bg-accent-color text-white'
  }[background];

  return (
    <section className={cn("py-20 px-6", bgClasses)}>
      {(title || eyebrowLabel) && (
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {eyebrowLabel && <p className="text-accent-color uppercase tracking-widest text-sm font-bold mb-2">{eyebrowLabel}</p>}
          {title && <h2 className="text-4xl font-headline font-bold mb-4">{title}</h2>}
          {subtitle && <p className="opacity-80">{subtitle}</p>}
        </div>
      )}

      <div className={cn("container mx-auto grid gap-12", gridCols)}>
        {items.map((item, i) => (
          <div key={i} className="text-center group">
            <div className="flex justify-center mb-6 text-left">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                {/* Dynamically render icon if needed, or placeholder */}
                <div className="w-8 h-8 bg-accent-color rounded-full opacity-50" />
              </div>
            </div>
            <div className="text-5xl font-headline font-extrabold mb-2">
               <Counter value={item.number} animate={countUpAnimation} />
               <span>{item.suffix}</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Counter({ value, animate }: { value: string, animate: boolean }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/,/g, ''));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!animate || isNaN(target) || !isInView) {
      setCount(target || 0);
      return;
    }

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, animate, isInView]);

  return <span ref={ref}>{isNaN(target) ? value : count.toLocaleString()}</span>;
}
