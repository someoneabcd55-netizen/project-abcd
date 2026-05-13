import * as z from 'zod';

// --- SHARED SCHEMAS ---
export const buttonSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  link: z.string().min(1, 'Link is required'),
  style: z.enum(['solid', 'outlined', 'ghost']).default('solid'),
});

// --- CONTENT BLOCKS ---

export const heroBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  titleAccentWords: z.array(z.string()).default([]),
  subtitle: z.string().optional(),
  backgroundType: z.enum(['image', 'gradient', 'solid', 'video']).default('image'),
  backgroundValue: z.string().min(1, 'Background value is required'),
  overlayOpacity: z.number().min(0).max(100).default(50),
  layout: z.enum(['centered', 'split-left', 'split-right']).default('centered'),
  buttons: z.array(buttonSchema).default([]),
  floatingCard: z.object({
    title: z.string(),
    body: z.string(),
    badges: z.array(z.string()).optional(),
  }).optional(),
  animation: z.enum(['none', 'fadeInUp', 'fadeInLeft', 'zoomIn']).default('fadeInUp'),
  minHeight: z.enum(['auto', '50vh', '75vh', '100vh']).default('75vh'),
});

export const headingBlockSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  size: z.enum(['h1', 'h2', 'h3', 'h4']).default('h2'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  color: z.string().optional(),
  fontWeight: z.enum(['normal', 'semibold', 'bold', 'extrabold']).default('bold'),
  eyebrowLabel: z.string().optional(),
  underlineAccent: z.boolean().default(false),
  spacing: z.enum(['tight', 'normal', 'loose']).default('normal'),
  animation: z.enum(['none', 'fadeIn', 'slideUp']).default('none'),
});

export const paragraphBlockSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  alignment: z.enum(['left', 'center', 'right']).default('left'),
  fontSize: z.enum(['sm', 'base', 'lg', 'xl']).default('base'),
  color: z.string().optional(),
  maxWidth: z.enum(['full', 'prose', 'narrow']).default('prose'),
  background: z.string().optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  animation: z.enum(['none', 'fadeIn']).default('none'),
});

export const imageBlockSchema = z.object({
  src: z.string().url('A valid image URL is required'),
  alt: z.string().min(1, 'Alt text is required'),
  caption: z.string().optional(),
  width: z.enum(['full', 'large', 'medium', 'small']).default('large'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  rounded: z.enum(['none', 'sm', 'md', 'lg', 'full']).default('md'),
  shadow: z.boolean().default(false),
  linkUrl: z.string().optional(),
  animation: z.enum(['none', 'fadeIn', 'zoomIn']).default('none'),
  aspectRatio: z.enum(['auto', '16:9', '4:3', '1:1', '3:2']).default('auto'),
});

export const videoBlockSchema = z.object({
  videoType: z.enum(['youtube', 'vimeo', 'direct']).default('youtube'),
  videoUrl: z.string().min(1, 'Video URL is required'),
  thumbnailUrl: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1']).default('16:9'),
  autoplay: z.boolean().default(false),
  showControls: z.boolean().default(true),
  width: z.enum(['full', 'large', 'medium']).default('large'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  rounded: z.boolean().default(true),
  shadow: z.boolean().default(true),
});

export const quoteBlockSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  style: z.enum(['simple', 'card', 'large-quote', 'with-avatar']).default('card'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  background: z.string().optional(),
  accentColor: z.string().optional(),
  animation: z.enum(['none', 'fadeIn']).default('none'),
});

export const faqBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  style: z.enum(['accordion', 'grid']).default('accordion'),
  items: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).default([]),
  allowMultipleOpen: z.boolean().default(false),
  defaultOpenIndex: z.number().default(-1),
  animation: z.enum(['none', 'fadeIn']).default('none'),
});

export const timelineBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  layout: z.enum(['vertical-center', 'vertical-left']).default('vertical-center'),
  items: z.array(z.object({
    year: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
    color: z.string().optional(),
  })).default([]),
  animation: z.enum(['none', 'fadeInUp', 'staggered']).default('staggered'),
});

