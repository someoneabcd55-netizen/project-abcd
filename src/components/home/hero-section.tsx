'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

interface HeroProps { 
    imageurl?: string; 
    title?: string; 
    subtitle?: string; 
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    overlayType?: 'none' | 'blue' | 'dark' | 'gradient' | 'modern-blue';
    theme?: string;
}

export function HeroSection({ 
    imageurl, 
    title, 
    subtitle, 
    primaryCtaLabel, 
    primaryCtaUrl, 
    secondaryCtaLabel, 
    secondaryCtaUrl,
    overlayType = 'blue',
    theme
}: HeroProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  if (isTheme2) {
     // ... Theme 2 code (already there)
     return (
        <section className="relative min-h-[90vh] w-full overflow-hidden bg-[#0a0f1e] flex items-center">
            {/* ... */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse duration-[5000ms]" />
            
            <div className="container relative z-10 grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">
                        Welcome to Excellence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-headline">
                        {title || 'Modern School'}
                    </h1>
                    <p className="max-w-xl text-lg md:text-xl text-gray-400 font-body leading-relaxed">
                        {subtitle || 'Shape your future with world-class education and a vibrant campus life.'}
                    </p>
                    <div className="flex flex-wrap gap-5 pt-4">
                        {primaryCtaLabel && primaryCtaUrl && (
                             <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all px-10 h-14 shadow-[0_0_20px_rgba(99,102,241,0.4)] border-none font-semibold">
                                 <Link href={primaryCtaUrl}>{primaryCtaLabel}</Link>
                             </Button>
                        )}
                         {secondaryCtaLabel && secondaryCtaUrl && (
                             <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-[#0a0f1e] px-10 h-14 font-semibold backdrop-blur-sm">
                                 <Link href={secondaryCtaUrl}>{secondaryCtaLabel}</Link>
                             </Button>
                          )}
                    </div>
                </div>

                <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                         {imageurl && <Image src={imageurl} alt={title || 'Hero'} width={800} height={600} className="object-cover" priority />}
                    </div>
                    <div className="absolute -bottom-10 -left-10 z-20 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl max-w-xs animate-bounce-slow">
                        <p className="text-white font-headline text-lg italic leading-relaxed">
                            "The best way to predict the future is to create it."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">MS</div>
                            <div>
                                <p className="text-white text-sm font-bold">Admissions 2024</p>
                                <p className="text-gray-400 text-xs">Applications are now open</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 6s ease-in-out infinite;
                }
            `}</style>
        </section>
     );
  }

  if (isTheme3) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-[#0d1b3e] flex items-center pt-20">
         {/* Subtle texture overlay */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         
         <div className="container relative z-10 grid gap-16 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-[#cc2936] animate-pulse" />
                  <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">EST. · EXCELLENCE IN EDUCATION</span>
               </div>
               
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.85] font-headline uppercase">
                  {title || 'Leadership & Discipline'}
               </h1>
               
               <p className="max-w-xl text-xl text-gray-400 font-body leading-relaxed border-l-2 border-[#cc2936] pl-6">
                  {subtitle || 'Empowering the next generation of leaders through rigorous academic standards and character building.'}
               </p>
               
               <div className="flex flex-wrap gap-6 pt-4">
                  <Button asChild size="lg" className="h-16 px-10 bg-[#cc2936] hover:bg-[#b0232d] text-white rounded-none uppercase font-bold tracking-widest border-none transition-all hover:translate-y-[-2px]">
                     <Link href={primaryCtaUrl || '#'}>{primaryCtaLabel || 'Join NCC'}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-16 px-10 border-white/20 text-white rounded-none uppercase font-bold tracking-widest hover:bg-white hover:text-[#0d1b3e] transition-all">
                     <Link href={secondaryCtaUrl || '#'}>Our History</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-16 px-10 border-white/20 text-white rounded-none uppercase font-bold tracking-widest hover:bg-white hover:text-[#0d1b3e] transition-all">
                     <Link href="#">Portal</Link>
                  </Button>
               </div>
            </div>

            {/* Right Content: Floating Card */}
            <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
               <div className="relative z-10 p-10 md:p-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-none shadow-2xl">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#cc2936]" />
                  <GraduationCap className="h-12 w-12 text-[#cc2936] mb-8" />
                  <h3 className="text-white font-headline text-3xl uppercase mb-6 leading-tight">The Institutional Pledge</h3>
                  <p className="text-gray-300 font-body text-lg italic leading-relaxed mb-10">
                     "We the cadets of the National Cadet Corps, do solemnly pledge that we shall always uphold the unity and integrity of our nation."
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                     <span className="px-4 py-1.5 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 text-[10px] font-bold uppercase tracking-widest">Courage</span>
                     <span className="px-4 py-1.5 bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest">Duty</span>
                     <span className="px-4 py-1.5 bg-[#16a34a]/20 text-[#16a34a] border border-[#16a34a]/30 text-[10px] font-bold uppercase tracking-widest">Honour</span>
                  </div>
               </div>
               
               {/* Background image decoration */}
               <div className="absolute -top-10 -right-10 w-full h-full border-2 border-white/5 -z-10" />
            </div>
         </div>
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      {/* ... Theme 1 code (already there) */}
      <div className="absolute inset-0">
        {imageurl && <Image src={imageurl} alt={title || 'hero'} fill className="object-cover" priority />}
        {overlayType === 'blue' && <div className="absolute inset-0 bg-primary/70" />}
        {overlayType === 'dark' && <div className="absolute inset-0 bg-black/50" />}
        {overlayType === 'gradient' && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />}
        {overlayType === 'modern-blue' && <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-transparent" />}
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
        {title && (
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          {primaryCtaLabel && primaryCtaUrl && (
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 shadow-lg transition-transform hover:scale-105">
                <Link href={primaryCtaUrl}>{primaryCtaLabel}</Link>
            </Button>
          )}
          {secondaryCtaLabel && secondaryCtaUrl && (
             <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-full px-8 shadow-lg transition-transform hover:scale-105">
                <Link href={secondaryCtaUrl}>{secondaryCtaLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
