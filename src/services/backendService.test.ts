import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variable before importing the service
vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3000');

import {
  getGenres,
  getArtistsByGenre,
  getUserPreferences,
  updateGenrePreferences,
  updateArtistPreferences,
  registerGoogleUser
} from './backendService';

// Mock fetch globally
global.fetch = vi.fn();

describe('Backend Service - Music APIs', () => {
  const mockToken = 'mock-firebase-token';
  const mockBaseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGenres', () => {
    it('should fetch genres successfully', async () => {
      const mockResponse = {
        statusCode: 200,
        genres: [
          { id: 1, name: 'Rock', description: 'Rock music', displayOrder: 1 },
          { id: 2, name: 'Pop', description: 'Pop music', displayOrder: 2 }
        ],
        totalCount: 2
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getGenres(mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/music/genres`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unauthorized' })
      });

      await expect(getGenres(mockToken)).rejects.toThrow('Unauthorized');
    });
  });

  describe('getArtistsByGenre', () => {
    it('should fetch artists by genre successfully', async () => {
      const genreId = 1;
      const mockResponse = {
        statusCode: 200,
        artists: [
          { id: 1, name: 'The Beatles', genreId: 1, popularity: 95 },
          { id: 2, name: 'Led Zeppelin', genreId: 1, popularity: 90 }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getArtistsByGenre(genreId, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/music/genres/${genreId}/artists`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserPreferences', () => {
    it('should fetch user preferences successfully', async () => {
      const mockResponse = {
        statusCode: 200,
        genrePreferences: [
          { genreId: 1, genreName: 'Rock', preferenceLevel: 5 }
        ],
        artistPreferences: [
          { artistId: 1, artistName: 'The Beatles', preferenceLevel: 5 }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getUserPreferences(mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/music/preferences`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateGenrePreferences', () => {
    it('should update genre preferences successfully', async () => {
      const firebaseUid = 'test-uid';
      const preferences = [
        { genreId: 1, genreName: 'Rock', preferenceLevel: 5 },
        { genreId: 2, genreName: 'Pop', preferenceLevel: 3 }
      ];
      const mockResponse = {
        statusCode: 200,
        updatedCount: 2
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateGenrePreferences(firebaseUid, preferences, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/music/preferences/genres`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseUid,
            preferences
          })
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateArtistPreferences', () => {
    it('should update artist preferences successfully', async () => {
      const firebaseUid = 'test-uid';
      const preferences = [
        { artistId: 1, artistName: 'The Beatles', preferenceLevel: 5 },
        { artistId: 2, artistName: 'Led Zeppelin', preferenceLevel: 4 }
      ];
      const mockResponse = {
        statusCode: 200,
        updatedCount: 2
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await updateArtistPreferences(firebaseUid, preferences, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/music/preferences/artists`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseUid,
            preferences
          })
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerGoogleUser', () => {
    it('should register Google user successfully', async () => {
      const userData = {
        email: 'test@gmail.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        uid: 'firebase-uid-123'
      };
      const mockResponse = {
        statusCode: 200,
        isNewUser: true,
        firebaseUid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        profileComplete: false
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await registerGoogleUser(mockToken, userData);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/auth/google`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            userEmail: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            firebaseUid: userData.uid
          })
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});