'use server';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';

export interface ContactInfo {
  generalphone: string;
  generalemail: string;
  address: string;
}

// PUBLIC READ
export async function getContactInfo(): Promise<ContactInfo | null> {
  const adminDb = getAdminDb();
  const contactDocRef = adminDb.doc('contact_info/main');
  const snapshot = await contactDocRef.get();
  if (snapshot.exists) {
    return snapshot.data() as ContactInfo;
  }
  return null;
}

// ADMIN WRITE
export async function updateContactInfo(payload: ContactInfo) {
    const adminDb = getAdminDb();
    const contactDocRef = adminDb.doc('contact_info/main');
    await contactDocRef.set(payload);
    revalidatePath('/contact');
    revalidatePath('/'); // For footer
    revalidatePath('/admin');
}
