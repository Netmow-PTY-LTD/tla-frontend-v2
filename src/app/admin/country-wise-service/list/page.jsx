'use client';

import { DataTable } from '@/components/common/DataTable';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import {
  useAddCountryWiseServiceMutation,
  useAllCountryWiseServicesQuery,
  useAllServicesQuery,
  useGetCountryWiseServicesQuery,
} from '@/store/features/admin/servicesApiService';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function Page() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  const { data: countryList } = useGetCountryListQuery();
  const { data: servicesList } = useAllServicesQuery();
  const { data: countrywiseServiceList, refetch } =
    useAllCountryWiseServicesQuery();
  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

  console.log('Services', servicesList);

  const { data: addCountrywiseServices, isLoading } =
    useAddCountryWiseServiceMutation();

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
  ];

  const handleCountryWiseServiceChange = (val) => {
    console.log('value', val);
    setSelectedCountry(val);
  };
  // Get all serviceIds for selected country
  const selectedCountryServices = countrywiseServices?.data?.find(
    (entry) => entry.countryId === selectedCountry
  );

  console.log('selectedCountryServices', selectedCountryServices);

  // Filter the services
  const filteredServices =
    servicesList?.data?.filter((service) =>
      selectedCountryServices?.serviceIds?.includes(service._id)
    ) || [];

  console.log('selectedServices', selectedServices);
  // const handleSave = async () => {
  //   const selectedServiceIds = selectedServices.map((service) => service._id);

  //   if (!selectedCountry || selectedServiceIds.length === 0) {
  //     alert('Please select a country and at least one service.');
  //     return;
  //   }

  //   try {
  //     await addCountrywiseServices({
  //       countryId: selectedCountry,
  //       serviceIds: selectedServiceIds,
  //     }).unwrap();

  //     alert('Services added successfully.');
  //     setSelectedServices([]); // optional: reset
  //   } catch (err) {
  //     console.error('Error adding services:', err);
  //     alert('Failed to add services.');
  //   }
  // };

  return (
    <div>
      <h1 className="font-bold text-lg mb-4">Country wise service</h1>
      <div className="flex justify-between">
        <div className="w-[300px]">
          <Select
            value={selectedCountry}
            onValueChange={handleCountryWiseServiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countryList?.data?.map((country, i) => {
                return (
                  <SelectItem key={i} value={country?._id}>
                    {country?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
      </div>
      {selectedCountry && (
        <DataTable
          data={servicesList?.data || []}
          columns={columns}
          onSelectedRowsChange={setSelectedServices}
        />
      )}
    </div>
  );
}
