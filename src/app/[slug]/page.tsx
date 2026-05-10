import { getPageBlocks } from '@/firebase/services/blocks';
import { getPagesPublic, getPageBySlug } from '@/firebase/services/pages';
import PageRenderer from '@/components/PageRenderer';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

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

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const blocks = await getPageBlocks(params.slug);

    if (!blocks) {
        notFound();
    }

    return <PageRenderer blocks={blocks} />;
}
