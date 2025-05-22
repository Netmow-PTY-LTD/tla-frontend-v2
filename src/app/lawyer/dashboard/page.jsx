'use client';
import React from 'react';
import WelcomeCard from './_component/home/WelcomeCard';
import ProfileCard from './_component/home/ProfileCard';
import LeadSettingsCard from './_component/home/LeadSettingsCard';
import LeadsCountCard from './_component/home/LeadsCountCard';
import GetStartedCard from './_component/home/GetStartedCard';

import { useSelector } from 'react-redux';
import ResponseCard from './_component/home/ResponseCard';
import SendNewLeadsCard from './_component/home/SendNewLeadsCard';

export default function SellerDashboard() {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  console.log('currentUser', currentUser);
  console.log('token', token);
  return (
    <div className=" max-w-[1100px] mx-auto">
      {/* <WelcomeCard /> */}

      <ProfileCard />
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-[200px] h-[200px] rounded-full bg-[#00C3C080] blur-[120px]"></div>
        </div>
        <div className="relative z-10">
          <GetStartedCard />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <LeadSettingsCard />
        <LeadsCountCard />

        <SendNewLeadsCard />
        <ResponseCard />
      </div>
    </div>
  );
}
