import React from 'react';
import CompanyProfile from './about/CompanyProfile';
import PersonalProfile from './about/PersonalProfile';
import CompanyContactDetails from './about/CompanyContactDetails';
import CompanyLocation from './about/CompanyLocation';
import CompanyAbout from './about/CompanyAbout';

export default function About() {
  return (
    <div>
      <h2 className="font-bold text-lg">About</h2>
      <div className="flex flex-col gap-3">
        <CompanyProfile />
        <PersonalProfile />
        <CompanyContactDetails />
        <CompanyLocation />
        <CompanyAbout />
      </div>
    </div>
  );
}
