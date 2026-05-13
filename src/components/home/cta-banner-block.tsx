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

interface CTABannerBlockProps {
  heading?: string;
  subtext?: string;
  btns?: CTAButton[];
  bgType?: 'solid' | 'gradient' | 'image';
  bgValue?: string;
  theme?: string;
}

export function CTABannerBlock({ 
  heading, 
  subtext, 
  btns, 
  bgType = 'solid', 
  bgValue, 
  theme 
}: CTABannerBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultBtns: CTAButton[] = [
    { label: 'Apply Now', link: '/admissions', variant: 'primary' },
    { label: 'Learn More', link: '/about', variant: 'outline' },
  ];

  const displayBtns = btns || defaultBtns;

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
        {/* Decorative elements for Theme 2 */}
        {isTheme2 && !bgValue && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </>
        )}

        <div className="container relative z-10 px-4 max-w-4xl space-y-10">
          {isTheme3 && <span className="text-[#cc2936] text-sm font-bold uppercase tracking-[0.4em] block animate-in fade-in slide-in-from-bottom-4">Institutional Call to Action</span>}
          
          <h2 className={cn(
            "text-4xl md:text-7xl font-bold tracking-tight leading-tight text-white",
            isTheme2 ? "font-headline" : isTheme3 ? "font-headline uppercase" : "font-headline"
          )}>
            {heading || 'Ready to Shape Your Future?'}
          </h2>
          
          <p className={cn(
            "text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-body leading-relaxed",
            isTheme3 && "border-l-2 border-[#cc2936] pl-6"
          )}>
            {subtext || 'Join our vibrant community of learners and leaders. Admissions are now open for the next academic year.'}
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
                  isTheme2 
                    ? (btn.variant === 'outline' ? "border-white/20 text-white hover:bg-white hover:text-navy" : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-2xl hover:scale-105") 
                    : isTheme3
                      ? (btn.variant === 'outline' ? "bg-transparent border-white/20 text-white rounded-none hover:bg-white hover:text-navy" : "bg-[#cc2936] hover:bg-[#b0232d] text-white rounded-none border-none")
                      : "rounded-full"
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

