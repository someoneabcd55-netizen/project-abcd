import { getPageBlocks } from '@/firebase/services/blocks';
import { getPagesPublic, getPageBySlug } from '@/firebase/services/pages';
import PageRenderer from '@/components/PageRenderer';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Not Found',
    }
  }
 
  return {
    title: page.title,
    description: page.description,
  }
}

export async function generateStaticParams() {
    const pages = await getPagesPublic();
    // Filter out the 'home' slug as it's handled by the root page.tsx.
    return pages.filter(page => page.slug !== 'home').map((page) => ({
        slug: page.slug,
    }));
}

import { getAppearanceSettings } from '@/firebase/services/settings';

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const [blocks, appearance] = await Promise.all([
        getPageBlocks(slug),
        getAppearanceSettings(),
    ]);

    if (!blocks) {
        notFound();
    }

    return <PageRenderer blocks={blocks} theme={appearance?.theme} />;
}
