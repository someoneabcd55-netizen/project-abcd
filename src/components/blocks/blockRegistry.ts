'use client';

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK REGISTRY — Single source of truth for all block type → component mappings
// HomeRenderer reads from this file. Any new block must be added here.
// ─────────────────────────────────────────────────────────────────────────────

import { HeroBlock } from './HeroBlock';
import { Heading } from './Heading';
import { Paragraph } from './Paragraph';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';
import { QuoteBlock } from './QuoteBlock';
import { FAQBlock } from './FAQBlock';
import { TimelineBlock } from './TimelineBlock';
import { CardsGrid } from './CardsGrid';
import { Glimpses } from './Glimpses';
import { TableBlock } from './TableBlock';
import { StatsCounter } from './StatsCounter';
import { AnnouncementsBlock } from './Announcements';
import { CTABannerBlock } from './CTABanner';
import { MapLocationBlock } from './MapLocation';
import { StatsExpandedBlock } from './StatsExpanded';
import { TeamShowcaseBlock } from './TeamShowcase';
import { VideoEmbedBlock } from './VideoEmbed';
import { ImageLayout } from './ImageLayout';
import { MasonryGlimpses } from './MasonryGlimpses';
import { FeaturedGlimpses } from './FeaturedGlimpses';
import { EqualGridGlimpses } from './EqualGridGlimpses';
import { HorizontalScrollGlimpses } from './HorizontalScrollGlimpses';
import { FullscreenSlideshow } from './FullscreenSlideshow';
import { VideoGlimpses } from './VideoGlimpses';

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
  // ── Content Blocks ──────────────────────────────────────────────────────────
  hero:              HeroBlock,
  'hero-block':      HeroBlock,
  'hero-section':    HeroBlock,
  heading:           Heading,
  h1:                Heading,
  h2:                Heading,
  h3:                Heading,
  paragraph:         Paragraph,
  text:              Paragraph,
  'text-block':      Paragraph,
  'rich-text':       Paragraph,
  image:             ImageBlock,
  'image-block':     ImageBlock,
  video:             VideoBlock,
  'video-block':     VideoBlock,
  quote:             QuoteBlock,
  'quote-block':     QuoteBlock,
  faq:               FAQBlock,
  'faq-block':       FAQBlock,
  timeline:          TimelineBlock,
  'timeline-block':  TimelineBlock,
  cards:             CardsGrid,
  'cards-grid':      CardsGrid,
  'card-grid':       CardsGrid,
  table:             TableBlock,
  'table-block':     TableBlock,
  stats:             StatsCounter,
  'stats-counter':   StatsCounter,
  announcements:     AnnouncementsBlock,
  'stats-expanded':  StatsExpandedBlock,
  'cta-banner':      CTABannerBlock,
  'cta':             CTABannerBlock,
  'team-showcase':   TeamShowcaseBlock,
  'team':            TeamShowcaseBlock,
  'video-embed':     VideoEmbedBlock,
  'image-layout':    ImageLayout,
  'map-location':    MapLocationBlock,
  map:               MapLocationBlock,

  // ── Glimpses / Gallery blocks (current names) ────────────────────────────────
  glimpses:                    Glimpses,
  'masonry-glimpses':          MasonryGlimpses,
  'featured-glimpses':         FeaturedGlimpses,
  'equal-grid-glimpses':       EqualGridGlimpses,
  'horizontal-scroll-glimpses': HorizontalScrollGlimpses,
  'fullscreen-slideshow':      FullscreenSlideshow,
  'slideshow':                 FullscreenSlideshow,
  'video-glimpses':            VideoGlimpses,

  // ── Legacy gallery aliases (database may still store these exact strings) ────
  gallery:                     Glimpses,
  'masonry-gallery':           MasonryGlimpses,
  'featured-gallery':          FeaturedGlimpses,
  'equal-grid-gallery':        EqualGridGlimpses,
  'horizontal-scroll-gallery': HorizontalScrollGlimpses,
  'video-gallery':             VideoGlimpses,

  // ── Layout Blocks ────────────────────────────────────────────────────────────
  container:         Container,
  grid:              Grid,
  columns:           Columns,
  column:            Columns,
  tabs:              Tabs,
  accordion:         AccordionLayout,
  'accordion-layout': AccordionLayout,
  carousel:          Carousel,
  section:           SectionWrapper,
  'section-wrapper': SectionWrapper,
  split:             SplitLayout,
  'split-layout':    SplitLayout,
};
