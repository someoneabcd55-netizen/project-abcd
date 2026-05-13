'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';
import { getPageBySlug } from './pages';
import { shouldUseFallbackData } from './fallback-data';

export interface Block {
  id: string;
  page_id: string;
  order_position: number;
  type: 'hero' | 'text' | 'image' | string;
  visible: boolean;
  data: any;
}

async function revalidatePage(pageId: string) {
    const adminDb = getAdminDb();
    const pageDoc = await adminDb.collection('pages').doc(pageId).get();
    const slug = pageDoc.data()?.slug;
    if (slug) {
        revalidateTag(`blocks:${slug}`);
        revalidatePath(slug === 'home' ? '/' : `/${slug}`);
    }
}

// Public read for pages
export async function getPageBlocks(slug: string) : Promise<Block[] | null> {
  const getCached = unstable_cache(
    async (): Promise<Block[] | null> => {
      if (shouldUseFallbackData()) {
        return null;
      }

      try {
        const page = await getPageBySlug(slug);
        if (!page) return null;

        const adminDb = getAdminDb();
        const blocksCollection = adminDb.collection('blocks');
        const q = blocksCollection.where('page_id', '==', page.id);
        const snapshot = await q.get();

        const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Block));

        // Filter for visible blocks and sort in code to avoid composite index requirement
        return blocks
          .filter(block => block.visible)
          .sort((a, b) => a.order_position - b.order_position);
      } catch (error) {
        console.warn(`Using empty fallback blocks for "${slug}" because Firestore is unavailable.`, error);
        return null;
      }
    },
    ['page-blocks', slug],
    { revalidate: 1800, tags: [`blocks:${slug}`] }
  );
  return getCached();
}


// Admin reads (includes invisible blocks)
export async function getBlocksAdmin(pageId: string) : Promise<Block[]> {
  const adminDb = getAdminDb();
  const blocksCollection = adminDb.collection('blocks');
  const q = blocksCollection.where('page_id', '==', pageId);
  const snapshot = await q.get();

  const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Block));

  // Sort in code to avoid composite index
  return blocks.sort((a, b) => a.order_position - b.order_position);
}

// Add block (admin only)
export async function addBlock(payload: Omit<Block, 'id'>) {
  if (!payload.page_id || !payload.type) {
    throw new Error("page_id and type are required to create a block.");
  }
  const adminDb = getAdminDb();
  const blocksCollection = adminDb.collection('blocks');
  const docRef = await blocksCollection.add(payload);
  revalidatePath('/admin');
  await revalidatePage(payload.page_id);
  return docRef.id;
}

// Update block (admin only)
export async function updateBlock(id: string, patch: Partial<Block>) {
  const adminDb = getAdminDb();
  const blockDoc = adminDb.collection('blocks').doc(id);
  await blockDoc.update(patch);

  const updatedDoc = await blockDoc.get();
  const pageId = updatedDoc.data()?.page_id;

  revalidatePath('/admin');
  if(pageId) {
    await revalidatePage(pageId);
  }
}

// Delete block (admin only)
export async function deleteBlock(id: string) {
    const adminDb = getAdminDb();
    const blockDoc = adminDb.collection('blocks').doc(id);
    const docSnapshot = await blockDoc.get();
    const pageId = docSnapshot.data()?.page_id;

    await blockDoc.delete();

    revalidatePath('/admin');
    if(pageId) {
      await revalidatePage(pageId);
    }
}

// Reorder blocks (bulk)
export async function reorderBlocks(blocks: Array<{ id: string; order_position: number }>) {
  const adminDb = getAdminDb();
  const batch = adminDb.batch();
  
  blocks.forEach(blockInfo => {
    const docRef = adminDb.collection('blocks').doc(blockInfo.id);
    batch.update(docRef, { order_position: blockInfo.order_position });
  });

  await batch.commit();

  if (blocks.length > 0) {
      const firstBlock = await adminDb.collection('blocks').doc(blocks[0].id).get();
      const pageId = firstBlock.data()?.page_id;
      if (pageId) {
          await revalidatePage(pageId);
      }
  }
  revalidatePath('/admin');
}

export async function updatePageBlocks(pageId: string, blocks: Block[]) {
  const adminDb = getAdminDb();
  const currentBlocks = await getBlocksAdmin(pageId);
  const currentIds = currentBlocks.map(b => b.id);
  const newIds = blocks.map(b => b.id);

  const batch = adminDb.batch();

  // Deletions
  const toDelete = currentIds.filter(id => !newIds.includes(id));
  toDelete.forEach(id => {
    batch.delete(adminDb.collection('blocks').doc(id));
  });

  // Updates and Additions
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const { id, ...rest } = b;
    const blockData = {
      ...rest,
      order_position: i,
      page_id: pageId
    };

    if (id.startsWith('temp-')) {
      // New block
      const newDocRef = adminDb.collection('blocks').doc();
      batch.set(newDocRef, blockData);
    } else {
      // Update existing
      batch.update(adminDb.collection('blocks').doc(id), blockData);
    }
  }

  await batch.commit();
  await revalidatePage(pageId);
  revalidatePath('/admin');
}
