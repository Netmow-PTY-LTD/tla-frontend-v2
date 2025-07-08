'use client';

import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { CircleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function SocialMediaLink({ profile }) {
  const { reset } = useFormContext();

  useEffect(() => {
    if (profile?.socialMedia) {
      reset({
        facebook: profile.socialMedia.facebook ?? '',
        twitter: profile.socialMedia.twitter ?? '',
        website: profile.socialMedia.website ?? '',
      });
    }
  }, [profile?.socialMedia, reset]);

  return (
    <div>
      <h3 className="16px text-black font-semibold heading-lg">Social media</h3>
      <p className="text-[#6e6e6e] mt-[10px]">
        Connect with clients beyond your profile — sharing your law firm’s
        updates and legal content on social media helps build trust and keeps
        clients engaged.
      </p>

      {/* Facebook Field */}
      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="w-2/4">
          <TextInput
            label="Facebook"
            name="facebook"
            placeholder="https://facebook.com/"
            textColor="text-[#6e6e6e]"
          />
        </div>
        <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
          <CircleAlert className="w-4 h-4" />
          <span>Optional</span>
        </div>
      </div>

      {/* Twitter Field */}
      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="w-2/4">
          <TextInput
            label="Twitter"
            name="twitter"
            placeholder="https://twitter.com"
            textColor="text-[#6e6e6e]"
          />
        </div>
        <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
          <CircleAlert className="w-4 h-4" />
          <span>Optional</span>
        </div>
      </div>

      {/* Website Links Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-semibold text-black">Links</h2>
            <p className="text-sm text-[#6e6e6e] mt-2">
              Link to your own website, articles about your business, or any
              other content that will help promote your business.
            </p>
          </div>
          <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
            <CircleAlert className="w-4 h-4" />
            <span>Optional</span>
          </div>
        </div>

        <div className="mt-5">
          <TextareaInput
            label="Describe your company"
            name="website"
            placeholder="Enter one link per line"
            textColor="text-[#6e6e6e]"
          />
        </div>
      </div>
    </div>
  );
}
