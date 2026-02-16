'use client';

import React from 'react';
import SettingsForm from '../_components/app-settings/page';
import { useGetSettingsQuery } from '@/store/features/admin/appSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactInfoSettings from '../_components/app-settings/ContactInfoSettings';

export default function Settings() {
  const { data: appSettings, isLoading } = useGetSettingsQuery();


  return (
    <div className="space-y-4 mx-auto max-w-[900px] pb-10">
      <div className="p-6 space-y-5 bg-white border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">{appSettings?.data?.siteName || 'Settings'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {appSettings?.data?.requireCreditsToRespond && (
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex items-center gap-2">
                <span className="text-xl">💡</span>
                <span>Credits are required to respond to leads.</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Stripe Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${appSettings?.data?.stripeLiveMode
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
              >
                {appSettings?.data?.stripeLiveMode ? "LIVE MODE" : "TEST MODE"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${appSettings?.data?.emailProviderEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                  }`}
              >
                Email: {appSettings?.data?.emailProviderEnabled ? "Active" : "Disabled"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${appSettings?.data?.smsProviderEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                  }`}
              >
                SMS: {appSettings?.data?.smsProviderEnabled ? "Active" : "Disabled"}
              </span>
            </div>

            {appSettings?.data?.autoRefundIfLeadInactive && (
              <div className="text-sm text-green-700 flex items-center gap-1">
                <span>✅</span>
                <span>Auto-refunds enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="app-settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="app-settings" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
            ⚙️ App Settings
          </TabsTrigger>
          <TabsTrigger value="contact-info" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
            📞 Contact Info
          </TabsTrigger>
        </TabsList>
        <TabsContent value="app-settings">
          <SettingsForm appSettings={appSettings} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="contact-info">
          <ContactInfoSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
