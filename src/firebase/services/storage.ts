'use server';
import { getStorage } from 'firebase-admin/storage';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

// This function ensures that we initialize the app only once.
function getAdminApp() {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : null;

    if (serviceAccountKey) {
        return initializeApp({
            credential: cert(serviceAccountKey),
        });
    } else {
        return initializeApp();
    }
}

const adminApp = getAdminApp();
let adminStorage = getStorage(adminApp);
const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'g-v-hallikeri-pu-college.appspot.com';

function getPathFromUrl(url: string): string | null {
    try {
        const urlObject = new URL(url);
        // Firebase Storage URLs have the object path after '/o/' and before '?'.
        const path = urlObject.pathname.split('/o/')[1];
        if (path) {
            // Decode the URL component to handle spaces (%20) and other characters.
            return decodeURIComponent(path.split('?')[0]);
        }
        return null;
    } catch (e) {
        console.error("Invalid URL for storage object:", url, e);
        return null;
    }
}

/**
 * Deletes a file from Firebase Storage using its URL.
 * This is a server-side operation.
 */
export async function deleteStorageFile(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    const filePath = getPathFromUrl(imageUrl);
    if (!filePath) {
        console.warn(`Could not determine file path from URL: ${imageUrl}`);
        return;
    }

    try {
        const bucket = adminStorage.bucket(bucketName);
        const file = bucket.file(filePath);
        await file.delete();
    } catch (error: any) {
        if (error.code === 404) {
            console.log(`File already deleted or does not exist in storage: ${filePath}`);
        } else {
            console.error("Storage file deletion failed", error);
            // Don't throw an error to the client, just log it.
        }
    }
}
