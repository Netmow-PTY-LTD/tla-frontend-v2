'use client';
import React from 'react';

import ServicesList from './_components/MyServices';

const LeadSettingsPage = () => {
  return (
    <div className="w-full">
      <div className="max-w-[900px] mx-auto">
        <ServicesList />
      </div>
    </div>
  );
};

export default LeadSettingsPage;
