import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import countries from '@/data/countries.json';
import SelectInput from '@/components/form/SelectInput';
import certificationsAndLicenses from '@/data/certificationsAndLicenses';

const licenseSchema = z.object({
  country: z.string({ invalid_type_error: 'Country is required' }),
  certificationName: z
    .string({ invalid_type_error: 'Certification Name is required' })
    .min(1, { message: 'Certification Name is required' }),
  type: z.string({ invalid_type_error: 'Type is required' }),
});

export default function EditLicenseModal({ open, setOpen, licenseId }) {
  const [defaultValues, setDefaultValues] = useState({
    country: '',
    certificationName: '',
    type: '',
  });

  const license = certificationsAndLicenses.find(
    (license) => license._id === licenseId
  );

  useEffect(() => {
    if (license) {
      setDefaultValues({
        country: license.countryId,
        certificationName: license.certificationName,
        type: license.type,
      });
    }
  }, [license]);

  const handleAddLicense = (values) => {
    console.log('values', values);

    const { country, certificationName, type } = values;

    const payload = {
      country,
      certificationName,
      type,
    };

    console.log('payload', payload);
  };
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Add License</h3>
      <FormWrapper
        onSubmit={handleAddLicense}
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
        </div>

        <div className="text-center mt-10">
          <Button type="submit">Add License</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
