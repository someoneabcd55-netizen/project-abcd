'use client';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  theme?: string;
}

export function PageHeader({ eyebrow, title, description, theme }: PageHeaderProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  if (isTheme2) {
    return (
      <section className="relative w-full bg-[var(--surface)] py-20 lg:py-32 overflow-hidden">
        {/* Orbs for atmosphere */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-indigo-600/5 rounded-full blur-[100px]" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl">
            {eyebrow && (
              <div className="mb-6 text-[var(--accent)] text-xs font-bold tracking-[0.3em] uppercase">
                {eyebrow}
              </div>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-headline leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
              {title}
            </h1>
            {description && (
              <p className="mt-8 text-xl text-[var(--text-secondary)] font-body max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Decorative lines at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] flex">
            <div className="flex-1 bg-indigo-500 h-full" />
            <div className="flex-1 bg-purple-600 h-full" />
        </div>
      </section>
    );
  }

  if (isTheme3) {
    return (
      <section className="relative w-full bg-[#0d1b3e] pt-24 pb-32 overflow-hidden">
         <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-5xl">
              {eyebrow && (
                <div className="mb-8 text-[#cc2936] text-sm font-bold tracking-[0.4em] uppercase">
                  {eyebrow}
                </div>
              )}
              <h1 className="text-6xl md:text-8xl font-bold text-white font-headline leading-[0.9] uppercase animate-in fade-in slide-in-from-left-8 duration-700">
                {title}
              </h1>
              {description && (
                <p className="mt-10 text-xl text-gray-400 font-body max-w-3xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                  {description}
                </p>
              )}
            </div>
         </div>

         {/* Bottom decorative lines */}
         <div className="absolute bottom-0 left-0 w-full flex flex-col">
            <div className="h-1 bg-[#cc2936] w-full" />
            <div className="h-1 bg-[#16a34a] w-full opacity-60" />
         </div>
      </section>
    );
  }

  return (
    <section className="bg-primary py-12 text-primary-foreground lg:py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg opacity-90">{description}</p>}
      </div>
    </section>
  );
}
