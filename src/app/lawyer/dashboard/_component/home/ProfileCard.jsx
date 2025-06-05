import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
export default function ProfileCard() {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-[10px] relative z-[9]">
      {/* Left section: Avatar and text */}
      <div className="flex items-center gap-4">
        <Avatar className="h-[80px] w-[80px]">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
          <AvatarFallback>PI</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold text-gray-800 heading">
            Lawyer Hub
          </h1>
          <p className="text-gray-500 mt-1 admin-text">
            Completing your profile is a great way to appeal to customers.
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
