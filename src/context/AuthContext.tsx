import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { registerGoogleUser } from '../services/backendService';
import { getSpotifyStatus } from '../services/spotifyBackendService';
import { SpotifyProfile } from '../types';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  spotifyLinked: boolean;
  spotifyProfile: SpotifyProfile | null;
  refreshSpotifyStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [spotifyLinked, setSpotifyLinked] = useState<boolean>(false);
  const [spotifyProfile, setSpotifyProfile] = useState<SpotifyProfile | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setSpotifyLinked(false);
      setSpotifyProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const refreshSpotifyStatus = async (): Promise<void> => {
    if (!user) {
      setSpotifyLinked(false);
      setSpotifyProfile(null);
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await getSpotifyStatus(token);
      setSpotifyLinked(response.isLinked);
      setSpotifyProfile(response.profile || null);
    } catch (error) {
      console.error('Error refreshing Spotify status:', error);
      setSpotifyLinked(false);
      setSpotifyProfile(null);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Si es un usuario de Google (no tiene información de proveedor de email/password)
        const isGoogleUser = currentUser.providerData.some(provider => provider.providerId === 'google.com');
        
        if (isGoogleUser) {
          try {
            const token = await currentUser.getIdToken();
            const userData = {
              email: currentUser.email!,
              displayName: currentUser.displayName ?? undefined,
              photoURL: currentUser.photoURL ?? undefined,
              uid: currentUser.uid
            };
            
            console.log('Sincronizando usuario Google con backend:', userData);
            await registerGoogleUser(token, userData);
            console.log('Usuario Google sincronizado con backend');
          } catch (backendError) {
            console.log('Error al sincronizar usuario Google con backend (posiblemente ya existe):', backendError);
            // No impedimos el login si falla la sincronización con backend
          }
        }
      }
      
      setUser(currentUser);
      setLoading(false);

      // Refresh Spotify status when user changes
      if (currentUser) {
        refreshSpotifyStatus();
      } else {
        setSpotifyLinked(false);
        setSpotifyProfile(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      spotifyLinked, 
      spotifyProfile, 
      refreshSpotifyStatus, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};