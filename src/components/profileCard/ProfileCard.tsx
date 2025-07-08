import React from 'react';
import { UserProfile } from '../../types';

const ProfileCard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return (
    <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-24 top-0 bottom-0 flex flex-col justify-end">
      <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden group">
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          // Add a key to force re-render on profile change for transition
          key={profile.id} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
          <div className="flex items-end space-x-3 md:space-x-4">
            <img 
              src={profile.imageUrl} // Using same image for avatar, can be a dedicated avatarUrl
              alt={`${profile.name} avatar`}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white shadow-lg bg-pink-100" 
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}, {profile.age}</h2>
              {profile.location && (
                <p className="text-base md:text-lg text-gray-200">{profile.location}</p>
              )}
            </div>
          </div>
          {profile.bio && (
            <p className="mt-3 text-sm text-gray-300 leading-relaxed line-clamp-2">{profile.bio}</p>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Interests:</span> {profile.interests.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;