
import React from 'react';
import { UserProfile } from '../../types';
import { Heart } from 'lucide-react';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: UserProfile | null;
  userAvatar?: string;
}

const MatchModal: React.FC<MatchModalProps> = ({ 
  isOpen, 
  onClose, 
  matchedProfile, 
  userAvatar = "https://via.placeholder.com/150/fuchsia/white?text=Tú"
}) => {
  if (!isOpen || !matchedProfile) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 text-center max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out">
        {/* Icono de corazones */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-fuchsia-500 animate-bounce" fill="currentColor" />
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-400 absolute -top-1 -right-1 md:-top-2 md:-right-2 animate-pulse" fill="currentColor" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-600 mb-6">
          ¡Es un Match!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
          ¡Tú y <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">{matchedProfile.name}</span> se han gustado mutuamente!
        </p>
        
        <div className="flex justify-center items-center space-x-4 md:space-x-6 mb-8">
          <div className="relative">
            <img 
              src={userAvatar} 
              alt="Tu perfil" 
              className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-fuchsia-400 shadow-xl ring-4 ring-fuchsia-100" 
            />
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-fuchsia-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" />
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-500 mb-2 animate-pulse" fill="currentColor" />
            <span className="text-xl md:text-2xl font-bold text-fuchsia-500">&</span>
          </div>
          
          <div className="relative">
            <img 
              src={matchedProfile.imageUrl} 
              alt={matchedProfile.name} 
              className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-pink-400 shadow-xl ring-4 ring-pink-100" 
            />
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-300 dark:focus:ring-fuchsia-600 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            aria-label="Continuar descubriendo perfiles"
          >
            Continuar Descubriendo
          </button>
          
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
