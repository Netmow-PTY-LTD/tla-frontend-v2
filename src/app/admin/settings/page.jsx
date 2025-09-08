'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TextInput from '@/components/form/TextInput';
import FileUploader from '@/components/UIComponents/fileUploader';
import { CloudUpload } from 'lucide-react';
import FormWrapper from '@/components/form/FromWrapper';
import SettingsForm from '../_components/app-settings/page';
import { useGetSettingsQuery } from '@/store/features/admin/appSettings';

export default function Settings() {
  // Separate state for App Logo and Favicon
  const [appLogo, setAppLogo] = useState({ file: null, preview: null });
  const [favicon, setFavicon] = useState({ file: null, preview: null });
  const { data: appSettings, isLoading } = useGetSettingsQuery();
  const handleFileChange = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleRemoveFile = (setter) => () => {
    setter({ file: null, preview: null });
  };

  console.log('appSettings', appSettings)
  const renderFilePreview = (fileState, setter) => {
    if (!fileState.preview) return null;
    return (
      <div className="relative inline-block mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
        <div className="relative inline-block">
          <img
            src={fileState.preview}
            alt="Preview"
            className="max-w-[80px] rounded border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveFile(setter)}
            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">


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
      <div className="flex flex-wrap gap-5 justify-between">
        {/* Left side: App settings */}
        <div className="w-full lg:w-[calc(50%-10px)]">
          <Card>
            <CardHeader className="font-semibold text-lg">App</CardHeader>
            <CardContent>
              <FormWrapper>
                <div className="space-y-4">
                  <TextInput
                    label="App Name"
                    type="text"
                    name="name"
                    placeholder="App name"
                  />

                  {/* App Logo Upload */}
                  <div>
                    <label className="text-black font-medium block mb-2">
                      App Logo
                    </label>
                    {renderFilePreview(appLogo, setAppLogo)}
                    <FileUploader
                      label="Upload App Logo"
                      name="app_logo"
                      onChange={handleFileChange(setAppLogo)}
                      accept="image/*"
                      multiple={false}
                      icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
                      width="w-full"
                    />
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className="text-black font-medium block mb-2">
                      Favicon
                    </label>
                    {renderFilePreview(favicon, setFavicon)}
                    <FileUploader
                      label="Upload Favicon"
                      name="favicon"
                      onChange={handleFileChange(setFavicon)}
                      accept="image/*"
                      multiple={false}
                      icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
                      width="w-full"
                    />
                  </div>
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Other settings */}
        <div className="w-full lg:w-[calc(50%-10px)]">
          <SettingsForm appSettings={appSettings} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
