'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TextInput from '@/components/form/TextInput';
import FileUploader from '@/components/UIComponents/fileUploader';
import { CloudUpload } from 'lucide-react';
import FormWrapper from '@/components/form/FromWrapper';
import SettingsForm from '../_components/app-settings/page';

export default function Settings() {
  // Separate state for App Logo and Favicon
  const [appLogo, setAppLogo] = useState({ file: null, preview: null });
  const [favicon, setFavicon] = useState({ file: null, preview: null });

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleRemoveFile = (setter) => () => {
    setter({ file: null, preview: null });
  };

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
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
