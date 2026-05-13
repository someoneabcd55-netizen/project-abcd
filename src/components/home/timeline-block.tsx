'use client';

import { cn } from '@/lib/utils';

interface TimelineItem {
  year: string;
  eventTitle: string;
  description: string;
}

interface TimelineBlockProps {
  title?: string;
  subtitle?: string;
  items?: TimelineItem[];
  theme?: string;
}

export function TimelineBlock({ title, subtitle, items, theme }: TimelineBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultItems: TimelineItem[] = [
    { year: '1985', eventTitle: 'Foundation', description: 'Modern School was established with a vision to provide world-class education.' },
    { year: '1995', eventTitle: 'Expansion', description: 'Opening of the new Science and Technology block, doubling our capacity.' },
    { year: '2005', eventTitle: 'Digital Era', description: 'Implementation of campus-wide high-speed internet and smart classrooms.' },
    { year: '2015', eventTitle: 'Global Reach', description: 'Partnered with 10+ international universities for student exchange programs.' },
    { year: '2023', eventTitle: 'Excellence Award', description: 'Ranked #1 in Academic Excellence and Character Building nationally.' },
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={cn(
      "py-20 md:py-32 overflow-hidden",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-24 space-y-4">
          {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Our Legacy</span>}
          <h2 className={cn(
            "text-4xl md:text-7xl font-bold tracking-tight",
            isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
          )}>
            {title || 'Journey of Excellence'}
          </h2>
          <p className={cn(
            "max-w-2xl mx-auto text-lg",
            isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : "text-muted-foreground"
          )}>
            {subtitle || 'Explore the milestones that have shaped our institution into what it is today.'}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central Line */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px",
            isTheme2 ? "bg-indigo-500/30" : isTheme3 ? "bg-navy/10 w-1" : "bg-border",
            "hidden md:block"
          )} />

          <div className="space-y-12 md:space-y-32">
            {displayItems.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={cn(
                  "relative flex flex-col md:flex-row items-center",
                  isEven ? "md:flex-row-reverse" : ""
                )}>
                  {/* Content Panel */}
                  <div className={cn(
                    "w-full md:w-[45%] group",
                    isEven ? "md:text-left" : "md:text-right"
                  )}>
                    <div className={cn(
                      "p-8 md:p-12 transition-all duration-500",
                      isTheme2 
                        ? "bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.08]" 
                        : isTheme3
                          ? "bg-white border-l-4 border-[#cc2936] shadow-sm hover:shadow-2xl rounded-none"
                          : "bg-card border rounded-2xl shadow-sm"
                    )}>
                      <span className={cn(
                        "text-3xl md:text-5xl font-bold mb-4 block",
                        isTheme2 ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent" : 
                        isTheme3 ? "text-navy font-headline" : "text-primary"
                      )}>
                        {item.year}
                      </span>
                      <h3 className={cn(
                        "text-2xl font-bold mb-4",
                        isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase font-headline tracking-tight" : ""
                      )}>
                        {item.eventTitle}
                      </h3>
                      <p className={cn(
                        "text-lg leading-relaxed",
                        isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-gray-500 font-body" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot/Marker */}
                  <div className={cn(
                    "absolute left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center z-10",
                    "hidden md:flex"
                  )}>
                    <div className={cn(
                      "w-4 h-4 rounded-full transition-all duration-500",
                      isTheme2 ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] group-hover:scale-150" : 
                      isTheme3 ? "bg-navy w-4 h-4 rounded-none group-hover:bg-[#cc2936]" :
                      "bg-primary group-hover:scale-125"
                    )} />
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
