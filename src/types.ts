
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

// Music API Types based on OpenAPI specification
export interface GenreDto {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface ArtistDto {
  id: number;
  name: string;
  imageUrl?: string;
  genreId: number;
  genreName?: string;
  popularity: number;
}

export interface GenrePreferenceDto {
  genreId: number;
  genreName?: string;
  preferenceLevel: number; // 1-5 scale
}

export interface ArtistPreferenceDto {
  artistId: number;
  artistName?: string;
  preferenceLevel: number; // 1-5 scale
}

// API Response Types
export interface BaseResponse {
  statusCode: number;
  description?: string;
  userFriendly?: string;
  moreInformation?: string;
}

export interface GetGenresResponse extends BaseResponse {
  genres?: GenreDto[];
  totalCount?: number;
}

export interface GetArtistsByGenreResponse extends BaseResponse {
  artists?: ArtistDto[];
}

export interface GetUserPreferencesResponse extends BaseResponse {
  genrePreferences?: GenrePreferenceDto[];
  artistPreferences?: ArtistPreferenceDto[];
}

export interface UpdateGenrePreferencesRequest {
  firebaseUid?: string;
  preferences?: GenrePreferenceDto[];
}

export interface UpdateArtistPreferencesRequest {
  firebaseUid?: string;
  preferences?: ArtistPreferenceDto[];
}

export interface UpdatePreferencesResponse extends BaseResponse {
  updatedCount: number;
}

// User Profile Update Types based on OpenAPI specification
export interface UpdateUserProfileRequest {
  userId?: string;
  displayName?: string;
  email?: string;
  age?: number;
  bio?: string;
  favoriteGenres?: string; // Comma-separated string
  profilePictureUrl?: string;
}

export interface UpdateUserProfileResponse extends BaseResponse {
  // No additional fields beyond BaseResponse according to spec
}

export interface GetUserInfoResponse extends BaseResponse {
  id?: string;
  userName?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
}