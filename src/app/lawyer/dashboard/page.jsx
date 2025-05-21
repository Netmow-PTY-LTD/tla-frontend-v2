'use client';
import React from 'react';
import WelcomeCard from './_component/home/WelcomeCard';
import ProfileCard from './_component/home/ProfileCard';
import LeadSettingsCard from './_component/home/LeadSettingsCard';
import LeadsCountCard from './_component/home/LeadsCountCard';
import GetStartedCard from './_component/home/GetStartedCard';
import ResponsesCard from './_component/home/ResponsesCard';
import HelpCard from './_component/home/HelpCard';
import { useSelector } from 'react-redux';

export default function SellerDashboard() {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  console.log('currentUser', currentUser);
  console.log('token', token);
  return (
    <div>
      {/* <WelcomeCard /> */}

      <ProfileCard />
      <GetStartedCard />
      <div className="grid grid-cols-2 gap-5 mt-5">
        <LeadSettingsCard />
        <LeadsCountCard />

        <ResponsesCard />
        <HelpCard />
      </div>
    </div>
  );
}
