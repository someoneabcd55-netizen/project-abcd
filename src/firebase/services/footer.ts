'use server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';
import { fallbackFooterContent, shouldUseFallbackData } from './fallback-data';

export interface FooterLink {
    label: string;
    url: string;
}

export interface FooterLinkColumn {
    title: string;
    links: FooterLink[];
}

export interface SocialLink {
    platform: 'Facebook' | 'Twitter' | 'LinkedIn' | 'Instagram' | 'Youtube';
    url: string;
}

export interface FooterContent {
    linkColumns: FooterLinkColumn[];
    socialLinks: SocialLink[];
    copyrightText: string;
}

// PUBLIC READ
export async function getFooterContent(): Promise<FooterContent | null> {
  return getFooterContentCached();
}

const getFooterContentCached = unstable_cache(
  async (): Promise<FooterContent | null> => {
    if (shouldUseFallbackData()) {
      return fallbackFooterContent;
    }

    try {
      const adminDb = getAdminDb();
      const footerDocRef = adminDb.doc('footer_content/main');
      const snapshot = await footerDocRef.get();
      if (snapshot.exists) {
        return snapshot.data() as FooterContent;
      }
      return fallbackFooterContent;
    } catch (error) {
      console.warn('Using fallback footer because Firestore is unavailable.', error);
      return fallbackFooterContent;
    }
  },
  ['footer-content'],
  { revalidate: 3600, tags: ['footer-content'] }
);

// ADMIN WRITE
export async function updateFooterContent(payload: FooterContent) {
    const adminDb = getAdminDb();
    const footerDocRef = adminDb.doc('footer_content/main');
    await footerDocRef.set(payload, { merge: true });
    revalidateTag('footer-content');
    // Revalidate all pages since footer is global
    revalidatePath('/', 'layout');
    revalidatePath('/admin');
}
