'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const EmailNotifications = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className=" p-2 rounded-lg">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Email notifications</h2>
          <p className="text-gray-500 text-sm">
            Choose what you'd like to be emailed about
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <NotificationOption
          title="Changes to my requests"
          defaultChecked={true}
        />

        <NotificationOption
          title="Reminders to reply to Professionals"
          defaultChecked={false}
        />

        <NotificationOption
          title="Updates about new features on Bark"
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

export default EmailNotifications;
