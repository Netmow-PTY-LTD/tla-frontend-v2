import React from 'react';
import CompanyProfile from './about/CompanyProfile';
import PersonalProfile from './about/PersonalProfile';
import CompanyContactDetails from './about/CompanyContactDetails';
import CompanyLocation from './about/CompanyLocation';
import CompanyAbout from './about/CompanyAbout';

export default function About() {
  return (
    <div>
      <div className="flex items-center gap-20  mb-5 ">
        <CompanyProfile />
        <PersonalProfile />
      </div>
      <CompanyContactDetails />
      <CompanyLocation />
      <CompanyAbout />
    </div>
  );
}
