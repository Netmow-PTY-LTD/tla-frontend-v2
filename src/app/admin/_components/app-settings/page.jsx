// 'use client';

// import { useForm } from 'react-hook-form';
// import { useEffect } from 'react';
// import {
//   useChangeAppSettingsMutation,
// } from '@/store/features/admin/appSettings';
// import { Button } from '@/components/ui/button';

// const defaultValues = {
//   siteName: '',
//   maintenanceMode: false,
//   emailProviderEnabled: true,
//   smsProviderEnabled: false,
//   allowCreditPurchase: true,
//   requireCreditsToRespond: true,
//   stripeLiveMode: false,
//   responseLimitPerLead: 5,
//   autoRefundIfLeadInactive: true,
//   appLogo: '',
//   favicon: '',
// };


// export default function SettingsForm({ appSettings, isLoading }) {
//   const { register, handleSubmit, reset } = useForm({
//     defaultValues,
//   });


//   const [changeAppSettings] = useChangeAppSettingsMutation();

//   useEffect(() => {
//     if (appSettings?.data) {
//       reset(appSettings.data);
//     }
//   }, [appSettings, reset]);

//   const onSubmit = async (data) => {
//     try {
//       const res = await changeAppSettings(data).unwrap();
//       alert('✅ Settings updated successfully');
//     } catch (err) {
//       console.error(err);
//       alert('❌ Failed to update settings');
//     }
//   };



//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 bg-white p-6 rounded-xl shadow-md  mx-auto "
//     >
//       <h2 className="text-2xl font-semibold mb-4">⚙️ Application Settings</h2>

//       {/* Site Name */}
//       <div>
//         <label className="block font-medium">App Name</label>
//         <input
//           disabled={isLoading}
//           {...register('siteName')}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
//         />
//       </div>

//       {/* Toggle fields */}
//       {[
//         { label: 'Maintenance Mode', key: 'maintenanceMode' },
//         { label: 'Email Provider Enabled', key: 'emailProviderEnabled' },
//         { label: 'SMS Provider Enabled', key: 'smsProviderEnabled' },
//         // { label: 'Allow Credit Purchase', key: 'allowCreditPurchase' },
//         // { label: 'Require Credits to Respond', key: 'requireCreditsToRespond' },
//         { label: 'Stripe Live Mode', key: 'stripeLiveMode' },
//       ].map(({ label, key }) => (
//         <div key={key} className="flex items-center justify-between">
//           <label className="font-medium">{label}</label>
//           <input disabled={isLoading} type="checkbox" {...register(key)} className="w-5 h-5" />
//         </div>
//       ))}

//       {/* Numeric field */}

//       <Button type="submit" className=" text-white px-6 py-2 rounded-md">
//         Save Settings
//       </Button>
//     </form>
//   );
// }








'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  useChangeAppSettingsMutation,
} from '@/store/features/admin/appSettings';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

const defaultValues = {
  siteName: '',
  maintenanceMode: false,
  emailProviderEnabled: true,
  smsProviderEnabled: false,
  allowCreditPurchase: true,
  requireCreditsToRespond: true,
  stripeLiveMode: false,
  responseLimitPerLead: 5,
  autoRefundIfLeadInactive: true,
  appLogo: '',
  favicon: '',
  robots: 'noindex, nofollow',

};

