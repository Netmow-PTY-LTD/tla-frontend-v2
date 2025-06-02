'use client';

import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import ToggleSwitch from '@/components/UIComponents/ToggleSwitch';
import { CircleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function SocialMediaLink({ profile }) {
  //console.log('profile', profile);
  const [hiddenFields, setHiddenFields] = useState({
    facebook: false,
    twitter: false,
    website: false,
  });

  const toggleField = (field) => (checked) => {
    setHiddenFields((prev) => ({ ...prev, [field]: checked }));
  };

  const OptionalToggle = ({ field }) => (
    <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
      <CircleAlert className="w-4 h-4" />
      <span>Optional</span>
      <ToggleSwitch
        enabled={hiddenFields[field]}
        onToggle={toggleField(field)}
      />
    </div>
  );
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
      <h2 className="16px text-black font-semibold">Social media</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        Add your company social media accounts to lend credibility to your
        business - it is often something customers will look for to validate
        their hiring decisions.
      </p>

      {/* Facebook Field */}
      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="w-2/4">
          <TextInput
            label="Facebook"
            name="facebook"
            placeholder="https://facebook.com/"
            inputClassName={hiddenFields.facebook ? 'hidden' : ''}
          />
        </div>
        <OptionalToggle field="facebook" />
      </div>

      {/* Twitter Field */}
      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="w-2/4">
          <TextInput
            label="Twitter"
            name="twitter"
            placeholder="https://twitter.com"
            inputClassName={hiddenFields.twitter ? 'hidden' : ''}
          />
        </div>
        <OptionalToggle field="twitter" />
      </div>

      {/* Website Links Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-semibold text-black">Links</h2>
            <p className="text-sm text-[#8E8E8E] mt-2">
              Link to your own website, articles about your business, or any
              other content that will help promote your business.
            </p>
          </div>
          <OptionalToggle field="website" />
        </div>

        <div className="mt-5">
          <TextareaInput
            label="Describe your company"
            name="website"
            placeholder="Enter one link per line"
            textareaClassName={hiddenFields.website ? 'hidden' : ''}
          />
        </div>
      </div>
    </div>
  );
}
