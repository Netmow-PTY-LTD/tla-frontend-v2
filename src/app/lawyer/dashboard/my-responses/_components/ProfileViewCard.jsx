'use client';
import React from 'react';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';

import {
  ArrowDownToLine,
  AtSign,
  BadgeCheck,
  FileText,
  PhoneOutgoing,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

const ProfileViewCard = ({ id }) => {
  return (
    <div>
      <div className="bg-white rounded w-full lg:w-1/2 ">
        <div className="flex flex-col  items-start gap-4 ">
          <figure className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="/assets/img/auth-step1.png"
              alt="John Doe"
              width={80}
              height={80}
              priority
              className="rounded-full object-cover"
            />
          </figure>
          <div>
            <h2 className="font-medium text-xl sm:text-base">Angie Vella</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Elgin St. Celina, Delaware 10299
            </p>
          </div>
        </div>
        <hr className="border-[#F3F3F3] my-5  " />
        <div className="mb-4">
          <p className=" flex items-center gap-2">
            <PhoneOutgoing /> <span>Phone: (480) *******</span>{' '}
          </p>
          <p className=" flex items-center gap-2 mt-2">
            <AtSign /> <span>Email: t*******@e********.com</span>{' '}
          </p>
        </div>
        <div className="flex items-center gap-2  ">
          <button className="btn-default btn-primary">Call Client</button>
          <button className="btn-default btn-primary"> Send WhatsApp</button>
          <button className="btn-default btn-primary"> Send Email</button>
        </div>
        <div className="mt-5">
          <h1 className="font-medium mb-1">Matched criteria</h1>
          <div className="flex flex-wrap gap-2">
            <TagButton
              text="Urgent"
              bgColor="#FF86021A"
              icon={<Zap className="text-[#FF8602]" />}
            />
            <TagButton
              text="Separation Law"
              bgColor="#004DA61A"
              icon={<BadgeCheck className="text-[#00C3C0] " />}
            />
            <TagButton text="Criminal Law" bgColor="#A600161A" />
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-medium mb-1">
            Looking for a divorce law consultation
          </h1>
          <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
            <h1 className="font-medium mb-2">Position Overview</h1>
            <p className="text-sm text-[#34495E] ">
              {` If you're facing a divorce, it's crucial to seek professional
                legal advice. Our consultations cover everything from asset
                division to child custody arrangements, ensuring you understand
                your rights and options. Let us help you navigate this
                challenging time with expert guidance.`}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-medium mb-1">
            Looking for a divorce law consultation
          </h1>
          <div className=" my-3 ">
            <h1 className="font-medium my-2">File Attached</h1>
            <div className="flex items-center justify-between  p-3 rounded-lg bg-[#F8F9FA]">
              <h2 className="flex items-center gap-2">
                <FileText />
                <span>Cases brief.pdf</span>{' '}
              </h2>

              <button className="px-5 py-2 w-full sm:w-auto flex gap-2 items-center justify-center rounded-lg font-medium bg-[#EDF0F4] hover:bg-[#00C3C0] text-[#0B1C2D] transition-all duration-200 ease-in-out">
                <ArrowDownToLine />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewCard;
