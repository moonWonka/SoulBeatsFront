
import React from 'react';
import { UserProfile } from '../../types';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-xs mx-auto my-2 transform transition-all duration-500 hover:scale-105 border border-fuchsia-100">
      <div className="relative">
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-64 md:h-72 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-fuchsia-900/90 via-fuchsia-800/60 to-transparent">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {profile.name}, <span className="font-light">{profile.age}</span>
          </h2>
          {profile.location && (
            <p className="text-fuchsia-100 text-xs mt-1">{profile.location}</p>
          )}
        </div>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-gray-700 mb-3 text-xs leading-relaxed line-clamp-2">{profile.bio}</p>
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">Intereses</h3>
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 4).map((interest, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-700 rounded-full text-xs font-medium border border-fuchsia-200 hover:from-fuchsia-200 hover:to-pink-200 transition-colors duration-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
