'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTAButton {
  label: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function CTABannerBlock({ 
  heading, 
  subtext, 
  btns, 
  bgType = 'solid', 
  bgValue, 
  theme 
}: any) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const displayBtns: CTAButton[] = btns || [
    { label: 'Apply Now', link: '/admissions', variant: 'primary' }
  ];

  const getBackgroundStyle = () => {
    if (bgType === 'image' && bgValue) {
      return {
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${bgValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (bgType === 'gradient' && bgValue) {
      return { background: bgValue };
    }
    if (isTheme2) return { background: 'linear-gradient(135deg, #0d1b3e 0%, #0a0f1e 100%)' };
    if (isTheme3) return { background: '#0d1b3e' };
    return { background: 'hsl(var(--primary))' };
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div 
        className={cn(
          "py-20 md:py-32 flex items-center justify-center text-center",
          isTheme2 ? "border-y border-white/10" : ""
        )}
        style={getBackgroundStyle()}
      >
        <div className="container relative z-10 px-4 max-w-4xl space-y-10">
          <h2 className={cn(
            "text-4xl md:text-7xl font-bold tracking-tight leading-tight text-white font-headline",
            isTheme3 && "uppercase"
          )}>
            {heading || 'Ready to Shape Your Future?'}
          </h2>
          
          <p className={cn(
            "text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-body leading-relaxed",
            isTheme3 && "border-l-2 border-[#cc2936] pl-6"
          )}>
            {subtext || 'Join our vibrant community of learners and leaders.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
            {displayBtns.map((btn, i) => (
              <Button 
                key={i}
                asChild
                size="lg"
                variant={btn.variant === 'outline' ? 'outline' : 'default'}
                className={cn(
                  "h-16 px-12 rounded-full font-bold uppercase tracking-widest text-sm transition-all",
                  isTheme2 && (btn.variant === 'outline' ? "border-white/20 text-white" : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none"),
                  isTheme3 && (btn.variant === 'outline' ? "rounded-none" : "bg-[#cc2936] rounded-none border-none")
                )}
              >
                <Link href={btn.link}>
                  {btn.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
