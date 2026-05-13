'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for all blocks to avoid circular dependencies and improve performance
const componentMap: Record<string, any> = {
  hero: dynamic(() => import('./blocks/HeroBlock').then(m => m.HeroBlock)),
  heading: dynamic(() => import('./blocks/Heading').then(m => m.Heading)),
  paragraph: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph)),
  text: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph)),
  image: dynamic(() => import('./blocks/ImageBlock').then(m => m.ImageBlock)),
  video: dynamic(() => import('./blocks/VideoBlock').then(m => m.VideoBlock)),
  quote: dynamic(() => import('./blocks/QuoteBlock').then(m => m.QuoteBlock)),
  faq: dynamic(() => import('./blocks/FAQBlock').then(m => m.FAQBlock)),
  timeline: dynamic(() => import('./blocks/TimelineBlock').then(m => m.TimelineBlock)),
  cards: dynamic(() => import('./blocks/CardsGrid').then(m => m.CardsGrid)),
  gallery: dynamic(() => import('./blocks/Gallery').then(m => m.Gallery)),
  table: dynamic(() => import('./blocks/TableBlock').then(m => m.TableBlock)),
  stats: dynamic(() => import('./blocks/StatsCounter').then(m => m.StatsCounter)),
  announcements: dynamic(() => import('./blocks/Announcements').then(m => m.AnnouncementsBlock)),
  'stats-expanded': dynamic(() => import('./blocks/StatsExpanded').then(m => m.StatsExpandedBlock)),
  'cta-banner': dynamic(() => import('./blocks/CTABanner').then(m => m.CTABannerBlock)),
  'team-showcase': dynamic(() => import('./blocks/TeamShowcase').then(m => m.TeamShowcaseBlock)),
  'video-embed': dynamic(() => import('./blocks/VideoEmbed').then(m => m.VideoEmbedBlock)),
  'image-layout': dynamic(() => import('./blocks/ImageLayout').then(m => m.ImageLayout)),
  'map-location': dynamic(() => import('./blocks/MapLocation').then(m => m.MapLocationBlock)),
  'masonry-gallery': dynamic(() => import('./blocks/MasonryGallery').then(m => m.MasonryGallery)),
  'featured-gallery': dynamic(() => import('./blocks/FeaturedGallery').then(m => m.FeaturedGallery)),
  'equal-grid-gallery': dynamic(() => import('./blocks/EqualGridGallery').then(m => m.EqualGridGallery)),
  'horizontal-scroll-gallery': dynamic(() => import('./blocks/HorizontalScrollGallery').then(m => m.HorizontalScrollGallery)),
  'fullscreen-slideshow': dynamic(() => import('./blocks/FullscreenSlideshow').then(m => m.FullscreenSlideshow)),
  'video-gallery': dynamic(() => import('./blocks/VideoGallery').then(m => m.VideoGallery)),
  
  // Layout Blocks
  container: dynamic(() => import('./blocks/Container').then(m => m.Container)),
  grid: dynamic(() => import('./blocks/Grid').then(m => m.Grid)),
  columns: dynamic(() => import('./blocks/Columns').then(m => m.Columns)),
  tabs: dynamic(() => import('./blocks/Tabs').then(m => m.Tabs)),
  accordion: dynamic(() => import('./blocks/AccordionLayout').then(m => m.AccordionLayout)),
  carousel: dynamic(() => import('./blocks/Carousel').then(m => m.Carousel)),
  section: dynamic(() => import('./blocks/SectionWrapper').then(m => m.SectionWrapper)),
  split: dynamic(() => import('./blocks/SplitLayout').then(m => m.SplitLayout)),
};

export interface BlockData {
  id: string;
  type: string;
  visible: boolean;
  data: any;
}

export default function HomeRenderer({ blocks, theme }: { blocks: BlockData[], theme?: string }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((b) => {
        if (!b.visible) return null;
        
        const Component = componentMap[b.type];
        
        if (!Component) {
            console.warn(`No component found for block type: ${b.type}`);
            return (
                <div key={b.id} className="container mx-auto my-4 p-4 border border-dashed border-red-400">
                    <p className="text-red-500 font-bold">Unknown block type: {b.type}</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded-md mt-2">{JSON.stringify(b.data, null, 2)}</pre>
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
