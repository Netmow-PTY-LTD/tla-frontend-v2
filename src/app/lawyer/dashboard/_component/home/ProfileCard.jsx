import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { userDummyImage } from '@/data/data';
export default function ProfileCard() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-[10px] relative z-[9]">
      {/* Left section: Avatar and text */}
      <div className="flex items-center gap-4">
        <Avatar className="h-[70px] w-[70px]">
          <AvatarImage
            src={
              userInfo?.data?.profile?.profilePicture ??
              userDummyImage
            }
            alt="Profile"
          />
          <AvatarFallback>PI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 heading">
            {userInfo?.data?.profile?.name ?? 'Lawyer'}
          </h2>
          <p className="text-gray-500 mt-1 admin-text">
            Completing your profile is a great way to appeal to clients.
          </p>
        </div>
      </div>

      {/* Right section: Edit button */}
      <Link
        href="/lawyer/settings/profile"
        className="text-gray-600 text-sm font-medium px-4 py-2 rounded-md transition"
      >
        Edit
      </Link>
    </div>
  );
}
