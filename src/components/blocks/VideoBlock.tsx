'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface VideoProps {
  videoType: 'youtube' | 'vimeo' | 'direct';
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  autoplay?: boolean;
  showControls?: boolean;
  width?: 'full' | 'large' | 'medium';
  alignment?: 'left' | 'center' | 'right';
  rounded?: boolean;
  shadow?: boolean;
}

export function VideoBlock({
  videoType,
  videoUrl,
  thumbnailUrl,
  title,
  subtitle,
  aspectRatio = '16:9',
  autoplay = false,
  showControls = true,
  width = 'large',
  alignment = 'center',
  rounded = true,
  shadow = true,
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const aspectClass = { '16:9': 'aspect-video', '4:3': 'aspect-[4/3]', '1:1': 'aspect-square' }[aspectRatio];
  const widthClass = { full: 'w-full', large: 'max-w-5xl', medium: 'max-w-2xl' }[width];
  const alignClass = { left: 'mr-auto', center: 'mx-auto', right: 'ml-auto' }[alignment];

  const getEmbedUrl = () => {
    if (videoType === 'youtube') {
      const id = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}&controls=${showControls ? 1 : 0}`;
    }
    if (videoType === 'vimeo') {
      const id = videoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${id}?autoplay=${isPlaying ? 1 : 0}`;
    }
    return videoUrl;
  };

  return (
    <section className={cn("w-full py-8 px-6", alignClass, widthClass)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <div className={cn(
        "relative overflow-hidden group",
        aspectClass,
        rounded && "rounded-2xl",
        shadow && "shadow-2xl"
      )}>
        {!isPlaying && thumbnailUrl ? (
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                <Play className="text-white fill-white w-8 h-8 ml-1" />
              </div>
            </div>
          </div>
        ) : (
          videoType === 'direct' ? (
            <video src={videoUrl} controls={showControls} autoPlay={autoplay} className="w-full h-full object-cover" />
          ) : (
            <iframe 
              src={getEmbedUrl()} 
              className="w-full h-full border-none" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
            />
          )
        )}
      </div>
    </section>
  );
}
