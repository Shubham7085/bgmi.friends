import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const STORAGE_KEY = 'bgmi_firebase_config';

export interface FirebaseConfigInput {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function getStoredConfig(): FirebaseConfigInput | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FirebaseConfigInput;
  } catch {
    return null;
  }
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let initialized = false;

export function isFirebaseConfigured(): boolean {
  return getStoredConfig() !== null;
}

export function getFirebaseConfig(): FirebaseConfigInput | null {
  return getStoredConfig();
}

export function saveFirebaseConfig(config: FirebaseConfigInput): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function initFirebase(config?: FirebaseConfigInput): boolean {
  const cfg = config ?? getStoredConfig();
  if (!cfg) return false;

  if (initialized) return true;

  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  initialized = true;
  return true;
}

// Auto-init if config exists
initFirebase();

export { app, auth, db, storage, initialized };
