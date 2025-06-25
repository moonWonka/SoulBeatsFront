import React, { useState } from 'react';
import ProfileCard from '../components/revision/ProfileCard';
import ActionButtons from '../components/revision/ActionButtons';
import MatchModal from '../components/revision/MatchModal';
import { UserProfile } from '../types';

const ExampleRevisionPage: React.FC = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  // Perfiles de ejemplo con carátulas de álbumes musicales
  const sampleProfiles: UserProfile[] = [
    {
      id: '1',
      name: 'María',
      age: 25,
      bio: 'Amante de la música indie y los conciertos en vivo. Mi canción favorita: "Fluorescent Adolescent" de Arctic Monkeys.',
      imageUrl: '/descarga.jpg', // Usando la imagen local
      interests: ['Indie Pop', 'Rock Alternativo', 'Conciertos', 'Festivales'],
      location: 'Santiago, Chile'
    },
    {
      id: '2', 
      name: 'Carlos',
      age: 28,
      bio: 'Productor musical y DJ. Mi álbum favorito es "Discovery" de Daft Punk. Siempre buscando nuevos beats.',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      interests: ['Música Electrónica', 'House', 'Techno', 'Producción Musical'],
      location: 'Valparaíso, Chile'
    },
    {
      id: '3',
      name: 'Sofía',
      age: 23,
      bio: 'Cantautora y guitarrista. "The Sound of Silence" me inspira cada día. Amo la música acústica y auténtica.',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      interests: ['Folk', 'Rock Clásico', 'Guitarra', 'Composición'],
      location: 'Concepción, Chile'
    },
    {
      id: '4',
      name: 'Diego',
      age: 26,
      bio: 'Fan del reggaeton y la música urbana. "Gasolina" de Daddy Yankee nunca pasa de moda. Siempre con buena vibra.',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&sat=-100&hue=120',
      interests: ['Reggaeton', 'Trap', 'Hip Hop', 'Música Urbana'],
      location: 'Antofagasta, Chile'
    },
    {
      id: '5',
      name: 'Ana',
      age: 24,
      bio: 'Melómana total. Desde Billie Eilish hasta Queen, mi playlist es ecléctica. La música es mi lenguaje universal.',
      imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
      interests: ['Pop', 'Rock', 'Indie', 'Clásica'],
      location: 'La Serena, Chile'
    }
  ];

  const currentProfile = sampleProfiles[currentProfileIndex];

  const handleLike = () => {
    // Simular match (50% de probabilidad)
    if (Math.random() > 0.5) {
      setMatchedProfile(currentProfile);
      setShowMatchModal(true);
    }
    nextProfile();
  };

  const handleNope = () => {
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % sampleProfiles.length);
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setMatchedProfile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-6 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Componentes Revisados
        </h1>
        
        <div className="text-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Perfil {currentProfileIndex + 1} de {sampleProfiles.length}
          </span>
        </div>

        {/* ProfileCard Component */}
        <div className="mb-4">
          <ProfileCard profile={currentProfile} />
        </div>

        {/* ActionButtons Component */}
        <ActionButtons 
          onLike={handleLike}
          onNope={handleNope}
          disabled={false}
        />

        {/* Instructions */}
        <div className="mt-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Componentes Implementados:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• <span className="font-medium text-fuchsia-600">ProfileCard</span>: Tarjeta de perfil compacta</li>
            <li>• <span className="font-medium text-fuchsia-600">ActionButtons</span>: Botones de acción optimizados</li>
            <li>• <span className="font-medium text-fuchsia-600">MatchModal</span>: Modal de match</li>
          </ul>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            ✨ Colores fuchsia/rosa, textos en español y responsivo
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentProfileIndex(0)}
            className="px-4 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200"
          >
            Reiniciar Demo
          </button>
        </div>
      </div>

      {/* MatchModal Component */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={closeMatchModal}
        matchedProfile={matchedProfile}
        userAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      />
    </div>
  );
};

export default ExampleRevisionPage;
