'use client';
import React from 'react';
import EmailNotification from './_components/EmailNotification';
import BrowserNotification from './_components/BrowserNotification';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';

const Notification = () => {
  const accordionItems = [
    {
      id: 'email-notification',
      title: 'Email Notifications',
      content: <EmailNotification />,
    },
    {
      id: 'browser-notification',
      title: 'Browser Notifications',
      content: <BrowserNotification />,
    },
  ];
  return (
    <div>
      <DynamicAccordion items={accordionItems} />
    </div>
  );
};

export default Notification;
