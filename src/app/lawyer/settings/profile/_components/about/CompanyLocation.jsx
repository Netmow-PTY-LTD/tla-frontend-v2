'use client';
import TextInput from '@/components/form/TextInput';

import { AlertCircle } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function CompanyLocation() {
  const { watch } = useFormContext();

  const companyLocation = watch('companyLocation');
  const mapQuery = companyLocation?.trim()
    ? encodeURIComponent(companyLocation)
    : 'Australia';

  // const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapQuery}`;

  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&output=embed`
    : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14136.511046512486!2d153.017!3d-27.4698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b915a0ed9f2aa2d%3A0x402a35af3decb90!2sBrisbane%20QLD%2C%20Australia!5e0!3m2!1sen!2sau!4v1716190380000!5m2!1sen!2sau';

  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">Company location</h2>
      <p className="mt-[10px] mb-7">
        Use a specific address to help customers searching for a local business.
      </p>

      <div>
        <div className="flex  justify-between gap-20">
          <div className="w-full">
            <TextInput
              label="What's the business location?"
              name="companyLocation"
              placeholder="Enter the company address"
            />
            {/* Checkbox with label */}
            <div className="flex items-center justify-start space-x-3 pt-4">
              <input
                type="checkbox"
                name="isProfileShow"
                id="isProfileShow"
                className="mt-1 h-4 w-4 text-[#00C3C0]  border-gray-300 rounded focus:ring-[#00C3C0]"
              />
              <label
                htmlFor="isProfileShow"
                className="flex items-center text-sm text-gray-700 space-x-2"
              >
                <span>Don’t show this on my profile</span>
                <AlertCircle className="w-4 h-4 text-gray-500" />
              </label>
            </div>
          </div>

          <div className="aspect-video w-full max-w-3xl border rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
