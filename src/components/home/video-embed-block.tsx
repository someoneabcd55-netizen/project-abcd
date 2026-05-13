'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface VideoEmbedBlockProps {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  theme?: string;
}

export function VideoEmbedBlock({ 
  title, 
  subtitle, 
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
  thumbnailUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80\u0026w=1200', 
  caption, 
  theme 
}: VideoEmbedBlockProps) {
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
            {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Media Presentation</span>}
            <h2 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight",
              isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
            )}>
              {title || 'Experience Our Campus'}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto text-lg",
              isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : "text-muted-foreground"
            )}>
              {subtitle || 'A visual journey through our state-of-the-art facilities and student life.'}
            </p>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "relative aspect-video overflow-hidden shadow-2xl transition-all duration-700",
            isTheme2 ? "rounded-[3rem] border border-white/10 ring-1 ring-white/5" : 
            isTheme3 ? "rounded-none border-8 border-white" :
            "rounded-3xl"
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
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110",
                    isTheme2 ? "bg-indigo-500/20 backdrop-blur-xl border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.5)]" : 
                    isTheme3 ? "bg-[#cc2936] text-white rounded-none" :
                    "bg-white/90 text-primary shadow-xl"
                  )}>
                    <Play className={cn(
                      "h-8 w-8 md:h-12 md:w-12 fill-current ml-1",
                      isTheme2 ? "text-indigo-400" : isTheme3 ? "text-white" : "text-primary"
                    )} />
                  </div>
                </div>

                {/* Theme 3 Corner Accent */}
                {isTheme3 && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#cc2936] flex items-center justify-center transform translate-x-12 -translate-y-12 rotate-45" />
                )}
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
            <p className={cn(
              "mt-8 text-center text-sm italic",
              isTheme2 ? "text-gray-500 font-body" : isTheme3 ? "text-navy/40 font-body" : "text-muted-foreground"
            )}>
              {caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
