'use server';
import { getAdminDb } from '@/firebase/server-init';
import { revalidatePath, unstable_cache } from 'next/cache';

export type Theme = 'theme1' | 'theme2' | 'theme3';

export interface AppearanceSettings {
  theme: Theme;
}

export const getAppearanceSettings = unstable_cache(
  async (): Promise<AppearanceSettings> => {
    try {
      const adminDb = getAdminDb();
      const doc = await adminDb.collection('settings').doc('appearance').get();
      const data = doc.data() as AppearanceSettings | undefined;
      return data || { theme: 'theme1' };
    } catch (error) {
      console.error('Error fetching appearance settings:', error);
      return { theme: 'theme1' };
    }
  },
  ['appearance-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

export async function updateTheme(theme: Theme) {
  try {
    const adminDb = getAdminDb();
    await adminDb.collection('settings').doc('appearance').set({ theme }, { merge: true });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error updating theme:', error);
    throw new Error('Failed to update theme');
  }
}

