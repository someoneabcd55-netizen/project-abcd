
'use server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { deleteStorageFile } from './storage';
import { getAdminDb } from '@/firebase/server-init';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  publicId?: string;
  createdAt: string; // Changed to string for serialization
  order_position: number;
}

// PUBLIC READ
export async function getGalleryImages(): Promise<GalleryImage[]> {
    const adminDb = getAdminDb();
    const galleryCollection = adminDb.collection('gallery');
    const q = galleryCollection.orderBy('order_position', 'asc');
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
        } as GalleryImage;
    });
}

// ADMIN WRITE - ADD
export async function addGalleryItem(item: {
    src: string;
    alt: string;
    dataAiHint: string;
    order_position: number;
    publicId?: string;
}) {
    const adminDb = getAdminDb();
    const galleryCollection = adminDb.collection('gallery');
    const payload = { ...item, createdAt: Timestamp.now() };
    const docRef = await galleryCollection.add(payload);
    revalidatePath('/gallery');
    revalidatePath('/admin');
    return docRef.id;
}

// ADMIN WRITE - UPDATE
export async function updateGalleryItem(id: string, item: Partial<Omit<GalleryImage, 'id' | 'createdAt'>>) {
    const adminDb = getAdminDb();
    const imageDoc = adminDb.doc(`gallery/${id}`);
    await imageDoc.update(item);
    revalidatePath('/gallery');
    revalidatePath('/admin');
}

// ADMIN WRITE - DELETE
export async function deleteGalleryItem(id: string, imageUrl: string, publicId?: string) {
    const adminDb = getAdminDb();
    const imageDoc = adminDb.doc(`gallery/${id}`);
    
    await imageDoc.delete();
    
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }

    // Deleting from storage is optional if URLs are external
    if (!publicId && imageUrl.includes('firebasestorage.googleapis.com')) {
      await deleteStorageFile(imageUrl);
    }

    revalidatePath('/gallery');
    revalidatePath('/admin');
}


// REORDER
export async function reorderGalleryImages(images: Array<{ id: string; order_position: number }>) {
    const adminDb = getAdminDb();
    const batch = adminDb.batch();
    
    images.forEach(image => {
        const docRef = adminDb.collection('gallery').doc(image.id);
        batch.update(docRef, { order_position: image.order_position });
    });

    await batch.commit();
    revalidatePath('/gallery');
    revalidatePath('/admin');
}
