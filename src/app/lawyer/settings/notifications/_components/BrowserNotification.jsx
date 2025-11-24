'use client';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { browserNotificationOptions } from '@/data/notifications';
import {
  useGetAllNotificationsPreferencesQuery,
  useUpdateBrowserNotificationMutation,
} from '@/store/features/notification/notificationApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const BrowserNotification = () => {
  const [browserNotificationToggles, setBrowserNotificationToggles] = useState(
    () => {
      const initial = {};
      browserNotificationOptions.forEach(({ key }) => {
        initial[key] = false;
      });
      return initial;
    }
  );

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
    refetch: refetchNotifications,
  } = useGetAllNotificationsPreferencesQuery();

  const [updateBrowserNotification] = useUpdateBrowserNotificationMutation();

  const handleToggle = (key) => {
    setBrowserNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (notifications?.data?.browserPreferences) {
      setBrowserNotificationToggles(notifications?.data?.browserPreferences);
    }
  }, [notifications]);

  const handleSave = async () => {
    const updatedNotifications = {
      ...browserNotificationToggles,
    };

    try {
      const res = await updateBrowserNotification(
        updatedNotifications
      ).unwrap();
      if (res?.success === true) {
        showSuccessToast(
          res?.message || 'Browser notifications updated successfully'
        );
        refetchNotifications();
      }
      // console.log('Update response:', res);
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error in saving notifications update:', error);
    }
  };

  // const isAnySwitchOn = Object.values(browserNotificationToggles).some(
  //   (value) => value
  // );

  return (
    <div className="max-w-[900px] mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h3 className="font-semibold heading-lg">Browser Notification</h3>
          <p className="text-gray-500 text-sm mt-2">
            Control what you'd like us to email you about. Not getting our
            e-mails? 
            <span className="text-[#00C3C0]">Click Here</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {browserNotificationOptions.map(({ label, key }) => (
          <NotificationOption
            key={key}
            title={label}
            checked={browserNotificationToggles[key]}
            onToggle={() => handleToggle(key)}
          />
        ))}
      </div>
      <>
        <div className="border-t border-white mt-5" />
        <div className="flex justify-end items-center mt-5">
          <button
            onClick={handleSave}
            className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
          >
            Save
          </button>
        </div>
      </>
    </div>
  );
};

const NotificationOption = ({ title, checked = false, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-100">
      <span className="text-gray-700">{title}</span>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
};

export default BrowserNotification;
