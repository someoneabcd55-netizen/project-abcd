'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
}

// PUBLIC READ
export async function getAnnouncements(): Promise<Announcement[]> {
    return getAnnouncementsCached();
}

const getAnnouncementsCached = unstable_cache(
  async (): Promise<Announcement[]> => {
    const adminDb = getAdminDb();
    const announcementsCollection = adminDb.collection('announcements');
    const q = announcementsCollection.orderBy('date', 'desc').limit(100);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  },
  ['announcements-all'],
  { revalidate: 1800, tags: ['announcements'] }
);

// PUBLIC READ for homepage
export async function getAnnouncementsPublic(count = 3): Promise<Announcement[]> {
  return getAnnouncementsPublicCached(count);
}

const getAnnouncementsPublicCached = unstable_cache(
  async (count: number): Promise<Announcement[]> => {
    const adminDb = getAdminDb();
    const announcementsCollection = adminDb.collection('announcements');
    const q = announcementsCollection.orderBy('date', 'desc').limit(Math.max(1, Math.min(count, 12)));
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  },
  ['announcements-public'],
  { revalidate: 1800, tags: ['announcements'] }
);

// ADMIN WRITE
export async function addAnnouncement(payload: Omit<Announcement, 'id'>) {
    const adminDb = getAdminDb();
    const announcementsCollection = adminDb.collection('announcements');
    const docRef = await announcementsCollection.add(payload);
    revalidateTag('announcements');
    revalidatePath('/');
    revalidatePath('/admin');
    return docRef.id;
}

// ADMIN WRITE
export async function updateAnnouncement(id: string, patch: Partial<Announcement>) {
    const adminDb = getAdminDb();
    const announcementDoc = adminDb.doc(`announcements/${id}`);
    await announcementDoc.update(patch);
    revalidateTag('announcements');
    revalidatePath('/');
    revalidatePath('/admin');
}

// ADMIN WRITE
export async function deleteAnnouncement(id: string) {
    const adminDb = getAdminDb();
    const announcementDoc = adminDb.doc(`announcements/${id}`);
    await announcementDoc.delete();
    revalidateTag('announcements');
    revalidatePath('/');
    revalidatePath('/admin');
}
