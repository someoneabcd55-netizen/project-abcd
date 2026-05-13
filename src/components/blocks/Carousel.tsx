'use client';

import React from 'react';
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselProps {
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesVisible?: 1 | 2 | 3;
  gap?: 'sm' | 'md' | 'lg';
  slides: { childBlocks: any[] }[];
  Renderer: React.ComponentType<{ blocks: any[], theme?: string }>;
  theme?: string;
}

export function Carousel({
  showArrows = true,
  slides = [],
  Renderer,
  theme,
}: CarouselProps) {
  return (
    <section className="py-20 px-6 w-full">
      <ShadcnCarousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="-ml-4">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="pl-4 md:basis-1/1 lg:basis-1/1">
              <div className="p-1">
                <Renderer blocks={slide.childBlocks} theme={theme} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && (
          <>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </>
        )}
      </ShadcnCarousel>
    </section>
  );
}

