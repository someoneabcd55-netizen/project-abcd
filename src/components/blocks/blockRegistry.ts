'use client';

// Block Registry for Recursive Renderer
import { HeroBlock } from './HeroBlock';
import { Heading } from './Heading';
import { Paragraph } from './Paragraph';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';
import { QuoteBlock } from './QuoteBlock';
import { FAQBlock } from './FAQBlock';
import { TimelineBlock } from './TimelineBlock';
import { CardsGrid } from './CardsGrid';
import { Gallery } from './Gallery';
import { TableBlock } from './TableBlock';
import { StatsCounter } from './StatsCounter';
import { AnnouncementsBlock } from './Announcements';
import { CTABannerBlock } from './CTABanner';
import { MapLocationBlock } from './MapLocation';
import { StatsExpandedBlock } from './StatsExpanded';
import { TeamShowcaseBlock } from './TeamShowcase';
import { VideoEmbedBlock } from './VideoEmbed';
import { ImageLayout } from './ImageLayout';
import { MasonryGallery } from './MasonryGallery';
import { FeaturedGallery } from './FeaturedGallery';
import { EqualGridGallery } from './EqualGridGallery';
import { HorizontalScrollGallery } from './HorizontalScrollGallery';
import { FullscreenSlideshow } from './FullscreenSlideshow';
import { VideoGallery } from './VideoGallery';

// Layout Blocks
import { Container } from './Container';
import { Grid } from './Grid';
import { Columns } from './Columns';
import { Tabs } from './Tabs';
import { AccordionLayout } from './AccordionLayout';
import { Carousel } from './Carousel';
import { SectionWrapper } from './SectionWrapper';
import { SplitLayout } from './SplitLayout';

export const componentMap: Record<string, any> = {
  // Content Blocks
  hero: HeroBlock,
  heading: Heading,
  paragraph: Paragraph,
  text: Paragraph, // Alias for legacy 'text' type
  image: ImageBlock,
  video: VideoBlock,
  quote: QuoteBlock,
  faq: FAQBlock,
  timeline: TimelineBlock,
  cards: CardsGrid,
  gallery: Gallery,
  table: TableBlock,
  stats: StatsCounter,
  announcements: AnnouncementsBlock,
  'stats-expanded': StatsExpandedBlock,
  'cta-banner': CTABannerBlock,
  'team-showcase': TeamShowcaseBlock,
  'video-embed': VideoEmbedBlock,
  'image-layout': ImageLayout,
  'map-location': MapLocationBlock,
  'masonry-gallery': MasonryGallery,
  'featured-gallery': FeaturedGallery,
  'equal-grid-gallery': EqualGridGallery,
  'horizontal-scroll-gallery': HorizontalScrollGallery,
  'fullscreen-slideshow': FullscreenSlideshow,
  'video-gallery': VideoGallery,
  
  // Layout Blocks
  container: Container,
  grid: Grid,
  columns: Columns,
  tabs: Tabs,
  accordion: AccordionLayout,
  carousel: Carousel,
  section: SectionWrapper,
  split: SplitLayout,
};
