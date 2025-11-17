"use client";
import { ProfilePage } from "../components/ProfilePage/ProfilePage";

export const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Profile</h1>
        <p className="text-xl text-gray-600">
          Manage your account and personal information
        </p>
      </div>

      
      <ProfilePage />
    </div>
  );
};