export default function SettingsForm({ appSettings, isLoading }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues,
  });

  const [changeAppSettings] = useChangeAppSettingsMutation();

  // preview states
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  // reset when data loads
  useEffect(() => {
    if (appSettings?.data) {
      reset(appSettings.data);
      setLogoPreview(appSettings.data.appLogo || '');
      setFaviconPreview(appSettings.data.favicon || '');
    }
  }, [appSettings, reset]);

  const onSubmit = async (data) => {

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== 'appLogo' && key !== 'favicon') {
          formData.append(key, data[key]);
        }
      });

      if (data.appLogo?.[0]) formData.append('appLogo', data.appLogo[0]);
      if (data.favicon?.[0]) formData.append('favicon', data.favicon[0]);

      const res = await changeAppSettings(formData).unwrap();
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }

    } catch (err) {
      console.error(err);
      alert('❌ Failed to update settings');
    }
  };

  // watch files
  const appLogoFile = watch('appLogo');
  const faviconFile = watch('favicon');


  useEffect(() => {
    if (appLogoFile?.[0] && appLogoFile[0] instanceof File) {
      const url = URL.createObjectURL(appLogoFile[0]);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [appLogoFile]);

  useEffect(() => {
    if (faviconFile?.[0] && faviconFile[0] instanceof File) {
      const url = URL.createObjectURL(faviconFile[0]);
      setFaviconPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [faviconFile]);

  const handleRemoveImage = (field) => {
    if (field === 'appLogo') {
      setLogoPreview('');
      setValue('appLogo', null);
    } else {
      setFaviconPreview('');
      setValue('favicon', null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 border rounded-lg  mx-auto "
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        ⚙️ Application Settings
      </h2>

      {/* Site Name */}
      <div>
        <label className="block font-medium text-gray-700">App Name</label>
        <input
          disabled={isLoading}
          {...register('siteName')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* App Logo Upload */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Application Logo
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center relative bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() =>
            document.getElementById('appLogoInput')?.click()
          }
        >
          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="App Logo"
                className="h-20 object-contain mx-auto rounded-md border border-gray-200 bg-white p-2"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage('appLogo');
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud size={24} />
              <p className="text-sm mt-1">Click to upload App Logo</p>
            </div>
          )}
        </div>
        <input
          type="file"
          id="appLogoInput"
          accept="image/*"
          {...register('appLogo')}
          className="hidden"
        />
      </div>

      {/* Favicon Upload */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Favicon
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center relative bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() =>
            document.getElementById('faviconInput')?.click()
          }
        >
          {faviconPreview ? (
            <div className="relative inline-block">
              <img
                src={faviconPreview}
                alt="Favicon"
                className="h-10 w-10 object-contain mx-auto rounded-md border border-gray-200 bg-white p-2"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage('favicon');
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud size={20} />
              <p className="text-sm mt-1">Click to upload Favicon</p>
            </div>
          )}
        </div>
        <input
          type="file"
          id="faviconInput"
          accept="image/*"
          {...register('favicon')}
          className="hidden"
        />
      </div>

      {/* Toggles */}
      {[
        { label: 'Maintenance Mode', key: 'maintenanceMode' },
        { label: 'Email Provider Enabled', key: 'emailProviderEnabled' },
        { label: 'SMS Provider Enabled', key: 'smsProviderEnabled' },
        { label: 'Stripe Live Mode', key: 'stripeLiveMode' },
        // { label: 'Allow Credit Purchase', key: 'allowCreditPurchase' },
        // { label: 'Require Credits to Respond', key: 'requireCreditsToRespond' },
      ].map(({ label, key }) => (
        <div
          key={key}
          className="flex items-center justify-between border-b pb-2"
        >
          <label className="font-medium text-gray-700">{label}</label>
          <input
            disabled={isLoading}
            type="checkbox"
            {...register(key)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>
      ))}

      {/* Robots Index Control */}
      <div className="flex items-center justify-between border-b pb-2">
        <label className="font-medium text-gray-700">Search Engine Visibility</label>
        <select
          disabled={isLoading}
          {...register('robots')}
          className="border rounded-md p-1 text-gray-700"
        >
          <option value="index, follow">Index & Follow</option>
          <option value="noindex, follow">No Index, Follow</option>
          <option value="index, nofollow">Index, No Follow</option>
          <option value="noindex, nofollow">No Index & No Follow</option>
        </select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-white font-semibold py-2 rounded-lgtransition"
      >
        Save Settings
      </Button>
    </form>
  );
}
