import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import countries from '@/data/countries.json';
import SelectInput from '@/components/form/SelectInput';
import certificationsAndLicenses from '@/data/certificationsAndLicenses';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import {
  useGetLawFirmCertificationByIdQuery,
  useUpdateLawFirmCertificationMutation,
} from '@/store/features/admin/lawFirmCertificationApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const licenseSchema = z.object({
  country: z.string({ invalid_type_error: 'Country is required' }),
  certificationName: z
    .string({ invalid_type_error: 'Certification Name is required' })
    .min(1, { message: 'Certification Name is required' }),
  type: z.string({ invalid_type_error: 'Type is required' }),
  agencyLogo: z.any().optional(),
});

export default function EditLicenseModal({
  open,
  setOpen,
  licenseId,
  refetchLicenseData,
}) {
  const [defaultValues, setDefaultValues] = useState({
    country: '',
    certificationName: '',
    type: '',
    agencyLogo: null,
  });

  const { data: licenseData } = useGetLawFirmCertificationByIdQuery(licenseId, {
    skip: !licenseId,
  });

  const license = licenseData?.data;

  useEffect(() => {
    if (license) {
      setDefaultValues({
        country: license.countryId,
        certificationName: license.certificationName,
        type: license.type,
        agencyLogo: license.logo || null,
      });
    }
  }, [license]);

  const [updateLicense] = useUpdateLawFirmCertificationMutation();

  const handleUpdateLicense = async (values) => {
    const { country, certificationName, type, agencyLogo } = values;

    const payload = {
      country,
      certificationName,
      type,
    };

    console.log('payload', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (agencyLogo instanceof File) {
      formData.append('logo', agencyLogo);
    }

    try {
      const res = await updateLicense({
        certificationId: licenseId,
        body: formData,
      }).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'License updated successfully');
        refetchLicenseData();
        setOpen(false);
      }
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to update license');
    }
  };
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Edit License</h3>
      <FormWrapper
        onSubmit={handleUpdateLicense}
        defaultValues={defaultValues}
        schema={licenseSchema}
      >
        <div className="grid grid-cols-1 gap-5">
          <SelectInput
            name="country"
            label="Country"
            placeholder="select a country"
            options={countries.map((country) => ({
              value: country.countryId,
              label: country.name,
            }))}
          />
          <TextInput
            name="certificationName"
            label="Name"
            placeholder="license name"
          />
          <SelectInput
            name="type"
            label="Type"
            placeholder="select a type"
            options={[
              { value: 'mandatory', label: 'Mandatory' },
              { value: 'optional', label: 'Optional' },
            ]}
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="agencyLogo" className="label-text">
              Upload Photo
            </label>
            <AvatarUploader name="agencyLogo" />
          </div>
        </div>

        <div className="text-center mt-10">
          <Button type="submit">Update License</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
