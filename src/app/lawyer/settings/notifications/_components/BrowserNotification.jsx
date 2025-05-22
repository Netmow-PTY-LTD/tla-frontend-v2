'use client';
import React from 'react';
import { Switch } from '@/components/ui/switch';

const BrowserNotification = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-lg">Browser Notification</h2>
          <p className="text-gray-500 text-sm">
            Control what you'd like us to email you about. Not getting our
            e-mails? 
            <span className="text-[#00C3C0]">Click Here</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <NotificationOption title="New leads I receive" defaultChecked={true} />

        <NotificationOption
          title="Customers closing leads I've responded to"
          defaultChecked={false}
        />
      </div>
    </div>
  );
};

const NotificationOption = ({ title, defaultChecked = false }) => {
  return (
    <div className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-100">
      <span className="text-gray-700">{title}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
};

export default BrowserNotification;
