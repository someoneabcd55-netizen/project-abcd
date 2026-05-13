'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for all blocks to avoid circular dependencies and improve performance
const componentMap: Record<string, any> = {
  // Content Blocks
  hero: dynamic(() => import('./blocks/HeroBlock').then(m => m.HeroBlock)),
  'hero-block': dynamic(() => import('./blocks/HeroBlock').then(m => m.HeroBlock)),
  heading: dynamic(() => import('./blocks/Heading').then(m => m.Heading)),
  paragraph: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph)),
  text: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph)),
  image: dynamic(() => import('./blocks/ImageBlock').then(m => m.ImageBlock)),
  video: dynamic(() => import('./blocks/VideoBlock').then(m => m.VideoBlock)),
  quote: dynamic(() => import('./blocks/QuoteBlock').then(m => m.QuoteBlock)),
  faq: dynamic(() => import('./blocks/FAQBlock').then(m => m.FAQBlock)),
  timeline: dynamic(() => import('./blocks/TimelineBlock').then(m => m.TimelineBlock)),
  cards: dynamic(() => import('./blocks/CardsGrid').then(m => m.CardsGrid)),
  glimpses: dynamic(() => import('./blocks/Glimpses').then(m => m.Glimpses)),
  table: dynamic(() => import('./blocks/TableBlock').then(m => m.TableBlock)),
  stats: dynamic(() => import('./blocks/StatsCounter').then(m => m.StatsCounter)),
  announcements: dynamic(() => import('./blocks/Announcements').then(m => m.AnnouncementsBlock)),
  'stats-expanded': dynamic(() => import('./blocks/StatsExpanded').then(m => m.StatsExpandedBlock)),
  'cta-banner': dynamic(() => import('./blocks/CTABanner').then(m => m.CTABannerBlock)),
  'team-showcase': dynamic(() => import('./blocks/TeamShowcase').then(m => m.TeamShowcaseBlock)),
  'video-embed': dynamic(() => import('./blocks/VideoEmbed').then(m => m.VideoEmbedBlock)),
  'image-layout': dynamic(() => import('./blocks/ImageLayout').then(m => m.ImageLayout)),
  'map-location': dynamic(() => import('./blocks/MapLocation').then(m => m.MapLocationBlock)),
  'masonry-glimpses': dynamic(() => import('./blocks/MasonryGlimpses').then(m => m.MasonryGlimpses)),
  'featured-glimpses': dynamic(() => import('./blocks/FeaturedGlimpses').then(m => m.FeaturedGlimpses)),
  'equal-grid-glimpses': dynamic(() => import('./blocks/EqualGridGlimpses').then(m => m.EqualGridGlimpses)),
  'horizontal-scroll-glimpses': dynamic(() => import('./blocks/HorizontalScrollGlimpses').then(m => m.HorizontalScrollGlimpses)),
  'fullscreen-slideshow': dynamic(() => import('./blocks/FullscreenSlideshow').then(m => m.FullscreenSlideshow)),
  'video-glimpses': dynamic(() => import('./blocks/VideoGlimpses').then(m => m.VideoGlimpses)),
  
  // Layout Blocks
  container: dynamic(() => import('./blocks/Container').then(m => m.Container)),
  grid: dynamic(() => import('./blocks/Grid').then(m => m.Grid)),
  columns: dynamic(() => import('./blocks/Columns').then(m => m.Columns)),
  column: dynamic(() => import('./blocks/Columns').then(m => m.Columns)),
  tabs: dynamic(() => import('./blocks/Tabs').then(m => m.Tabs)),
  accordion: dynamic(() => import('./blocks/AccordionLayout').then(m => m.AccordionLayout)),
  carousel: dynamic(() => import('./blocks/Carousel').then(m => m.Carousel)),
  section: dynamic(() => import('./blocks/SectionWrapper').then(m => m.SectionWrapper)),
  'section-wrapper': dynamic(() => import('./blocks/SectionWrapper').then(m => m.SectionWrapper)),
  split: dynamic(() => import('./blocks/SplitLayout').then(m => m.SplitLayout)),
  'split-layout': dynamic(() => import('./blocks/SplitLayout').then(m => m.SplitLayout)),
};

export interface BlockData {
  id: string;
  type: string;
  visible: boolean;
  data: any;
}

export default function HomeRenderer({ blocks, theme }: { blocks: BlockData[], theme?: string }) {
  // Debug log to see exactly what block types are coming from the database
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      console.log('Renderer [Blocks Data]:', blocks.map(b => ({ id: b.id, type: b.type, visible: b.visible })));
    }
  }, [blocks]);

  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((b) => {
        if (!b.visible) return null;
        
        // Normalize the block type to handle casing or whitespace issues from the database
        const normalizedType = b.type?.toLowerCase()?.trim();
        const Component = componentMap[normalizedType];
        
        if (!Component) {
            console.warn(`[HomeRenderer] Unknown block type: "${b.type}" (Normalized: "${normalizedType}")`);
            return (
                <div key={b.id} className="container mx-auto my-8 p-6 border-2 border-dashed border-red-200 rounded-2xl bg-red-50/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-red-600 font-bold uppercase tracking-widest text-[10px]">Unknown block type: {b.type}</p>
                    </div>
                    <pre className="text-[10px] font-mono text-gray-500 bg-white/80 p-4 rounded-xl border border-red-100 overflow-auto max-h-40">
                        {JSON.stringify(b.data, null, 2)}
                    </pre>
                </div>
            );
        }

        return (
          <Component 
            key={b.id} 
            theme={theme} 
            {...b.data} 
            Renderer={HomeRenderer} 
          />
        );
      })}
    </>
  );
}

