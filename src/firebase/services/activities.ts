'use server';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';

export interface Course {
  id: string;
  name: string;
  description: string;
}

export interface Activity {
  id: string;
  slug: string;
  name: string;
  shortdescription: string;
  longdescription: string;
  faculty_department: 'ANO' | 'Instructors';
  courses: Course[];
  focusareas: string[];
  imageurl: string;
  dataaihint: string;
}

// PUBLIC READ
export async function getActivities(): Promise<Activity[]> {
  const adminDb = getAdminDb();
  const activitiesCollection = adminDb.collection('activities');
  const snapshot = await activitiesCollection.orderBy('name', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
}

// PUBLIC READ
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
    const adminDb = getAdminDb();
    const activitiesCollection = adminDb.collection('activities');
    const q = activitiesCollection.where('slug', '==', slug);
    const snapshot = await q.get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Activity;
}

// ADMIN WRITE - ADD
export async function addActivity(activity: Omit<Activity, 'id'>) {
    const adminDb = getAdminDb();
    const activitiesCollection = adminDb.collection('activities');
    const docRef = await activitiesCollection.add(activity);
    revalidatePath('/activities');
    revalidatePath('/admin');
    return docRef.id;
}


// ADMIN WRITE
export async function updateActivity(id: string, activity: Partial<Omit<Activity, 'id'>>) {
    const adminDb = getAdminDb();
    const activityDoc = adminDb.doc(`activities/${id}`);
    await activityDoc.update(activity);
    
    const updatedDoc = await activityDoc.get();
    const slug = updatedDoc.data()?.slug;

    revalidatePath('/activities');
    if (slug) {
        revalidatePath(`/activities/${slug}`);
    }
    revalidatePath('/admin');
}

// ADMIN WRITE - DELETE
export async function deleteActivity(id: string) {
    const adminDb = getAdminDb();
    const activityDoc = adminDb.doc(`activities/${id}`);
    
    // Get slug before deleting to revalidate path
    const doc = await activityDoc.get();
    const slug = doc.data()?.slug;

    await activityDoc.delete();

    revalidatePath('/activities');
    if (slug) {
        revalidatePath(`/activities/${slug}`);
    }
    revalidatePath('/admin');
}
