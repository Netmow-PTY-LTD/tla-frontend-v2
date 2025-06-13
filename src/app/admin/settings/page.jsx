'use client';

import FormWrapper from '@/components/form/FromWrapper';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import FileUploader from '@/components/UIComponents/fileUploader';
import { CloudUpload } from 'lucide-react';
import React, { useState } from 'react';

export default function Settings() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="flex flex-wrap gap-5 justify-between">
        <div className="w-full lg:w-[calc(50%-10px)]">
          <Card>
            <CardHeader className="font-semibold heading-lg">App</CardHeader>
            <CardContent>
              <FormWrapper>
                <div className="space-y-4">
                  <TextInput
                    label="App Name"
                    type="text"
                    name="name"
                    placeholder="App name"
                  />
                  <div>
                    <label
                      htmlFor="attachment"
                      className="text-[var(--color-black)] font-medium block mb-2"
                    >
                      App Logo
                    </label>
                    {previewUrl && (
                      <div className="relative inline-block mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-[80px] rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl(null);
                              setSelectedFile(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    <FileUploader
                      label="Upload File"
                      name="app_logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple={false}
                      icon={
                        <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
                      }
                      width="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="attachment"
                      className="text-[var(--color-black)] font-medium block mb-2"
                    >
                      Favicon
                    </label>
                    {previewUrl && (
                      <div className="relative inline-block mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-[80px] rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl(null);
                              setSelectedFile(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    <FileUploader
                      label="Upload File"
                      name="favicon"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple={false}
                      icon={
                        <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
                      }
                      width="w-full"
                    />
                  </div>
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-[calc(50%-10px)]">
          <Card>
            <CardHeader className="font-semibold heading-lg">
              Language
            </CardHeader>
            <CardContent>
              <FormWrapper>
                <div className="space-y-4">
                  <TextInput
                    label="Default Language"
                    type="text"
                    name="name"
                    placeholder="i.e. en"
                  />
                  <SelectInput
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                      { label: 'German', value: 'de' },
                    ]}
                    label="Supported Languages"
                    name="supported_languages"
                  />
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-[calc(50%-10px)]">
          <Card>
            <CardHeader className="font-semibold heading-lg">
              Currency
            </CardHeader>
            <CardContent>
              <FormWrapper>
                <div className="space-y-4">
                  <SelectInput
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                      { label: 'German', value: 'de' },
                    ]}
                    label="Currency"
                    name="currency"
                  />
                  <SelectInput
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                      { label: 'German', value: 'de' },
                    ]}
                    label="Currency Symbol"
                    name="currency_symbol"
                  />
                  <SelectInput
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Spanish', value: 'es' },
                      { label: 'French', value: 'fr' },
                      { label: 'German', value: 'de' },
                    ]}
                    label="Timezone"
                    name="timezone"
                  />
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-[calc(50%-10px)]">
          <Card>
            <CardHeader className="font-semibold heading-lg">
              Contact
            </CardHeader>
            <CardContent>
              <FormWrapper>
                <div className="space-y-4">
                  <TextInput
                    label="Contact Email"
                    type="email"
                    name="contact_email"
                    placeholder="i.e. support@example.com"
                  />
                  <TextInput
                    label="Contact Phone"
                    type="tel"
                    name="contact_phone"
                    placeholder="i.e. +1-800-123-4567"
                  />
                  <TextInput
                    label="Address"
                    type="text"
                    name="address"
                    placeholder="i.e. 1234 App Street, Silicon Valley, CA"
                  />
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
