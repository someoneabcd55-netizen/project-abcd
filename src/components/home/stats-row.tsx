'use client';
import { cn } from '@/lib/utils';

interface Stat {
  value: string;
  label: string;
}

interface StatsRowProps {
  stats?: Stat[];
  theme?: string;
}

export function StatsRow({ stats, theme }: StatsRowProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  
  const defaultStats = [
    { value: '5000+', label: 'Students' },
    { value: '250+', label: 'Faculty' },
    { value: '50+', label: 'Courses' },
    { value: '100%', label: 'Placement' },
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className={cn(
      "w-full py-12 md:py-20",
      isTheme2 ? "bg-[var(--surface-2)] border-y border-[var(--border)]" : 
      isTheme3 ? "bg-white border-y border-gray-100" :
      "bg-primary text-primary-foreground"
    )}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {displayStats.map((stat, i) => (
            <div key={i} className="space-y-3">
              <div className={cn(
                "text-5xl md:text-7xl font-bold",
                isTheme2 ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-headline" : 
                isTheme3 ? "text-navy font-headline" : ""
              )}>
                {stat.value}
              </div>
              <div className={cn(
                "text-xs uppercase tracking-[0.2em] font-bold",
                isTheme2 ? "text-[var(--accent)] font-body" : 
                isTheme3 ? "text-[#cc2936] font-body" :
                "text-primary-foreground/80 font-semibold"
              )}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

