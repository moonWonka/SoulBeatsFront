import React from 'react';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Bienvenido, {user?.email || 'Invitado'}</h1>
    </div>
  );
}

export default HomePage;