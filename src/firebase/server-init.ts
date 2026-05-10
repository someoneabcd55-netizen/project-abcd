
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

function initializeAdminApp() {
    // This function initializes the Firebase Admin SDK.
    // It checks if an app is already initialized to prevent errors.
    if (getApps().length > 0) {
        adminApp = getApps()[0];
    } else {
        // If not initialized, it uses the service account key from environment variables.
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
             try {
                const normalizedServiceAccountKey =
                    serviceAccountKey.startsWith("'") && serviceAccountKey.endsWith("'")
                        ? serviceAccountKey.slice(1, -1)
                        : serviceAccountKey;
                // Attempt to initialize with the provided service account key.
                adminApp = initializeApp({
                    credential: cert(JSON.parse(normalizedServiceAccountKey)),
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                });
            } catch (e: any) {
                // If parsing fails, fall back to default initialization.
                console.error("Error parsing service account key, falling back to default init.", e.message);
                adminApp = initializeApp({ projectId: 'ncctroop' });
            }
        } else {
            // If no service account key is found, log a warning and initialize with project ID.
            console.log("No service account key found, initializing with default project ID.");
            adminApp = initializeApp({ projectId: 'ncctroop' });
        }
    }
    // Get the Firestore instance from the initialized app.
    adminDb = getFirestore(adminApp);
}

// This function serves as a singleton accessor for the Firestore database instance.
export function getAdminDb() {
    if (!adminDb) {
        initializeAdminApp();
    }
    return adminDb;
}
