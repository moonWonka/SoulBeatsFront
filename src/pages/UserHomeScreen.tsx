import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Settings, Link as LinkIcon } from 'lucide-react'; // Importar iconos necesarios

const UserHomeScreen: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50 p-4 pt-16 sm:pt-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 flex items-center justify-center text-fuchsia-500">
            <UserCircle2 size={64} strokeWidth={1.5} /> {/* Icono de avatar más grande */}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.displayName || user?.email || 'Usuario'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Gestiona tu perfil y conecta tus servicios.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <GradientButton onClick={() => console.log('Configurar Perfil clickeado')}>
              <Settings className="w-5 h-5 mr-2" />
              Configurar Perfil
            </GradientButton>
          </div>
          <div>
            <OutlineButton onClick={() => console.log('Vincular con Spotify clickeado')}>
              <LinkIcon className="w-5 h-5 mr-2" /> {/* Usando LinkIcon para la idea de vinculación */}
              Vincular con Spotify
            </OutlineButton>
            {/* Opción alternativa si se prefiere un icono de música para Spotify:
            <OutlineButton onClick={() => console.log('Vincular con Spotify clickeado')}>
              <Music className="w-5 h-5 mr-2" />
              Vincular con Spotify
            </OutlineButton>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
