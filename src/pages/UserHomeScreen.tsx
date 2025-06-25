import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Settings, Link as LinkIcon } from 'lucide-react'; // Importar iconos necesarios

const UserHomeScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 flex items-center justify-center text-fuchsia-500">
              <UserCircle2 size={56} strokeWidth={1.5} className="sm:w-16 sm:h-16" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {user?.displayName || user?.email || 'Usuario'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tu perfil y conecta tus servicios.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <GradientButton onClick={() => console.log('Configurar Perfil clickeado')}>
              <Settings className="w-5 h-5 mr-2" />
              Configurar Perfil
            </GradientButton>
            
            <OutlineButton onClick={() => console.log('Vincular con Spotify clickeado')}>
              <LinkIcon className="w-5 h-5 mr-2" />
              Vincular con Spotify
            </OutlineButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
