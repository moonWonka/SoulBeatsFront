import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { getUserInfo, updateUserInfo } from '../services/backendService';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const data = await getUserInfo(user.uid, token);
          // Map API response fields to local state
          setName(data.fullName || data.userName || '');
          setAge(''); // Age not returned by getUserInfo endpoint
          setBio(''); // Bio not returned by getUserInfo endpoint  
          setInterests(''); // favoriteGenres not returned by getUserInfo endpoint
        } catch (err) {
          console.error(err);
          setError('Error al cargar la información del perfil.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    try {
      const token = await user.getIdToken();
      
      // Format data according to API specification
      const profileData = {
        displayName: name,
        email: user.email || '',
        age: age === '' ? undefined : Number(age),
        bio,
        favoriteGenres: interests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .join(','), // Convert to comma-separated string
        profilePictureUrl: user.photoURL || undefined
      };
      
      await updateUserInfo(user.uid, token, profileData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error al guardar el perfil.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-800 dark:text-gray-200">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">Editar Perfil</h2>
        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Edad
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Géneros favoritos (separados por comas)
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <GradientButton type="submit">Guardar</GradientButton>
          <OutlineButton onClick={() => navigate('/dashboard')}>Cancelar</OutlineButton>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
