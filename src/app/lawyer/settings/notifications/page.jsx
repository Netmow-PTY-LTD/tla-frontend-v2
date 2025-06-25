'use client';
import React, { Suspense } from 'react';
import EmailNotification from './_components/EmailNotification';
import BrowserNotification from './_components/BrowserNotification';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import { Loader } from 'lucide-react';

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
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-sm text-gray-500">
              <Loader /> Loading...
            </span>
          </div>
        }
      >
        <DynamicAccordion items={accordionItems} />
      </Suspense>
    </div>
  );
};

export default Notification;
