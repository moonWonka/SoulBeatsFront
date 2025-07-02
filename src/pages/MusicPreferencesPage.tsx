import React from 'react';
import { MusicPreferences } from '../components/music/MusicPreferences';

export function MusicPreferencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <MusicPreferences />
    </div>
  );
}

export default MusicPreferencesPage;