export const cardsGridBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  viewAllLabel: z.string().optional(),
  viewAllLink: z.string().optional(),
  columns: z.number().min(2).max(4).default(3),
  cardStyle: z.enum(['image-top', 'icon-top', 'horizontal', 'overlay']).default('image-top'),
  items: z.array(z.object({
    imageUrl: z.string().optional(),
    icon: z.string().optional(),
    badgeLabel: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()).optional(),
    linkLabel: z.string().optional(),
    linkUrl: z.string().optional(),
  })).default([]),
  hoverEffect: z.enum(['none', 'lift', 'glow', 'border']).default('lift'),
  animation: z.enum(['none', 'staggered', 'fadeIn']).default('staggered'),
});

export const GlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  layout: z.enum(['masonry', 'grid', 'carousel']).default('grid'),
  columns: z.number().min(2).max(4).default(3),
  showFilters: z.boolean().default(false),
  filterOptions: z.array(z.string()).default([]),
  showSearch: z.boolean().default(false),
  items: z.array(z.object({
    imageUrl: z.string().min(1),
    category: z.string().min(1),
    title: z.string().min(1),
    caption: z.string().optional(),
  })).default([]),
  lightbox: z.boolean().default(true),
  animation: z.enum(['none', 'fadeIn']).default('none'),
});

export const tableBlockSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  headers: z.array(z.string()).default([]),
  rows: z.array(z.array(z.string())).default([]),
  striped: z.boolean().default(true),
  bordered: z.boolean().default(false),
  hoverable: z.boolean().default(true),
  responsive: z.boolean().default(true),
  alignment: z.array(z.enum(['left', 'center', 'right'])).optional(),
  caption: z.string().optional(),
});

export const statsCounterBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  background: z.enum(['light', 'dark', 'accent']).default('light'),
  columns: z.number().min(2).max(4).default(4),
  items: z.array(z.object({
    number: z.string().min(1),
    suffix: z.string().optional(),
    label: z.string().min(1),
    icon: z.string().optional(),
    color: z.string().optional(),
  })).default([]),
  countUpAnimation: z.boolean().default(true),
  animation: z.enum(['none', 'fadeIn', 'staggered']).default('staggered'),
});

// --- LAYOUT BLOCKS ---

export const containerBlockSchema = z.object({
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('xl'),
  padding: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
  background: z.string().optional(),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg']).default('none'),
  shadow: z.enum(['none', 'sm', 'md', 'lg']).default('none'),
  childBlocks: z.array(z.any()).default([]),
});

export const gridBlockSchema = z.object({
  columns: z.number().min(1).max(6).default(3),
  gap: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  alignItems: z.enum(['start', 'center', 'end', 'stretch']).default('stretch'),
  justifyItems: z.enum(['start', 'center', 'end', 'stretch']).default('stretch'),
  background: z.string().optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('none'),
  childBlocks: z.array(z.any()).default([]),
  responsiveBreakpoint: z.enum(['sm', 'md', 'lg']).default('md'),
});

export const columnsBlockSchema = z.object({
  leftWidth: z.enum(['1/4', '1/3', '1/2', '2/3', '3/4']).default('1/2'),
  gap: z.enum(['sm', 'md', 'lg']).default('md'),
  stackOnMobile: z.boolean().default(true),
  reverseOnMobile: z.boolean().default(false),
  background: z.string().optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg']).default('none'),
  leftBlocks: z.array(z.any()).default([]),
  rightBlocks: z.array(z.any()).default([]),
});

