'use client';
import React from 'react';
// import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import ServicesList from './_components/MyServices';

const LeadSettingsPage = () => {
  // const accordionItems = [
  //   {
  //     id: 'my-services',
  //     title: 'My Services',
  //     content: <ServicesList />,
  //   },
  // ];
  return (
    <div className="w-full">
      <div className="max-w-[900px] mx-auto">
        <ServicesList />
      </div>
      {/* <DynamicAccordion items={accordionItems} /> */}
    </div>
  );
};

export default LeadSettingsPage;
