'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';
import { fallbackEvents, shouldUseFallbackData } from './fallback-data';

export interface AppEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  type: 'Academic' | 'Extracurricular';
  description: string;
}

// PUBLIC READ
export async function getEvents(): Promise<AppEvent[]> {
    return getEventsCached();
}

const getEventsCached = unstable_cache(
  async (): Promise<AppEvent[]> => {
    if (shouldUseFallbackData()) {
      return fallbackEvents;
    }

    try {
      const adminDb = getAdminDb();
      const eventsCollection = adminDb.collection('events');
      const q = eventsCollection.orderBy('date', 'asc').limit(500);
      const snapshot = await q.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppEvent));
    } catch (error) {
      console.warn('Using fallback events because Firestore is unavailable.', error);
      return fallbackEvents;
    }
  },
  ['events-all'],
  { revalidate: 1800, tags: ['events'] }
);

export async function getEventsPublic(limit = 3): Promise<AppEvent[]> {
  return getEventsPublicCached(limit);
}

const getEventsPublicCached = unstable_cache(
  async (limit: number): Promise<AppEvent[]> => {
    if (shouldUseFallbackData()) {
      return fallbackEvents.slice(0, limit);
    }

    try {
      const adminDb = getAdminDb();
      const eventsCollection = adminDb.collection('events');
      const q = eventsCollection.orderBy('date', 'asc').limit(Math.max(1, Math.min(limit, 20)));
      const snapshot = await q.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppEvent));
    } catch (error) {
      console.warn('Using fallback public events because Firestore is unavailable.', error);
      return fallbackEvents.slice(0, limit);
    }
  },
  ['events-public'],
  { revalidate: 1800, tags: ['events'] }
);

// ADMIN WRITE
export async function addEvent(payload: Omit<AppEvent, 'id'>) {
    const adminDb = getAdminDb();
    const eventsCollection = adminDb.collection('events');
    const docRef = await eventsCollection.add(payload);
    revalidateTag('events');
    revalidatePath('/events');
    revalidatePath('/');
    revalidatePath('/admin');
    return docRef.id;
}

// ADMIN WRITE
export async function updateEvent(id: string, patch: Partial<AppEvent>) {
    const adminDb = getAdminDb();
    const eventDoc = adminDb.doc(`events/${id}`);
    await eventDoc.update(patch);
    revalidateTag('events');
    revalidatePath('/events');
    revalidatePath('/');
    revalidatePath('/admin');
}

// ADMIN WRITE
export async function deleteEvent(id: string) {
    const adminDb = getAdminDb();
    const eventDoc = adminDb.doc(`events/${id}`);
    await eventDoc.delete();
    revalidateTag('events');
    revalidatePath('/events');
    revalidatePath('/');
    revalidatePath('/admin');
}
