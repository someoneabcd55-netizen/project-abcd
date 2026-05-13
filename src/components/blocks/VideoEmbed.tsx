'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export function VideoEmbedBlock({ 
  title, 
  subtitle, 
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
  thumbnailUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200', 
  caption, 
  theme 
}: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0d1b3e]" : isTheme3 ? "bg-[#f4f6f9]" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-4">
            <h2 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight font-headline",
              isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase" : "text-foreground"
            )}>
              {title || 'Experience Our Campus'}
            </h2>
            {subtitle && <p className="max-w-2xl mx-auto text-lg opacity-80">{subtitle}</p>}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "relative aspect-video overflow-hidden shadow-2xl transition-all duration-700 rounded-3xl",
            isTheme3 && "rounded-none border-8 border-white"
          )}>
            {!isPlaying ? (
              <div className="absolute inset-0 z-10 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <Image 
                  src={thumbnailUrl} 
                  alt={title || 'Video thumbnail'} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 bg-white/90 text-primary shadow-xl",
                    isTheme3 && "bg-[#cc2936] text-white rounded-none"
                  )}>
                    <Play className="h-8 w-8 md:h-12 md:w-12 fill-current ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={title || 'Video Player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
          
          {caption && (
            <p className="mt-8 text-center text-sm italic text-muted-foreground">
              {caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
