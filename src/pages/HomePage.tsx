import React from 'react';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user?.email || 'Invitado'}</h1>
    </div>
  );
}

export default HomePage;