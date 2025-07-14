import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, Unlink, X } from 'lucide-react';

interface MenuDropdownProps {
  onConfigureProfile: () => void;
  onUnlinkSpotify: () => void;
  isUnlinkLoading?: boolean;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ 
  onConfigureProfile, 
  onUnlinkSpotify, 
  isUnlinkLoading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Menú de opciones"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Opciones
              </h3>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => handleMenuItemClick(onConfigureProfile)}
                className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg mr-3 group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-900/50 transition-colors">
                  <Settings className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Configurar Perfil
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Edita tu información personal
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMenuItemClick(onUnlinkSpotify)}
                disabled={isUnlinkLoading}
                className="w-full px-4 py-3 text-left flex items-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  {isUnlinkLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 dark:border-red-400" />
                  ) : (
                    <Unlink className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {isUnlinkLoading ? 'Desvinculando...' : 'Desvincular Spotify'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isUnlinkLoading ? 'Por favor espera...' : 'Desconectar tu cuenta de Spotify'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};