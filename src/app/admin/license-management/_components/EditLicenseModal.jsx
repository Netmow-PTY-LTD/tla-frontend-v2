import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useRef, useState } from 'react';
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

  const formRef = useRef(null);

  // When modal closes, reset form
  useEffect(() => {
    if (open && licenseId) {
      formRef.current?.reset(defaultValues);
    }
  }, [open, licenseId, defaultValues]);

  const { data: licenseData } = useGetLawFirmCertificationByIdQuery(licenseId, {
    skip: !licenseId,
  });

  const license = licenseData?.data;

  // useEffect(() => {
  //   if (license) {
  //     setDefaultValues({
  //       country: license.countryId,
  //       certificationName: license.certificationName,
  //       type: license.type,
  //       agencyLogo: license.logo || null,
  //     });
  //   }
  // }, [license]);

  useEffect(() => {
    if (license) {
      const dv = {
        country: license.countryId ?? '',
        certificationName: license.certificationName ?? '',
        type: license.type ?? '',
        agencyLogo: license.logo ?? null,
      };
      setDefaultValues(dv);

      // If modal is already open, immediately reset the form to the new values
      // (formRef.current.reset refers to the imperative method we exposed in FormWrapper)
      if (open && formRef.current?.reset) {
        formRef.current.reset(dv);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [license, open]);

  useEffect(() => {
    if (open) {
      // if license already loaded, reset to license-derived defaults
      if (license) {
        formRef.current?.reset({
          country: license.countryId ?? '',
          certificationName: license.certificationName ?? '',
          type: license.type ?? '',
          agencyLogo: license.logo ?? null,
        });
      } else {
        // license not loaded yet (still fetching) -> clear or keep previous values as you prefer
        // I recommend clearing to avoid stale UI while fetching:
        formRef.current?.reset({
          country: '',
          certificationName: '',
          type: '',
          agencyLogo: null,
        });
      }
    }
  }, [open, license]);

  const [updateLicense, { isLoading: isUpdateLicenseLoading }] =
    useUpdateLawFirmCertificationMutation();

  const handleUpdateLicense = async (values) => {
    const { country, certificationName, type, agencyLogo } = values;

    const payload = {
      country,
      certificationName,
      type,
    };

    // console.log('payload', payload);

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
      // console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'License updated successfully');
        refetchLicenseData();
        setOpen(false);
      }
      setOpen(false);
    } catch (error) {
      // console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to update license');
    }
  };

  console.log('agencyLogo', defaultValues?.agencyLogo);
  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setDefaultValues({
            country: '',
            certificationName: '',
            type: '',
            agencyLogo: null,
          });
          formRef.current?.reset({
            country: '',
            certificationName: '',
            type: '',
            agencyLogo: null,
          });
        }
      }}
    >
      <h3 className="text-lg font-semibold mb-6">Edit License</h3>
      <FormWrapper
        key={licenseId} // Reset form when licenseId changes
        onSubmit={handleUpdateLicense}
        defaultValues={defaultValues}
        schema={licenseSchema}
        formRef={formRef}
        ref={formRef}
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
            disabled
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
            <AvatarUploader key={licenseId} name="agencyLogo" />
          </div>
        </div>

        <div className="text-center mt-10">
          <Button type="submit" disabled={isUpdateLicenseLoading}>
            {isUpdateLicenseLoading ? 'Updating...' : 'Update License'}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
