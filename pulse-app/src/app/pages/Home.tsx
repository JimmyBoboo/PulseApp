import { ProfileAvatar } from "../components/profileSection";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <ProfileAvatar userId={1} size="lg" showName={true} />
    </div>
  );
};
