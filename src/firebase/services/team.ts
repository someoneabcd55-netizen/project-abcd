'use server';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/firebase/server-init';
import { fallbackTeamMembers, shouldUseFallbackData } from './fallback-data';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  expertise: string[];
  imageUrl: string; 
}

// PUBLIC READ
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (shouldUseFallbackData()) {
    return fallbackTeamMembers;
  }

  try {
    const adminDb = getAdminDb();
    const teamCollection = adminDb.collection('team');
    const snapshot = await teamCollection.orderBy('name').get();
    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
    return members;
  } catch (error) {
    console.warn('Using fallback team because Firestore is unavailable.', error);
    return fallbackTeamMembers;
  }
}

// PUBLIC READ
export async function getTeamMembersByDepartment(department: string): Promise<TeamMember[]> {
  if (shouldUseFallbackData()) {
    return fallbackTeamMembers.filter(member => member.department === department);
  }

  try {
    const adminDb = getAdminDb();
    const teamCollection = adminDb.collection('team');
    const q = teamCollection.where("department", "==", department);
    const snapshot = await q.get();
    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
    return members;
  } catch (error) {
    console.warn(`Using fallback team for "${department}" because Firestore is unavailable.`, error);
    return fallbackTeamMembers.filter(member => member.department === department);
  }
}

// ADMIN WRITE
export async function addTeamMember(member: Omit<TeamMember, 'id'>) {
    const adminDb = getAdminDb();
    const teamCollection = adminDb.collection('team');
    const docRef = await teamCollection.add(member);
    revalidatePath('/team');
    revalidatePath('/faculty');
    revalidatePath('/admin');
    return docRef.id;
}

// ADMIN WRITE
export async function updateTeamMember(id: string, patch: Partial<Omit<TeamMember, 'id'>>) {
    const adminDb = getAdminDb();
    const teamDoc = adminDb.doc(`team/${id}`);
    await teamDoc.update(patch);
    revalidatePath('/team');
    revalidatePath('/faculty');
    revalidatePath('/admin');
}

// ADMIN WRITE
export async function deleteTeamMember(id: string) {
    const adminDb = getAdminDb();
    const teamDoc = adminDb.doc(`team/${id}`);
    await teamDoc.delete();
    revalidatePath('/team');
    revalidatePath('/faculty');
    revalidatePath('/admin');
}

