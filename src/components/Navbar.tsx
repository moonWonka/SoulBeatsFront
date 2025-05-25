import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  matchCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, matchCount }) => {
  const NavButton: React.FC<{
    view: AppView;
    label: string;
  }> = ({ view, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex-1 py-3 px-2 text-center transition-colors duration-200 relative ${
        currentView === view ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
      }`}
      aria-label={`Go to ${label}`}
    >
      <div className="flex flex-col items-center">
        <span className={`text-xs mt-1 font-medium ${currentView === view ? 'text-rose-500' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      {view === 'matches' && matchCount > 0 && (
        <span className="absolute top-1 right-1/4 -mr-2 transform translate-x-1/2 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {matchCount}
        </span>
      )}
      {currentView === view && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-t-full"></div>
      )}
    </button>
  );

  return (
    <nav className="flex w-full border-b border-gray-200 bg-white sticky top-0 z-10">
      <NavButton view="swipe" label="Discover" />
      <NavButton view="matches" label="Matches" />
    </nav>
  );
};

export default Navbar;
