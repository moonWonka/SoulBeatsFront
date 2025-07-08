import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserInfo } from '../services/backendService';
import { UserProfile } from '../types';
import ProfileCard from '../../components/profileCard/ProfileCard';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Settings, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.uid) {
        try {
          const token = await user.getIdToken();
          const profileData = await getUserInfo(user.uid, token);
          setUserProfile(profileData);
          setError(null);
        } catch (err) {
          setError('Failed to fetch user profile.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setError('User not logged in.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-sm mx-auto space-y-6">
          {userProfile ? (
            <div className="relative h-[500px] w-full"> {/* Container for ProfileCard */}
              <ProfileCard profile={userProfile} />
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 flex items-center justify-center text-fuchsia-500 dark:text-fuchsia-300">
                <UserCircle2 size={56} strokeWidth={1.5} className="sm:w-16 sm:h-16" />
              </div>
            </div>
          )}

          {/* Welcome message and details - adjusted to appear below card or if no card */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {userProfile?.name || userProfile?.username || user?.displayName || user?.email || 'Usuario'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tu perfil y conecta tus servicios.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <GradientButton onClick={() => navigate('/profile/edit')}>
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
