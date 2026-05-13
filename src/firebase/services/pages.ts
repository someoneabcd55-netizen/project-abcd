'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';
import { fallbackPages, shouldUseFallbackData } from './fallback-data';

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  visible: boolean;
  order_position: number;
}

const EXPECTED_PAGES = [
    { slug: 'home', title: 'Home', order: 0, visible: true },
    { slug: 'departments', title: 'Departments', order: 1, visible: true },
    { slug: 'activities', title: 'Activities', order: 2, visible: true },
    { slug: 'faculty', title: 'Faculty', order: 3, visible: true },
    { slug: 'admissions', title: 'Admissions', order: 4, visible: true },
    { slug: 'events', title: 'Events', order: 6, visible: true },
    { slug: 'gallery', title: 'Gallery', order: 7, visible: true },
    { slug: 'contact', title: 'Contact', order: 8, visible: true },
]

let hasVerifiedSeededPages = false;

async function ensurePagesSeeded() {
    if (hasVerifiedSeededPages) {
        return;
    }

    const adminDb = getAdminDb();
    const pagesCollection = adminDb.collection('pages');

    // Only seed on a truly fresh database to avoid repeated read overhead.
    const anyPageSnapshot = await pagesCollection.limit(1).get();
    if (!anyPageSnapshot.empty) {
        hasVerifiedSeededPages = true;
        return;
    }

    const batch = adminDb.batch();
    for (const page of EXPECTED_PAGES) {
      const newPageRef = pagesCollection.doc();
      batch.set(newPageRef, {
        slug: page.slug,
        title: page.title,
        order_position: page.order,
        visible: page.visible,
        description: `The ${page.title} page.`,
      });
    }
    await batch.commit();
    hasVerifiedSeededPages = true;
}


// Public read for navigation/rendering
export async function getPagesPublic(): Promise<Page[]> {
  return getPagesPublicCached();
}

const getPagesPublicCached = unstable_cache(
  async (): Promise<Page[]> => {
    if (shouldUseFallbackData()) {
      return fallbackPages.filter(page => page.visible);
    }

    try {
      await ensurePagesSeeded();
      const adminDb = getAdminDb();
      const pagesCollection = adminDb.collection('pages');
      const q = pagesCollection.orderBy('order_position', 'asc');
      const snapshot = await q.get();
      const allPages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
      return allPages.filter(page => page.visible);
    } catch (error) {
      console.warn('Using fallback public pages because Firestore is unavailable.', error);
      return fallbackPages.filter(page => page.visible);
    }
  },
  ['pages-public'],
  { revalidate: 3600, tags: ['pages-public'] }
);

// Public read for a single page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (shouldUseFallbackData()) {
    return fallbackPages.find(page => page.slug === slug) ?? null;
  }

  try {
    const adminDb = getAdminDb();
    const pagesRef = adminDb.collection('pages');
    const q = pagesRef.where('slug', '==', slug).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
        // If a standard page is missing, try a one-time seed check and refetch.
        if (EXPECTED_PAGES.some(p => p.slug === slug)) {
            await ensurePagesSeeded();
            const refetchSnapshot = await q.get();
            if (!refetchSnapshot.empty) {
                const doc = refetchSnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as Page;
            }
        }
        return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Page;
  } catch (error) {
    console.warn(`Using fallback page for slug "${slug}" because Firestore is unavailable.`, error);
    return fallbackPages.find(page => page.slug === slug) ?? null;
  }
}


// Admin read (includes invisible pages)
export async function getPagesAdmin(): Promise<Page[]> {
  await ensurePagesSeeded();
  const adminDb = getAdminDb();
  const pagesCollection = adminDb.collection('pages');
  const q = pagesCollection.orderBy('order_position', 'asc');
  const snapshot = await q.get();
  const allPages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
  
  // Filter out any pages that are not in the expected list
  const expectedSlugs = EXPECTED_PAGES.map(p => p.slug);
  const userCreatedPages = allPages.filter(p => !expectedSlugs.includes(p.slug));
  const standardPages = allPages.filter(p => expectedSlugs.includes(p.slug));
  
  return [...standardPages, ...userCreatedPages];
}

// Create page
export async function createPage(payload: {title: string, slug: string}) {
    const adminDb = getAdminDb();
    const pagesCollection = adminDb.collection('pages');
    
    // Get current max order position
    const lastPageQuery = pagesCollection.orderBy('order_position', 'desc').limit(1);
    const lastPageSnapshot = await lastPageQuery.get();
    const maxOrder = lastPageSnapshot.empty ? -1 : lastPageSnapshot.docs[0].data().order_position;

    const newPageData = {
        ...payload,
        visible: false, // Newly created pages are hidden by default
        description: '',
        order_position: maxOrder + 1,
    };

    const docRef = await pagesCollection.add(newPageData);
    revalidateTag('pages-public');
    revalidatePath('/admin');
    revalidatePath('/', 'layout'); // Revalidate nav if new pages might appear
    return docRef.id;
}


// Update page
export async function updatePage(id: string, patch: Partial<Omit<Page, 'id'>>) {
  const adminDb = getAdminDb();
  const pageDoc = adminDb.collection('pages').doc(id);
  const oldDoc = await pageDoc.get();
  const oldSlug = oldDoc.data()?.slug;

  await pageDoc.update(patch);
  revalidateTag('pages-public');
  
  revalidatePath('/admin');
  if (oldSlug) {
      const newPath = oldSlug === 'home' ? '/' : `/${oldSlug}`;
      revalidatePath(newPath);
  }
  if (patch.slug && patch.slug !== oldSlug) {
    const newPath = patch.slug === 'home' ? '/' : `/${patch.slug}`;
    revalidatePath(newPath);
  }
  if (patch.visible !== undefined) {
      revalidatePath('/', 'layout'); // Revalidate nav
  }
}

// Delete page and its blocks
export async function deletePage(id: string) {
    const adminDb = getAdminDb();
    
    const pageDoc = adminDb.collection('pages').doc(id);
    const pageSnapshot = await pageDoc.get();
    const slug = pageSnapshot.data()?.slug;

    // 1. Delete all blocks associated with the page
    const blocksCollection = adminDb.collection('blocks');
    const blocksQuery = blocksCollection.where('page_id', '==', id);
    const blocksSnapshot = await blocksQuery.get();
    
    if (!blocksSnapshot.empty) {
        const batch = adminDb.batch();
        blocksSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

    // 2. Delete the page itself
    await pageDoc.delete();

    revalidateTag('pages-public');
    revalidatePath('/admin');
    revalidatePath('/', 'layout'); // Revalidate nav
    if (slug) {
        const path = slug === 'home' ? '/' : `/${slug}`;
        revalidatePath(path);
    }
}


// Reorder pages
export async function reorderPages(pages: Array<{ id: string; order_position: number }>) {
  const adminDb = getAdminDb();
  const batch = adminDb.batch();
  
  pages.forEach(p => {
    const docRef = adminDb.collection('pages').doc(p.id);
    batch.update(docRef, { order_position: p.order_position });
  });

  await batch.commit();
  revalidateTag('pages-public');
  revalidatePath('/admin');
  revalidatePath('/', 'layout');
}
