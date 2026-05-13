'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

function CountUp({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      const nextCount = Math.floor(percentage * end);
      if (nextCount !== countRef.current) {
        countRef.current = nextCount;
        setCount(nextCount);
      }

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export function StatsExpandedBlock({ title, subtitle, items, theme }: any) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const displayItems = items || [
    { number: '1200', label: 'Cadets', iconName: 'Users' },
    { number: '45', label: 'Mentors', iconName: 'GraduationCap' },
    { number: '98%', label: 'Success', iconName: 'Trophy' }
  ];

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0d1b3e]" : isTheme3 ? "bg-white" : "bg-primary text-primary-foreground"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-20 space-y-4">
             <h2 className={cn(
               "text-4xl md:text-6xl font-bold tracking-tight font-headline",
               isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase" : "text-white"
             )}>
               {title || 'Numbers that Define Us'}
             </h2>
             {subtitle && <p className="max-w-2xl mx-auto text-lg opacity-80">{subtitle}</p>}
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item: any, i: number) => {
            const Icon = (Icons as any)[item.iconName] || Icons.Zap;
            const numValue = parseInt((item.number || '0').replace(/\D/g, '')) || 0;
            const suffix = (item.number || '').replace(/[0-9]/g, '');

            return (
              <div 
                key={i}
                className={cn(
                  "p-10 text-center transition-all duration-500 group",
                  isTheme2 ? "bg-white/5 border border-white/10 rounded-3xl" : 
                  isTheme3 ? "bg-[#f4f6f9] border-b-4 border-[#cc2936] rounded-none" : "bg-white/10 rounded-2xl"
                )}
              >
                <div className={cn(
                  "mb-8 inline-flex p-4 rounded-2xl",
                  isTheme2 ? "bg-indigo-500/20 text-indigo-400" : 
                  isTheme3 ? "bg-navy text-white" : "bg-white/20 text-white"
                )}>
                  <Icon className="h-8 w-8" />
                </div>
                
                <div className={cn(
                  "text-5xl md:text-7xl font-bold mb-4 font-headline",
                  isTheme2 ? "text-white" : isTheme3 ? "text-navy" : "text-white"
                )}>
                  <CountUp end={numValue} suffix={suffix} />
                </div>

                <div className={cn(
                  "text-xs uppercase tracking-[0.3em] font-bold opacity-80"
                )}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

