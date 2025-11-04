"use client";

import { useEffect, useState } from "react";

interface ProfileAvatarProps {
  userId?: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export function ProfileAvatar({
  userId = 1,
  size = "md",
  showName = true,
}: ProfileAvatarProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse`}
        />
        {showName && (
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        )}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} ${getAvatarColor(
          user.name
        )} rounded-full flex items-center justify-center text-white font-semibold`}
      >
        {getInitials(user.name)}
      </div>
      {showName && (
        <span className="font-medium text-gray-800">{user.name}</span>
      )}
    </div>
  );
}
