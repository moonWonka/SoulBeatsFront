import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { registerGoogleUser } from '../services/backendService';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
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
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
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
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};