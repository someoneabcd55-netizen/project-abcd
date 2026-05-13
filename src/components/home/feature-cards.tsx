'use client';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureCardsProps {
  features?: Feature[];
  theme?: string;
}

export function FeatureCards({ features, theme }: FeatureCardsProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  
  const defaultFeatures = [
    { icon: 'GraduationCap', title: 'Quality Education', description: 'World-class curriculum designed for modern needs.' },
    { icon: 'Users', title: 'Expert Faculty', description: 'Learn from industry veterans and experienced scholars.' },
    { icon: 'Trophy', title: 'Global Recognition', description: 'Degrees recognized and valued across the globe.' },
    { icon: 'Briefcase', title: 'Career Growth', description: 'Dedicated placement cell to kickstart your career.' },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <section className={cn(
      "container mx-auto px-4 py-16 md:py-24",
      (isTheme2 || isTheme3) && "max-w-7xl"
    )}>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {displayFeatures.map((feature, i) => {
          const IconComponent = (Icons as any)[feature.icon] || Icons.HelpCircle;
          
          return (
            <div 
              key={i} 
              className={cn(
                "p-8 transition-all duration-300 group relative",
                isTheme2 
                  ? "bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-accent)] hover:-translate-y-1 shadow-lg hover:shadow-[0_10_30px_rgba(99,102,241,0.2)] rounded-2xl" 
                  : isTheme3
                    ? "bg-white border border-gray-100 hover:border-gray-200 hover:-translate-y-2 shadow-sm hover:shadow-xl rounded-none"
                    : "bg-background border hover:border-primary shadow-sm rounded-2xl"
              )}
            >
              {isTheme3 && (
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#cc2936] transition-all duration-300 group-hover:h-full" />
              )}
              <div className={cn(
                "mb-6 inline-flex p-3 rounded-lg",
                isTheme2 ? "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors" : 
                isTheme3 ? "bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white transition-colors" :
                "bg-primary/10 text-primary"
              )}>
                <IconComponent className="h-6 w-6" />
              </div>
              <h3 className={cn(
                "mb-3 text-xl font-bold",
                isTheme2 ? "text-white font-headline" : 
                isTheme3 ? "text-navy font-headline uppercase tracking-tight" :
                "font-headline"
              )}>
                {feature.title}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                isTheme2 ? "text-[var(--text-secondary)] font-body" : 
                isTheme3 ? "text-gray-500 font-body" :
                "text-muted-foreground"
              )}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
