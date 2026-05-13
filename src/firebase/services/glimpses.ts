
'use server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { deleteStorageFile } from './storage';
import { getAdminDb } from '@/firebase/server-init';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';
import { fallbackGlimpsesImages, shouldUseFallbackData } from './fallback-data';

export interface GlimpsesImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  publicId?: string;
  createdAt: string; // Changed to string for serialization
  order_position: number;
}

// PUBLIC READ
export async function getGlimpsesImages(): Promise<GlimpsesImage[]> {
  if (shouldUseFallbackData()) {
    return fallbackGlimpsesImages;
  }

  try {
    const adminDb = getAdminDb();
    const GlimpsesCollection = adminDb.collection('Glimpses');
    const q = GlimpsesCollection.orderBy('order_position', 'asc');
    const snapshot = await q.get();
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAtTimestamp = data.createdAt as Timestamp;
        return {
            id: doc.id,
            src: data.src,
            alt: data.alt,
            dataAiHint: data.dataAiHint,
            publicId: data.publicId,
            order_position: data.order_position,
            createdAt: createdAtTimestamp.toDate().toISOString(), // Convert Timestamp to ISO string
        } as GlimpsesImage;
    });
  } catch (error) {
    console.warn('Using fallback Glimpses because Firestore is unavailable.', error);
    return fallbackGlimpsesImages;
  }
}

// ADMIN WRITE - ADD
export async function addGlimpsesItem(item: {
    src: string;
    alt: string;
    dataAiHint: string;
    order_position: number;
    publicId?: string;
}) {
    const adminDb = getAdminDb();
    const GlimpsesCollection = adminDb.collection('Glimpses');
    const payload = { ...item, createdAt: Timestamp.now() };
    const docRef = await GlimpsesCollection.add(payload);
    revalidatePath('/glimpses');
    revalidatePath('/admin');
    return docRef.id;
}

// ADMIN WRITE - UPDATE
export async function updateGlimpsesItem(id: string, item: Partial<Omit<GlimpsesImage, 'id' | 'createdAt'>>) {
    const adminDb = getAdminDb();
    const imageDoc = adminDb.doc(`Glimpses/${id}`);
    await imageDoc.update(item);
    revalidatePath('/glimpses');
    revalidatePath('/admin');
}

// ADMIN WRITE - DELETE
export async function deleteGlimpsesItem(id: string, imageUrl: string, publicId?: string) {
    const adminDb = getAdminDb();
    const imageDoc = adminDb.doc(`Glimpses/${id}`);
    
    await imageDoc.delete();
    
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }

    // Deleting from storage is optional if URLs are external
    if (!publicId && imageUrl.includes('firebasestorage.googleapis.com')) {
      await deleteStorageFile(imageUrl);
    }

    revalidatePath('/glimpses');
    revalidatePath('/admin');
}


// REORDER
export async function reorderGlimpsesImages(images: Array<{ id: string; order_position: number }>) {
    const adminDb = getAdminDb();
    const batch = adminDb.batch();
    
    images.forEach(image => {
        const docRef = adminDb.collection('Glimpses').doc(image.id);
        batch.update(docRef, { order_position: image.order_position });
    });

    await batch.commit();
    revalidatePath('/glimpses');
    revalidatePath('/admin');
}

