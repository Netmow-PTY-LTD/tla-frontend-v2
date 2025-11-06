'use client';

import React from 'react';

import SettingsForm from '../_components/app-settings/page';
import { useGetSettingsQuery } from '@/store/features/admin/appSettings';

export default function Settings() {
  const { data: appSettings, isLoading } = useGetSettingsQuery();


  return (
    <div className="space-y-4  mx-auto max-w-[900px] ">


      <div className="p-6 space-y-5">

        <h1 className="text-2xl font-bold text-blue-600">{appSettings?.data?.siteName}</h1>


        {appSettings?.data?.requireCreditsToRespond && (
          <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
            💡 Credits are required to respond to leads.
          </div>
        )}


        <button
          className={`px-4 py-2 rounded-lg ${appSettings?.data?.allowCreditPurchase
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          disabled={!appSettings?.data?.allowCreditPurchase}
        >
          {appSettings?.data?.allowCreditPurchase ? "Buy Credits" : "Credit Purchase Disabled"}
        </button>


        {appSettings?.data?.autoRefundIfLeadInactive && (
          <p className="text-green-700">✅ Automatic refunds for inactive leads are enabled</p>
        )}

        <div className="flex gap-4">
          <span
            className={`px-3 py-1 rounded ${appSettings?.data?.emailProviderEnabled ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
          >
            Email Notifications {appSettings?.data?.emailProviderEnabled ? "Enabled" : "Disabled"}
          </span>

          <span
            className={`px-3 py-1 rounded ${appSettings?.data?.smsProviderEnabled ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
          >
            SMS Notifications {appSettings?.data?.smsProviderEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>


        <p>
          <strong>Stripe Mode:</strong>{" "}
          <span
            className={`${appSettings?.data?.stripeLiveMode ? "text-green-600" : "text-yellow-600"
              } font-semibold`}
          >
            {appSettings?.data?.stripeLiveMode ? "Live Mode" : "Test Mode"}
          </span>
        </p>

        <p className="text-gray-700">
          📌 Maximum Responses Per Lead:{" "}
          <span className="font-bold">{appSettings?.data?.responseLimitPerLead}</span>
        </p>
      </div>
      <div>
        <SettingsForm appSettings={appSettings} isLoading={isLoading} />
      </div>
    </div>
  );
}
