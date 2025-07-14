import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Music, ExternalLink, Users } from 'lucide-react';
import { SpotifyPlaylistModel } from '../../types';

interface PlaylistCarouselProps {
  playlists: SpotifyPlaylistModel[];
  loading?: boolean;
}

export const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({ playlists, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);

  // Responsive logic
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsToShow(3); // lg: 3 items
      else if (width >= 768) setItemsToShow(2); // md: 2 items  
      else setItemsToShow(1); // sm: 1 item
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const maxIndex = Math.max(0, playlists.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(itemsToShow)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No hay playlists disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Crea algunas playlists en Spotify para verlas aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Navigation buttons */}
      {playlists.length > itemsToShow && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Carousel container */}
      <div className="overflow-hidden px-8">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${(currentIndex / itemsToShow) * 100}%)`,
            width: `${(playlists.length / itemsToShow) * 100}%`
          }}
        >
          {playlists.map((playlist, index) => (
            <div key={playlist.id || index} className="flex-shrink-0 px-2" style={{ width: `${100 / playlists.length}%` }}>
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {playlists.length > itemsToShow && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-fuchsia-600' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Playlist Card Component
const PlaylistCard: React.FC<{ playlist: SpotifyPlaylistModel }> = ({ playlist }) => {
  const handlePlaylistClick = () => {
    if (playlist.externalUrl) {
      window.open(playlist.externalUrl, '_blank');
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={handlePlaylistClick}
    >
      {/* Playlist Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400">
        {/* Imagen de prueba siempre visible */}
        <img
          src="https://picsum.photos/300/200?random=1"
          alt="Test image"
          className="w-full h-full object-cover absolute inset-0 opacity-50"
        />
        
        {playlist.imageUrl ? (
          <>
            <img
              src={playlist.imageUrl}
              alt={playlist.name || 'Playlist'}
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                console.error('Spotify image failed to load:', playlist.imageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              onLoad={() => console.log('Spotify image loaded successfully:', playlist.imageUrl)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <Music className="w-16 h-16 text-white opacity-60" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1 truncate">
          {playlist.name || 'Sin nombre'}
        </h3>
        
        {playlist.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {playlist.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            <span>{playlist.tracksTotal} canciones</span>
          </div>
          
          {playlist.ownerDisplayName && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="truncate max-w-20">{playlist.ownerDisplayName}</span>
            </div>
          )}
        </div>

        {/* Public/Private indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            playlist.public 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {playlist.public ? 'Pública' : 'Privada'}
          </span>
          
          {playlist.collaborative && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Colaborativa
            </span>
          )}
        </div>
      </div>
    </div>
  );
};