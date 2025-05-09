import React from 'react';
import WelcomeCard from './_component/home/WelcomeCard';
import ProfileCard from './_component/home/ProfileCard';
import LeadSettingsCard from './_component/home/LeadSettingsCard';
import LeadsCountCard from './_component/home/LeadsCountCard';
import GetStartedCard from './_component/home/GetStartedCard';
import ResponsesCard from './_component/home/ResponsesCard';
import HelpCard from './_component/home/HelpCard';

export default function SellerDashboard() {
  return (
    <>
      <WelcomeCard />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <ProfileCard />
        <LeadSettingsCard />
        <LeadsCountCard />
        <GetStartedCard />
        <ResponsesCard />
        <HelpCard />
      </div>
    </>
  );
}
