import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Settings, LogOut } from 'lucide-react'; // Removed LinkIcon, Added LogOut
import { useNavigate } from 'react-router-dom';

const UserHomeScreen: React.FC = () => {
  const { user, spotifyUser, logout } = useAuth(); // Get spotifyUser and logout
  const navigate = useNavigate();

  const isSpotifyLogin = user?.providerData?.[0]?.providerId === 'spotify.com';

  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 flex items-center justify-center text-fuchsia-500 dark:text-fuchsia-300">
              {spotifyUser?.images?.[0]?.url ? (
                <img src={spotifyUser.images[0].url} alt="Spotify Profile" className="rounded-full w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={56} strokeWidth={1.5} className="sm:w-16 sm:h-16" />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {user?.displayName || user?.email || 'Usuario'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bienvenido a tu espacio personal.
            </p>
          </div>

          {isSpotifyLogin && spotifyUser && (
            <div className="bg-green-50 dark:bg-green-800/30 p-4 rounded-lg text-center mb-6 border border-green-200 dark:border-green-700">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Conectado a Spotify</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                ¡Hola, {spotifyUser.display_name || spotifyUser.id}!
              </p>
              {spotifyUser.email && (
                <p className="text-xs text-green-500 dark:text-green-500">
                  Email: {spotifyUser.email}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4 w-full">
            <GradientButton onClick={() => navigate('/profile/edit')}>
              <Settings className="w-5 h-5 mr-2" />
              Configurar Perfil
            </GradientButton>
            
            <OutlineButton onClick={logout} variant="danger">
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </OutlineButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
