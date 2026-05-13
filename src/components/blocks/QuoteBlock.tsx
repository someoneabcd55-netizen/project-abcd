'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';

interface QuoteProps {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  rating?: number;
  style?: 'simple' | 'card' | 'large-quote' | 'with-avatar';
  alignment?: 'left' | 'center' | 'right';
  background?: string;
  accentColor?: string;
}

export function QuoteBlock({
  quote,
  authorName,
  authorRole,
  authorAvatar,
  rating,
  style = 'card',
  alignment = 'center',
  background,
  accentColor,
}: QuoteProps) {
  
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[alignment];
  const accent = accentColor || 'var(--accent-color)';

  if (style === 'large-quote') {
    return (
      <section className={cn("w-full py-20 px-6", alignClass)} style={{ backgroundColor: background }}>
        <div className="max-w-4xl mx-auto">
          <Quote className="w-16 h-16 opacity-20 mb-6 inline-block" style={{ color: accent }} />
          <blockquote className="text-3xl md:text-5xl font-headline italic font-medium leading-tight mb-8">
            "{quote}"
          </blockquote>
          <div className="font-body">
            <p className="text-xl font-bold">{authorName}</p>
            {authorRole && <p className="text-muted-foreground">{authorRole}</p>}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'card') {
    return (
      <section className="py-12 px-6 flex justify-center" style={{ backgroundColor: background }}>
        <div className="max-w-2xl p-10 relative overflow-hidden bg-white dark:bg-gray-900 border shadow-lg rounded-2xl">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accent }} />
          {rating && (
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
              ))}
            </div>
          )}
          <p className="text-lg italic mb-8 leading-relaxed">"{quote}"</p>
          <div className="flex items-center gap-4">
            {authorAvatar && <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: accent }} />}
            <div>
              <p className="font-bold">{authorName}</p>
              {authorRole && <p className="text-sm text-muted-foreground">{authorRole}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-8 px-6", alignClass)} style={{ backgroundColor: background }}>
       <div className="max-w-3xl mx-auto">
          <p className="text-xl italic mb-4">"{quote}"</p>
          <p className="font-bold">— {authorName}, <span className="font-normal text-muted-foreground">{authorRole}</span></p>
       </div>
    </section>
  );
}
