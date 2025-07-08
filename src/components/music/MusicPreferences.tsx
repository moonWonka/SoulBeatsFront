import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getGenres, 
  getArtistsByGenre, 
  getUserPreferences, 
  updateGenrePreferences, 
  updateArtistPreferences 
} from '../../services/backendService';
import type { 
  GenreDto, 
  ArtistDto, 
  GenrePreferenceDto, 
  ArtistPreferenceDto 
} from '../../types';

export function MusicPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  // Preference states
  const [genrePreferences, setGenrePreferences] = useState<GenrePreferenceDto[]>([]);
  const [artistPreferences, setArtistPreferences] = useState<ArtistPreferenceDto[]>([]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const token = await user!.getIdToken();
      
      // Load genres and current preferences
      const [genresResponse, preferencesResponse] = await Promise.all([
        getGenres(token),
        getUserPreferences(token)
      ]);

      if (genresResponse.genres) {
        setGenres(genresResponse.genres);
      }

      if (preferencesResponse.genrePreferences) {
        setGenrePreferences(preferencesResponse.genrePreferences);
      }

      if (preferencesResponse.artistPreferences) {
        setArtistPreferences(preferencesResponse.artistPreferences);
      }

    } catch (err) {
      setError('Error al cargar datos musicales');
      console.error('Error loading music data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadArtistsByGenre = async (genreId: number) => {
    try {
      setSelectedGenre(genreId);
      const token = await user!.getIdToken();
      const response = await getArtistsByGenre(genreId, token);
      
      if (response.artists) {
        setArtists(response.artists);
      }
    } catch (err) {
      setError('Error al cargar artistas');
      console.error('Error loading artists:', err);
    }
  };

  const handleGenrePreferenceChange = (genreId: number, level: number) => {
    const genre = genres.find(g => g.id === genreId);
    if (!genre) return;

    setGenrePreferences(prev => {
      const existing = prev.find(p => p.genreId === genreId);
      if (existing) {
        return prev.map(p => 
          p.genreId === genreId 
            ? { ...p, preferenceLevel: level }
            : p
        );
      } else {
        return [...prev, {
          genreId,
          genreName: genre.name,
          preferenceLevel: level
        }];
      }
    });
  };

  const handleArtistPreferenceChange = (artistId: number, level: number) => {
    const artist = artists.find(a => a.id === artistId);
    if (!artist) return;

    setArtistPreferences(prev => {
      const existing = prev.find(p => p.artistId === artistId);
      if (existing) {
        return prev.map(p => 
          p.artistId === artistId 
            ? { ...p, preferenceLevel: level }
            : p
        );
      } else {
        return [...prev, {
          artistId,
          artistName: artist.name,
          preferenceLevel: level
        }];
      }
    });
  };

  const savePreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const token = await user.getIdToken();
      const firebaseUid = user.uid;

      // Filter preferences with level > 0
      const genrePrefs = genrePreferences.filter(p => p.preferenceLevel > 0);
      const artistPrefs = artistPreferences.filter(p => p.preferenceLevel > 0);

      await Promise.all([
        updateGenrePreferences(firebaseUid, genrePrefs, token),
        updateArtistPreferences(firebaseUid, artistPrefs, token)
      ]);

      setSuccess('Preferencias guardadas exitosamente');
    } catch (err) {
      setError('Error al guardar preferencias');
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const getPreferenceLevel = (id: number, type: 'genre' | 'artist'): number => {
    if (type === 'genre') {
      return genrePreferences.find(p => p.genreId === id)?.preferenceLevel || 0;
    } else {
      return artistPreferences.find(p => p.artistId === id)?.preferenceLevel || 0;
    }
  };

  const PreferenceStars = ({ 
    currentLevel, 
    onChange 
  }: { 
    currentLevel: number; 
    onChange: (level: number) => void; 
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(level => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`w-6 h-6 ${
            level <= currentLevel 
              ? 'text-yellow-400' 
              : 'text-gray-300 dark:text-gray-600'
          } hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Preferencias Musicales
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      {/* Genres Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Géneros Musicales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map(genre => (
            <div 
              key={genre.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => loadArtistsByGenre(genre.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {genre.name}
                </h4>
                <PreferenceStars
                  currentLevel={getPreferenceLevel(genre.id, 'genre')}
                  onChange={(level) => handleGenrePreferenceChange(genre.id, level)}
                />
              </div>
              {genre.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {genre.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Artists Section */}
      {selectedGenre && artists.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Artistas - {genres.find(g => g.id === selectedGenre)?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {artists.map(artist => (
              <div 
                key={artist.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {artist.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Popularidad: {artist.popularity}
                    </p>
                  </div>
                  <PreferenceStars
                    currentLevel={getPreferenceLevel(artist.id, 'artist')}
                    onChange={(level) => handleArtistPreferenceChange(artist.id, level)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          disabled={saving}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700'
          } text-white`}
        >
          {saving ? 'Guardando...' : 'Guardar Preferencias'}
        </button>
      </div>
    </div>
  );
}