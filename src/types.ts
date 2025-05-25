
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  imageUrl: string;
  interests: string[];
  alwaysMatches?: boolean; 
  location?: string; // Added location field
}

export interface Match {
  id: string;
  matchedUser: UserProfile;
  timestamp: string;
  icebreaker?: string | null;
}

export type AppView = 'swipe' | 'matches';