export const tabsBlockSchema = z.object({
  tabStyle: z.enum(['underline', 'pill', 'boxed']).default('underline'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  tabs: z.array(z.object({
    label: z.string().min(1),
    icon: z.string().optional(),
    childBlocks: z.array(z.any()).default([]),
  })).default([]),
});

export const accordionLayoutBlockSchema = z.object({
  style: z.enum(['bordered', 'minimal', 'filled']).default('bordered'),
  allowMultipleOpen: z.boolean().default(false),
  items: z.array(z.object({
    title: z.string().min(1),
    icon: z.string().optional(),
    defaultOpen: z.boolean().default(false),
    childBlocks: z.array(z.any()).default([]),
  })).default([]),
});

export const carouselBlockSchema = z.object({
  autoplay: z.boolean().default(false),
  autoplayDelay: z.number().default(3000),
  showDots: z.boolean().default(true),
  showArrows: z.boolean().default(true),
  loop: z.boolean().default(true),
  slidesVisible: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  gap: z.enum(['sm', 'md', 'lg']).default('md'),
  slides: z.array(z.object({
    childBlocks: z.array(z.any()).default([]),
  })).default([]),
});

export const sectionWrapperBlockSchema = z.object({
  background: z.enum(['white', 'light', 'dark', 'navy', 'accent', 'image', 'gradient']).default('white'),
  backgroundValue: z.string().optional(),
  overlayOpacity: z.number().min(0).max(100).default(0),
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
  fullWidth: z.boolean().default(false),
  childBlocks: z.array(z.any()).default([]),
});

export const announcementsBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  limit: z.number().min(1).max(10).default(3),
  announcements: z.array(z.object({
    title: z.string().min(1),
    date: z.string().min(1),
    description: z.string().min(1),
    id: z.string().optional(),
  })).default([]),
});

export const statsExpandedBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  items: z.array(z.object({
    number: z.string().min(1),
    label: z.string().min(1),
    iconName: z.string().default('Zap'),
  })).default([]),
});

export const ctaBannerBlockSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subtext: z.string().optional(),
  btns: z.array(z.object({
    label: z.string().min(1),
    link: z.string().min(1),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  })).default([]),
  bgType: z.enum(['solid', 'gradient', 'image']).default('solid'),
  bgValue: z.string().optional(),
});

export const teamShowcaseBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1),
    designation: z.string().min(1),
    photoUrl: z.string().min(1),
    bio: z.string().optional(),
    email: z.string().optional(),
    department: z.string().optional(),
    expertise: z.array(z.string()).default([]),
    socials: z.array(z.object({
      platform: z.enum(['facebook', 'twitter', 'linkedin', 'github', 'instagram']),
      url: z.string(),
    })).default([]),
  })).default([]),
});

export const videoEmbedBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  videoUrl: z.string().min(1, 'Video URL is required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail URL is required'),
  caption: z.string().optional(),
});

export const mapLocationBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  address: z.string().min(1, 'Address is required'),
  embedUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  hours: z.string().optional(),
});

export const splitLayoutBlockSchema = z.object({
  split: z.enum(['50/50', '40/60', '60/40', '33/67', '67/33']).default('50/50'),
  gap: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  verticalAlign: z.enum(['top', 'center', 'bottom']).default('center'),
  stackOnMobile: z.boolean().default(true),
  reverseOnMobile: z.boolean().default(false),
  divider: z.boolean().default(false),
  background: z.string().optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('none'),
  leftBlocks: z.array(z.any()).default([]),
  rightBlocks: z.array(z.any()).default([]),
});

export const imageLayoutBlockSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  layout: z.enum(['mosaic', 'bento', 'overlap', 'stack']),
  items: z.array(z.object({
    imageUrl: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
  })).min(1),
});

export const masonryGlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  columns: z.number().min(2).max(4).default(3),
  showFilters: z.boolean().default(false),
  filterOptions: z.array(z.string()).default([]),
  showSearch: z.boolean().default(false),
  lightbox: z.boolean().default(true),
  mediaType: z.enum(['images', 'videos', 'mixed']).default('images'),
  items: z.array(z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  })).default([]),
});

export const featuredGlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  featuredItem: z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  }),
  gridItems: z.array(z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  })).default([]),
  gridColumns: z.number().min(2).max(3).default(2),
  showFilters: z.boolean().default(false),
  filterOptions: z.array(z.string()).default([]),
  lightbox: z.boolean().default(true),
  mediaType: z.enum(['images', 'videos', 'mixed']).default('images'),
});

