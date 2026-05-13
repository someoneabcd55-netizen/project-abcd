import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: ReturnType<typeof getAuth> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;

export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
        try {
            firebaseApp = initializeApp(firebaseConfig);
        } catch (e) {
            console.error("Firebase initialization error", e);
            return { firebaseApp: null, auth: null, firestore: null };
        }
    } else {
        firebaseApp = getApp();
    }

    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  
  return { firebaseApp, auth, firestore };
}

// Initialize on module load if on client
if (typeof window !== 'undefined') {
    initializeFirebase();
}

export { firebaseApp, auth, firestore };

export * from './provider';
export * from './client-provider';

