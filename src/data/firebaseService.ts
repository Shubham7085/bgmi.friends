import { db, storage } from '../firebase/config';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { ProfileData, SocialLinks, Friend, ClanData, SquadData, GalleryImage, SiteSettings } from '../types';

const COLLECTIONS = {
  PROFILE: 'profile',
  SOCIAL: 'social',
  FRIENDS: 'friends',
  CLAN: 'clan',
  SQUAD: 'squad',
  GALLERY: 'gallery',
  SETTINGS: 'settings',
  MEMORIES: 'memories',
};

// Profile
export async function getProfile(): Promise<ProfileData | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.PROFILE, 'main'));
  return snap.exists() ? (snap.data() as ProfileData) : null;
}

export async function updateProfile(data: Partial<ProfileData>) {
  await setDoc(doc(db, COLLECTIONS.PROFILE, 'main'), data, { merge: true });
}

// Social Links
export async function getSocialLinks(): Promise<SocialLinks | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SOCIAL, 'links'));
  return snap.exists() ? (snap.data() as SocialLinks) : null;
}

export async function updateSocialLinks(data: Partial<SocialLinks>) {
  await setDoc(doc(db, COLLECTIONS.SOCIAL, 'links'), data, { merge: true });
}

// Friends
export async function getFriends(): Promise<Friend[]> {
  const q = query(collection(db, COLLECTIONS.FRIENDS), orderBy('synergy', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Friend));
}

export async function addFriend(friend: Omit<Friend, 'id'>): Promise<string> {
  const ref = doc(collection(db, COLLECTIONS.FRIENDS));
  await setDoc(ref, friend);
  return ref.id;
}

export async function updateFriend(id: string, data: Partial<Friend>) {
  await updateDoc(doc(db, COLLECTIONS.FRIENDS, id), data);
}

export async function deleteFriend(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.FRIENDS, id));
}

// Clan
export async function getClan(): Promise<ClanData | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.CLAN, 'main'));
  return snap.exists() ? (snap.data() as ClanData) : null;
}

export async function updateClan(data: Partial<ClanData>) {
  await setDoc(doc(db, COLLECTIONS.CLAN, 'main'), data, { merge: true });
}

// Squad
export async function getSquad(): Promise<SquadData | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SQUAD, 'main'));
  return snap.exists() ? (snap.data() as SquadData) : null;
}

export async function updateSquad(data: Partial<SquadData>) {
  await setDoc(doc(db, COLLECTIONS.SQUAD, 'main'), data, { merge: true });
}

// Gallery
export async function getGallery(): Promise<GalleryImage[]> {
  const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage));
}

export async function addGalleryImage(image: Omit<GalleryImage, 'id'>) {
  const ref = doc(collection(db, COLLECTIONS.GALLERY));
  await setDoc(ref, image);
  return ref.id;
}

export async function deleteGalleryImage(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}

// Settings
export async function getSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'site'));
  return snap.exists() ? (snap.data() as SiteSettings) : null;
}

export async function updateSettings(data: Partial<SiteSettings>) {
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'site'), data, { merge: true });
}

// Storage
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string) {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (e) {
    console.error('Error deleting image:', e);
  }
}

// Initialize default data
export async function initializeDefaultData() {
  const batch = writeBatch(db);

  const profileRef = doc(db, COLLECTIONS.PROFILE, 'main');
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) {
    batch.set(profileRef, {
      realName: '',
      ign: '',
      bgmiId: '',
      collectionLevel: 0,
      accountLevel: 0,
      popularity: 0,
      likes: 0,
      currentTier: 'Bronze',
      highestTier: 'Bronze',
      favoriteWeapon: '',
      favoriteMap: '',
      favoriteMode: '',
      playingSince: '',
      country: '',
      state: '',
      aboutMe: '',
      profilePhoto: '',
      coverBanner: '',
      heroBackground: '',
    });
  }

  const socialRef = doc(db, COLLECTIONS.SOCIAL, 'links');
  const socialSnap = await getDoc(socialRef);
  if (!socialSnap.exists()) {
    batch.set(socialRef, {
      instagram: '',
      youtube: '',
      facebook: '',
      discord: '',
    });
  }

  const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'site');
  const settingsSnap = await getDoc(settingsRef);
  if (!settingsSnap.exists()) {
    batch.set(settingsRef, {
      siteName: 'BGMI Friends Vault',
      siteLogo: '',
      loadingText: 'BGMI FRIENDS VAULT',
      loadingSubtitle: 'Every Friend Has A Story',
      themeColors: {
        primary: '#00F0FF',
        secondary: '#B829DD',
        accent: '#FFD700',
      },
    });
  }

  await batch.commit();
}
