export interface ProfileData {
  realName: string;
  ign: string;
  bgmiId: string;
  collectionLevel: number;
  accountLevel: number;
  popularity: number;
  likes: number;
  currentTier: string;
  highestTier: string;
  favoriteWeapon: string;
  favoriteMap: string;
  favoriteMode: string;
  playingSince: string;
  country: string;
  state: string;
  aboutMe: string;
  profilePhoto: string;
  coverBanner: string;
  heroBackground: string;
}

export interface SocialLinks {
  instagram: string;
  youtube: string;
  facebook: string;
  discord: string;
}

export interface Friend {
  id: string;
  realName: string;
  ign: string;
  bgmiId: string;
  collectionLevel: number;
  accountLevel: number;
  friendSince: string;
  synergy: number;
  favoriteWeapon: string;
  favoriteMap: string;
  favoriteMode: string;
  profilePhoto: string;
  coverBanner: string;
  isOnline: boolean;
  notes: string;
  memories: Memory[];
  gallery: string[];
  achievements: string[];
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
}

export interface ClanData {
  name: string;
  logo: string;
  members: number;
  description: string;
  gallery: string[];
}

export interface SquadMember {
  id: string;
  name: string;
  ign: string;
  role: string;
  profilePhoto: string;
}

export interface SquadData {
  name: string;
  members: SquadMember[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  loadingText: string;
  loadingSubtitle: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface DashboardStats {
  totalFriends: number;
  totalSynergy: number;
  highestSynergyFriend: Friend | null;
  averageSynergy: number;
  oldestFriend: Friend | null;
  newestFriend: Friend | null;
  collectionAverage: number;
  totalMemories: number;
}
