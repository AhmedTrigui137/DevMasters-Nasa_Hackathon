import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full p-8">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <p className="text-gray-300">Profile settings and health preferences will be editable here.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
