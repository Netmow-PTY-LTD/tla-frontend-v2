'use client';

import { DataTable } from '@/components/common/DataTable';
import React, { useEffect, useState } from 'react';
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
  useAllServicesQuery,
  useEditCountryWiseServiceMutation,
  useGetAllCountryWiseServicesQuery,
  useGetCountryWiseServicesQuery,
} from '@/store/features/admin/servicesApiService';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

export default function Page() {
  // State variables
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  //fetched api data
  const { data: countryList } = useGetCountryListQuery();
  const { data: servicesList } = useAllServicesQuery();
  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

  //Api call for countrywise services
  const [editCountrywiseServices, { isLoading }] =
    useEditCountryWiseServiceMutation();

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
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

  //countrywise service change handler
  const handleCountryWiseServiceChange = (val) => {

    setSelectedCountry(val);
  };

  //final data save handler
  const handleSave = async () => {
    const selectedServiceIds = selectedServices.map((service) => service._id);

    if (!selectedCountry || selectedServiceIds.length === 0) {
      alert('Please select a country and at least one service.');
      return;
    }

    try {
      await editCountrywiseServices({
        countryId: selectedCountry,
        serviceIds: selectedServiceIds,
      }).unwrap();

      showSuccessToast('Services added successfully.');
      setSelectedServices([]); // optional: reset
    } catch (err) {
      console.error('Error adding services:', err);
      showErrorToast('Failed to add services.');
    }
  };

  // Effect to set Australia as default country
  useEffect(() => {
    if (countryList?.data && !selectedCountry) {
      const australia = countryList.data.find(
        (c) => c.name.toLowerCase() === 'australia'
      );
      if (australia) {
        setSelectedCountry(australia._id);
      }
    }
  }, [countryList, selectedCountry]);

  useEffect(() => {
    if (!servicesList?.data || !countrywiseServices?.data) return;

    // Get IDs of services already added to the country
    const preselectedIds = new Set(
      countrywiseServices?.data?.map((s) => s._id)
    );

    // Update selectedServices with matched full service objects
    const preselectedServices = servicesList?.data?.filter((service) =>
      preselectedIds.has(service._id)
    );

    setSelectedServices(preselectedServices);

    // Build rowSelection object: { "serviceId1": true, "serviceId2": true }
    const preselectedRowSelection = {};
    preselectedServices.forEach((service) => {
      preselectedRowSelection[service._id] = true;
    });
    setRowSelection(preselectedRowSelection);
  }, [servicesList, countrywiseServices]);

  // Sync selectedServices based on rowSelection object
  useEffect(() => {
    if (!servicesList?.data) return;

    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const selectedFull = servicesList.data.filter((service) =>
      selectedIds.includes(service._id)
    );
    setSelectedServices(selectedFull);
  }, [rowSelection, servicesList?.data]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl">Country wise Service</h2>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
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
      </div>
      {selectedCountry && (
        <DataTable
          key={selectedCountry}
          data={servicesList?.data || []}
          columns={columns}
          searchColumn={'name'}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      )}
    </>
  );
}
