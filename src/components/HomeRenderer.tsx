import dynamic from 'next/dynamic';

// Dynamic imports for all blocks to avoid circular dependencies and improve performance
const componentMap: Record<string, any> = {
  hero: dynamic(() => import('./blocks/HeroBlock').then(m => m.HeroBlock), { ssr: false }),
  heading: dynamic(() => import('./blocks/Heading').then(m => m.Heading), { ssr: false }),
  paragraph: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph), { ssr: false }),
  text: dynamic(() => import('./blocks/Paragraph').then(m => m.Paragraph), { ssr: false }),
  image: dynamic(() => import('./blocks/ImageBlock').then(m => m.ImageBlock), { ssr: false }),
  video: dynamic(() => import('./blocks/VideoBlock').then(m => m.VideoBlock), { ssr: false }),
  quote: dynamic(() => import('./blocks/QuoteBlock').then(m => m.QuoteBlock), { ssr: false }),
  faq: dynamic(() => import('./blocks/FAQBlock').then(m => m.FAQBlock), { ssr: false }),
  timeline: dynamic(() => import('./blocks/TimelineBlock').then(m => m.TimelineBlock), { ssr: false }),
  cards: dynamic(() => import('./blocks/CardsGrid').then(m => m.CardsGrid), { ssr: false }),
  gallery: dynamic(() => import('./blocks/Gallery').then(m => m.Gallery), { ssr: false }),
  table: dynamic(() => import('./blocks/TableBlock').then(m => m.TableBlock), { ssr: false }),
  stats: dynamic(() => import('./blocks/StatsCounter').then(m => m.StatsCounter), { ssr: false }),
  announcements: dynamic(() => import('./blocks/Announcements').then(m => m.AnnouncementsBlock), { ssr: false }),
  'stats-expanded': dynamic(() => import('./blocks/StatsExpanded').then(m => m.StatsExpandedBlock), { ssr: false }),
  'cta-banner': dynamic(() => import('./blocks/CTABanner').then(m => m.CTABannerBlock), { ssr: false }),
  'team-showcase': dynamic(() => import('./blocks/TeamShowcase').then(m => m.TeamShowcaseBlock), { ssr: false }),
  'video-embed': dynamic(() => import('./blocks/VideoEmbed').then(m => m.VideoEmbedBlock), { ssr: false }),
  'image-layout': dynamic(() => import('./blocks/ImageLayout').then(m => m.ImageLayout), { ssr: false }),
  'map-location': dynamic(() => import('./blocks/MapLocation').then(m => m.MapLocationBlock), { ssr: false }),
  'masonry-gallery': dynamic(() => import('./blocks/MasonryGallery').then(m => m.MasonryGallery), { ssr: false }),
  'featured-gallery': dynamic(() => import('./blocks/FeaturedGallery').then(m => m.FeaturedGallery), { ssr: false }),
  'equal-grid-gallery': dynamic(() => import('./blocks/EqualGridGallery').then(m => m.EqualGridGallery), { ssr: false }),
  'horizontal-scroll-gallery': dynamic(() => import('./blocks/HorizontalScrollGallery').then(m => m.HorizontalScrollGallery), { ssr: false }),
  'fullscreen-slideshow': dynamic(() => import('./blocks/FullscreenSlideshow').then(m => m.FullscreenSlideshow), { ssr: false }),
  'video-gallery': dynamic(() => import('./blocks/VideoGallery').then(m => m.VideoGallery), { ssr: false }),
  
  // Layout Blocks
  container: dynamic(() => import('./blocks/Container').then(m => m.Container), { ssr: false }),
  grid: dynamic(() => import('./blocks/Grid').then(m => m.Grid), { ssr: false }),
  columns: dynamic(() => import('./blocks/Columns').then(m => m.Columns), { ssr: false }),
  tabs: dynamic(() => import('./blocks/Tabs').then(m => m.Tabs), { ssr: false }),
  accordion: dynamic(() => import('./blocks/AccordionLayout').then(m => m.AccordionLayout), { ssr: false }),
  carousel: dynamic(() => import('./blocks/Carousel').then(m => m.Carousel), { ssr: false }),
  section: dynamic(() => import('./blocks/SectionWrapper').then(m => m.SectionWrapper), { ssr: false }),
  split: dynamic(() => import('./blocks/SplitLayout').then(m => m.SplitLayout), { ssr: false }),
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
