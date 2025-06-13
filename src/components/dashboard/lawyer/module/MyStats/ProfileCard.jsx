'use client';
import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProfileCard = ({ profile, isLoading, isError, error }) => {
  // console.log('profile', profile);
  return (
    // figma base
    <Card>
      <div className="p-3 space-y-5">
        <figure className="w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={
              profile?.profile?.profilePicture
                ? profile?.profile?.profilePicture
                : '/assets/img/auth-step1.png'
            }
            alt="User profile picture"
            width={80}
            height={80}
            priority
            className="rounded-full object-cover"
          />
        </figure>
        <h1 className="font-medium text-xl flex items-center">
          {profile?.profile?.name}{' '}
          <Link
            href={'/lawyer/settings/profile'}
            aria-label="Edit Name"
            className="ml-3 rounded "
          >
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </Link>
        </h1>
        <h1 className="font-medium  flex items-center">
          Personal Details{' '}
          <Link
            href={'/lawyer/settings/profile'}
            aria-label="Edit Name"
            className="ml-3 rounded "
          >
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </Link>
        </h1>

        <div className="space-y-4 text-[#34495E] ">
          <p> Phone: {profile?.profile?.phone} (Verified)</p>
          <p> Email: {profile?.email}</p>
          <p> Address: {profile?.profile?.address} </p>
        </div>
        <hr className="tet-[#F3F3F3] border" />
      </div>
      <div className="mt-5 p-3">
        <div className="mb-4">
          <h1 className="font-medium  flex items-center">
            About Description{' '}
            <Link
              href={'/lawyer/settings/profile'}
              aria-label="Edit Name"
              className="ml-3 rounded "
            >
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </Link>
          </h1>
          <div className="p-3 bg-[#F3F3F3] mt-5 rounded-lg ">
            <p>
              {profile?.profile?.bio
                ? profile?.profile?.bio
                : "If you're facing a divorce, it's crucial to seek professionallegal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understandyour rights and options."}
            </p>
          </div>
        </div>
        <hr className="tet-[#F3F3F3] border" />
        <div className="space-y-4 my-5">
          <h1 className="font-medium  flex items-center">
            Professional Details{' '}
            <Link
              href={'/lawyer/settings/profile'}
              aria-label="Edit Name"
              className="ml-3 rounded "
            >
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </Link>
          </h1>
          <p>Company Name: {profile?.profile?.companyProfile?.companyName}</p>
          <p>
            Company Address:{' '}
            {profile?.profile?.companyProfile?.location?.address}
          </p>
          <p>Website URL: {profile?.profile?.companyProfile?.website}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
