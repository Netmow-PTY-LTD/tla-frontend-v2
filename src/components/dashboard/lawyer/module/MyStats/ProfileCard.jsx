'use client';
import PencilIcon from '@/assets/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { userDummyImage } from '@/data/data';
import { Home, Inbox, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProfileCard = ({ profile, isLoading, isError, error }) => {
  // console.log('profile', profile);
  return (
    // figma base
    <Card>
      <div className="p-4 space-y-4">
        <Avatar className="h-[70px] w-[70px]">
          <AvatarImage
            src={
              profile?.profile?.profilePicture
                ? profile?.profile?.profilePicture
                : userDummyImage
            }
            alt="Profile"
          />
          <AvatarFallback>Client</AvatarFallback>
        </Avatar>

        <h3 className="font-medium heading flex items-center">
          {profile?.profile?.name}{' '}
          <Link
            href={'/lawyer/settings/profile?section=about'}
            aria-label="Edit Name"
            className="ml-3 rounded "
          >
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </Link>
        </h3>

        <div className="space-y-4 text-[#34495E]">
          <p className="heading-base flex items-center">
            <PhoneCall className="mr-2 w-5 h-5" />
            <span> {profile?.profile?.phone} (Verified)</span>
          </p>
          <p className="heading-base flex items-center">
            {' '}
            <Inbox className="mr-2 w-5 h-5" /> <span> {profile?.email}</span>
          </p>
          <p className="heading-base flex items-center">
            {' '}
            {profile?.profile?.address && (
              <>
                <Home className="mr-2 w-5 h-5" />
                <span> {profile?.profile?.address}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
