import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DarkModeTest: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4">Test de Dark Mode</h1>
      
      <div className="mb-6">
        <p className="mb-2">Estado actual: {darkMode ? 'Modo Oscuro' : 'Modo Claro'}</p>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors"
        >
          Cambiar a {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Tarjeta de Prueba</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Este texto debería cambiar de color cuando cambies el modo.
          </p>
        </div>
        
        <div className="p-4 bg-fuchsia-100 dark:bg-fuchsia-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-fuchsia-900 dark:text-fuchsia-100">Tarjeta Fuchsia</h2>
          <p className="text-fuchsia-700 dark:text-fuchsia-300">
            Esta usa los colores de la app SoulBeats.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Información del DOM:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Clase HTML: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {document.documentElement.className || 'sin clases'}
          </code>
        </p>
      </div>
    </div>
  );
};

export default DarkModeTest;
