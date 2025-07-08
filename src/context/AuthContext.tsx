import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { registerGoogleUser, registerOrLoginSpotifyUser } from '../services/backendService'; // Import new service

interface AuthContextProps {
  user: User | any | null; // Allow 'any' for Spotify user structure for now
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithSpotify: (accessToken: string, spotifyProfile: any) => Promise<void>; // New function
  spotifyAccessToken: string | null;
  spotifyUser: any | null;
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
  const [user, setUser] = useState<User | any | null>(null); // Allow 'any' for Spotify user
  const [loading, setLoading] = useState<boolean>(true);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [spotifyUser, setSpotifyUser] = useState<any | null>(null);

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
      await signOut(auth); // Firebase sign out
      setUser(null);
      setSpotifyAccessToken(null); // Clear Spotify token
      setSpotifyUser(null);      // Clear Spotify user
      console.log('User logged out, Spotify session cleared');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const loginWithSpotify = async (accessToken: string, spotifyProfile: any): Promise<void> => {
    console.log('AuthContext: loginWithSpotify called', { accessToken, spotifyProfile });
    try {
      // Call backend service to register/login Spotify user
      const backendResponse = await registerOrLoginSpotifyUser(spotifyProfile, accessToken);
      console.log('AuthContext: Backend response from registerOrLoginSpotifyUser', backendResponse);

      if (backendResponse.success && backendResponse.user) {
        // Set Spotify specific state
        setSpotifyAccessToken(accessToken);
        setSpotifyUser(spotifyProfile);

        // Simulate setting the main user state based on Spotify profile
        // This is a placeholder. In a real app, the backend would ideally return a
        // Firebase custom token to sign in with, or a unified user object.
        const simulatedUser = {
          uid: spotifyProfile.id,
          email: spotifyProfile.email,
          displayName: spotifyProfile.display_name || spotifyProfile.id,
          providerData: [{ providerId: 'spotify.com' }],
          // Add other fields as needed to mimic Firebase User object structure if your app relies on them
          // For example:
          // photoURL: spotifyProfile.images?.[0]?.url,
          // emailVerified: true, // Assuming Spotify email is verified
        };
        setUser(simulatedUser as User); // Cast as User, acknowledge it's not a full Firebase User
        console.log('AuthContext: Spotify user set in context', { spotifyAccessToken: accessToken, spotifyUser: spotifyProfile, simulatedUser });
      } else {
        throw new Error(backendResponse.message || 'Failed to register or login Spotify user with backend.');
      }
    } catch (error) {
      console.error('AuthContext: Error during loginWithSpotify:', error);
      // Clear any partial Spotify state if login fails
      setSpotifyAccessToken(null);
      setSpotifyUser(null);
      throw error; // Re-throw to be caught by the caller in SpotifyCallbackPage
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
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithSpotify, spotifyAccessToken, spotifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};