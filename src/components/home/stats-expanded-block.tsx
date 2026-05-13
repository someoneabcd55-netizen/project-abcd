'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface StatItem {
  number: string;
  label: string;
  iconName: string;
}

interface StatsExpandedBlockProps {
  title?: string;
  subtitle?: string;
  items?: StatItem[];
  theme?: string;
}

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

export function StatsExpandedBlock({ title, subtitle, items, theme }: StatsExpandedBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultItems: StatItem[] = [
    { number: '1200', label: 'Student Cadets', iconName: 'Users' },
    { number: '45', label: 'Expert Mentors', iconName: 'GraduationCap' },
    { number: '98', label: 'Success Rate', iconName: 'Trophy' },
    { number: '15', label: 'Partner Units', iconName: 'Shield' },
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0d1b3e]" : isTheme3 ? "bg-white" : "bg-primary text-primary-foreground"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-20 space-y-4">
             {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Performance Metrics</span>}
             <h2 className={cn(
               "text-4xl md:text-6xl font-bold tracking-tight",
               isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
             )}>
               {title || 'Numbers that Define Us'}
             </h2>
             <p className={cn(
               "max-w-2xl mx-auto text-lg opacity-80",
               isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : ""
             )}>
               {subtitle || 'Our achievements and scale reflected in key statistics from the last academic year.'}
             </p>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, i) => {
            const Icon = (Icons as any)[item.iconName] || Icons.Zap;
            const numValue = parseInt(item.number.replace(/\D/g, ''));
            const suffix = item.number.replace(/[0-9]/g, '');

            return (
              <div 
                key={i}
                className={cn(
                  "p-10 text-center transition-all duration-500 group",
                  isTheme2 
                    ? "bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10" 
                    : isTheme3
                      ? "bg-[#f4f6f9] border-b-4 border-[#cc2936] rounded-none hover:shadow-2xl"
                      : "bg-white/10 rounded-2xl hover:bg-white/20"
                )}
              >
                <div className={cn(
                  "mb-8 inline-flex p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110",
                  isTheme2 ? "bg-indigo-500/20 text-indigo-400" : 
                  isTheme3 ? "bg-navy text-white" :
                  "bg-white/20 text-white"
                )}>
                  <Icon className="h-8 w-8" />
                </div>
                
                <div className={cn(
                  "text-5xl md:text-7xl font-bold mb-4",
                  isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline" : "text-white"
                )}>
                  <CountUp end={numValue} suffix={suffix} />
                </div>

                <div className={cn(
                  "text-xs uppercase tracking-[0.3em] font-bold",
                  isTheme2 ? "text-indigo-400 font-body" : isTheme3 ? "text-[#cc2936] font-body" : "text-white/80"
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
