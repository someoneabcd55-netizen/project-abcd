'use server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/firebase/server-init';
import { revalidatePath } from 'next/cache';
import { fallbackDepartments, shouldUseFallbackData } from './fallback-data';

export interface Course { id: string; name: string; description: string }
export interface Department {
  id: string;
  slug: string;
  name:string;
  shortdescription: string;
  longdescription: string;
  courses: Course[];
  researchareas: string[];
  imageurl: string;
  dataaihint: string;
}

// PUBLIC READ
export async function getDepartments(): Promise<Department[]> {
  if (shouldUseFallbackData()) {
    return fallbackDepartments;
  }

  try {
    const adminDb = getAdminDb();
    const departmentsCollection = adminDb.collection('departments');
    const snapshot = await departmentsCollection.orderBy('name', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  } catch (error) {
    console.warn('Using fallback departments because Firestore is unavailable.', error);
    return fallbackDepartments;
  }
}

// PUBLIC READ
export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  if (shouldUseFallbackData()) {
    return fallbackDepartments.find(department => department.slug === slug) ?? null;
  }

  try {
    const adminDb = getAdminDb();
    const departmentsCollection = adminDb.collection('departments');
    const q = departmentsCollection.where('slug', '==', slug);
    const snapshot = await q.get();
    if(snapshot.empty) return null;
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as Department;
  } catch (error) {
    console.warn(`Using fallback department for slug "${slug}" because Firestore is unavailable.`, error);
    return fallbackDepartments.find(department => department.slug === slug) ?? null;
  }
}

// ADMIN WRITE - ADD
export async function addDepartment(department: Omit<Department, 'id'>) {
    const adminDb = getAdminDb();
    const departmentsCollection = adminDb.collection('departments');
    const docRef = await departmentsCollection.add(department);
    revalidatePath('/departments');
    revalidatePath('/admin');
    return docRef.id;
}


// ADMIN WRITE
export async function updateDepartment(id: string, department: Partial<Omit<Department, 'id'>>) {
    const adminDb = getAdminDb();
    const departmentDoc = adminDb.doc(`departments/${id}`);
    await departmentDoc.update(department);
    
    const updatedDoc = await departmentDoc.get();
    const slug = updatedDoc.data()?.slug;

    revalidatePath('/departments');
    if (slug) {
        revalidatePath(`/departments/${slug}`);
    }
    revalidatePath('/admin');
}

// ADMIN WRITE - DELETE
export async function deleteDepartment(id: string) {
    const adminDb = getAdminDb();
    const departmentDoc = adminDb.doc(`departments/${id}`);
    
    // Get slug before deleting to revalidate path
    const doc = await departmentDoc.get();
    const slug = doc.data()?.slug;

    await departmentDoc.delete();

    revalidatePath('/departments');
    if (slug) {
        revalidatePath(`/departments/${slug}`);
    }
    revalidatePath('/admin');
}