export const equalGridGlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  columns: z.number().min(2).max(4).default(3),
  aspectRatio: z.enum(['1:1', '4:3', '16:9', '3:2']).default('1:1'),
  gap: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  showFilters: z.boolean().default(false),
  filterOptions: z.array(z.string()).default([]),
  showSearch: z.boolean().default(false),
  lightbox: z.boolean().default(true),
  showCaptions: z.boolean().default(false),
  hoverStyle: z.enum(['overlay', 'lift', 'zoom', 'border-glow']).default('overlay'),
  mediaType: z.enum(['images', 'videos', 'mixed']).default('images'),
  items: z.array(z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  })).default([]),
});

export const horizontalScrollGlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  itemWidth: z.enum(['sm', 'md', 'lg']).default('md'),
  itemHeight: z.enum(['sm', 'md', 'lg']).default('md'),
  autoScroll: z.boolean().default(false),
  autoScrollSpeed: z.enum(['slow', 'medium', 'fast']).default('medium'),
  showArrows: z.boolean().default(true),
  lightbox: z.boolean().default(true),
  mediaType: z.enum(['images', 'videos', 'mixed']).default('images'),
  items: z.array(z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  })).default([]),
});

export const fullscreenSlideshowBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().optional(),
  height: z.enum(['50vh', '75vh', '100vh']).default('75vh'),
  autoplay: z.boolean().default(true),
  autoplayDelay: z.number().default(5000),
  transition: z.enum(['fade', 'slide', 'zoom']).default('fade'),
  showDots: z.boolean().default(true),
  showArrows: z.boolean().default(true),
  showThumbnails: z.boolean().default(false),
  lightbox: z.boolean().default(true),
  mediaType: z.enum(['images', 'videos', 'mixed']).default('images'),
  items: z.array(z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.enum(['image', 'video']).default('image'),
    thumbnailUrl: z.string().optional(),
    overlayTitle: z.string().optional(),
    overlaySubtitle: z.string().optional(),
    overlayButton: z.object({
      label: z.string(),
      link: z.string(),
    }).optional(),
  })).default([]),
});

export const videoGlimpsesBlockSchema = z.object({
  eyebrowLabel: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  columns: z.number().min(2).max(3).default(3),
  videoSource: z.enum(['youtube', 'vimeo', 'direct', 'mixed']).default('mixed'),
  showFilters: z.boolean().default(false),
  filterOptions: z.array(z.string()).default([]),
  showSearch: z.boolean().default(false),
  items: z.array(z.object({
    videoUrl: z.string().min(1),
    thumbnailUrl: z.string().optional(),
    category: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
  })).default([]),
});

export const blockSchemas: Record<string, z.ZodObject<any>> = {
  hero: heroBlockSchema,
  heading: headingBlockSchema,
  paragraph: paragraphBlockSchema,
  text: paragraphBlockSchema,
  image: imageBlockSchema,
  video: videoBlockSchema,
  quote: quoteBlockSchema,
  faq: faqBlockSchema,
  timeline: timelineBlockSchema,
  cards: cardsGridBlockSchema,
  Glimpses: GlimpsesBlockSchema,
  table: tableBlockSchema,
  stats: statsCounterBlockSchema,
  container: containerBlockSchema,
  grid: gridBlockSchema,
  columns: columnsBlockSchema,
  tabs: tabsBlockSchema,
  accordion: accordionLayoutBlockSchema,
  carousel: carouselBlockSchema,
  section: sectionWrapperBlockSchema,
  split: splitLayoutBlockSchema,
  announcements: announcementsBlockSchema,
  'stats-expanded': statsExpandedBlockSchema,
  'cta-banner': ctaBannerBlockSchema,
  'team-showcase': teamShowcaseBlockSchema,
  'video-embed': videoEmbedBlockSchema,
  'map-location': mapLocationBlockSchema,
  'image-layout': imageLayoutBlockSchema,
  'masonry-Glimpses': masonryGlimpsesBlockSchema,
  'featured-Glimpses': featuredGlimpsesBlockSchema,
  'equal-grid-Glimpses': equalGridGlimpsesBlockSchema,
  'horizontal-scroll-Glimpses': horizontalScrollGlimpsesBlockSchema,
  'fullscreen-slideshow': fullscreenSlideshowBlockSchema,
  'video-Glimpses': videoGlimpsesBlockSchema,
};

