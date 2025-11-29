"use client";
import { ProfilePage } from "../components/ProfilePage/ProfilePage";

export const Profile = () => {
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#EEEEEE" }}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-7 text-center">Your Profile</h1>
        <p className="text-gray-700 text-center mb-6">
          Manage your account and personal information
        </p>
      </div>

      
      <ProfilePage />
    </div>
  );
};
