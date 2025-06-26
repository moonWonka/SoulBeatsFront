import React from 'react';
import { AppView } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  matchCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, matchCount }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  const NavButton: React.FC<{
    view: AppView;
    label: string;
  }> = ({ view, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex-1 py-3 px-2 text-center transition-colors duration-200 relative ${
        currentView === view 
          ? 'text-fuchsia-500 dark:text-violet-400' 
          : 'text-gray-400 hover:text-fuchsia-400 dark:text-gray-500 dark:hover:text-violet-300'
      }`}
      aria-label={`Ir a ${label}`}
    >
      <div className="flex flex-col items-center">
        <span className={`text-xs mt-1 font-medium ${
          currentView === view 
            ? 'text-fuchsia-500 dark:text-violet-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {label}
        </span>
      </div>
      {view === 'matches' && matchCount > 0 && (
        <span className="absolute top-1 right-1/4 -mr-2 transform translate-x-1/2 bg-fuchsia-500 dark:bg-violet-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {matchCount}
        </span>
      )}
      {currentView === view && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-fuchsia-500 dark:bg-violet-500 rounded-t-full"></div>
      )}
    </button>
  );

  return (
    <nav className="flex w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <NavButton view="swipe" label="Descubrir" />
      <NavButton view="matches" label="Coincidencias" />
      
      {/* Botón de Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-fuchsia-500 dark:hover:text-violet-400 transition-colors duration-200"
        aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 mb-1">
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </div>
          <span className="text-xs font-medium">
            {darkMode ? "Claro" : "Oscuro"}
          </span>
        </div>
      </button>
    </nav>
  );
};

export default Navbar;
