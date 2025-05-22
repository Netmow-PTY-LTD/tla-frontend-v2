'use client';
import React from 'react';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import ServicesList from './_components/MyServices';

const LeadSettingsPage = () => {
  const accordionItems = [
    {
      id: 'my-services',
      title: 'My Services',
      content: <ServicesList />,
    },
  ];
  return (
    <div>
      <DynamicAccordion items={accordionItems} />
    </div>
  );
};

export default LeadSettingsPage;
