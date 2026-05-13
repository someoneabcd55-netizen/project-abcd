'use client';

import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
}

interface TestimonialsBlockProps {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  theme?: string;
}

export function TestimonialsBlock({ title, subtitle, items, theme }: TestimonialsBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultItems: TestimonialItem[] = [
    { name: 'Sarah Johnson', role: 'Alumni 2022', quote: 'The environment here is simply incredible. The faculty support helped me achieve my dreams.', rating: 5 },
    { name: 'Michael Chen', role: 'Computer Science Major', quote: 'World-class facilities and a vibrant campus life. Best decision of my life.', rating: 5 },
    { name: 'Emma Williams', role: 'Parent', quote: 'As a parent, I am delighted with the holistic development of my child at this institution.', rating: 4 },
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={cn(
      "py-20 md:py-32 overflow-hidden",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-4">
            {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Voices of Excellence</span>}
            <h2 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight",
              isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
            )}>
              {title || 'What Our Community Says'}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto text-lg",
              isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : "text-muted-foreground"
            )}>
              {subtitle || 'Real stories from our students, faculty, and alumni across the globe.'}
            </p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, i) => (
            <div 
              key={i}
              className={cn(
                "relative p-8 transition-all duration-500 group",
                isTheme2 
                  ? "bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] hover:-translate-y-2 shadow-2xl" 
                  : isTheme3
                    ? "bg-white border border-gray-100 hover:border-navy shadow-sm hover:shadow-2xl rounded-none"
                    : "bg-card border rounded-2xl hover:border-primary shadow-sm"
              )}
            >
              {isTheme3 && (
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Quote className="h-12 w-12 text-navy" />
                </div>
              )}
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, starI) => (
                  <Star 
                    key={starI}
                    className={cn(
                      "h-4 w-4",
                      starI < (item.rating || 5) 
                        ? (isTheme2 ? "text-indigo-400 fill-indigo-400" : isTheme3 ? "text-[#cc2936] fill-[#cc2936]" : "text-yellow-400 fill-yellow-400")
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>

              <blockquote className={cn(
                "text-lg mb-8 italic leading-relaxed",
                isTheme2 ? "text-gray-300 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-card-foreground"
              )}>
                "{item.quote}"
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100/10">
                <Avatar className={cn(
                  "h-12 w-12",
                  isTheme3 ? "rounded-none ring-2 ring-[#cc2936]/20" : ""
                )}>
                  <AvatarImage src={item.avatarUrl} alt={item.name} />
                  <AvatarFallback className={isTheme2 ? "bg-indigo-600" : isTheme3 ? "bg-navy text-white" : ""}>
                    {item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className={cn(
                    "font-bold text-sm",
                    isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase font-headline tracking-wider" : ""
                  )}>
                    {item.name}
                  </h4>
                  <p className={cn(
                    "text-xs",
                    isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936] font-bold uppercase tracking-widest text-[8px]" : "text-muted-foreground"
                  )}>
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
