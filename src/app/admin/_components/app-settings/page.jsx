
'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  useChangeAppSettingsMutation,
  useGetSettingsQuery,
} from '@/store/features/admin/appSettings';

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
};

export default function SettingsForm() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  const { data: appSettings, isLoading } = useGetSettingsQuery();
  const [changeAppSettings] = useChangeAppSettingsMutation();

  useEffect(() => {
    if (appSettings?.data) {
      reset(appSettings.data);
    }
  }, [appSettings, reset]);

  const onSubmit = async (data) => {
    try {
   const res=   await changeAppSettings(data).unwrap();
      alert('✅ Settings updated successfully');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update settings');
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading settings...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md  mx-auto mt-10"
    >
      <h2 className="text-2xl font-semibold mb-4">⚙️ Application Settings</h2>

      {/* Site Name */}
      <div>
        <label className="block font-medium">Site Name</label>
        <input
          {...register('siteName')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
        />
      </div>

      {/* Toggle fields */}
      {[
        { label: 'Maintenance Mode', key: 'maintenanceMode' },
        { label: 'Email Provider Enabled', key: 'emailProviderEnabled' },
        { label: 'SMS Provider Enabled', key: 'smsProviderEnabled' },
        { label: 'Allow Credit Purchase', key: 'allowCreditPurchase' },
        { label: 'Require Credits to Respond', key: 'requireCreditsToRespond' },
        { label: 'Stripe Live Mode', key: 'stripeLiveMode' },
        { label: 'Auto Refund If Lead Inactive', key: 'autoRefundIfLeadInactive' },
      ].map(({ label, key }) => (
        <div key={key} className="flex items-center justify-between">
          <label className="font-medium">{label}</label>
          <input type="checkbox" {...register(key)} className="w-5 h-5" />
        </div>
      ))}

      {/* Numeric field */}
      <div>
        <label className="block font-medium">Response Limit Per Lead</label>
        <input
          type="number"
          {...register('responseLimitPerLead', { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
        />
      </div>

      <button
        type="submit"
        className="hover:bg-[#0eb6b4] text-white px-6 py-2 rounded-md bg-[#3cfcf8]"
      >
        Save Settings
      </button>
    </form>
  );
}
