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
import { Checkbox } from '@/components/ui/checkbox';
import { useAllcategorysQuery } from '@/store/features/admin/categoryApiService';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const { data: categoryList, isLoading } = useAllcategorysQuery();

  const selectedCategoryData = categoryList?.data?.find(
    (cat) => cat._id === selectedCategory
  );

  const serviceData = selectedCategoryData?.serviceIds || [];

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const selected = table.getRowModel().rows.map((row) => row.original);
            const selectedMap = {};
            selected.forEach((s) => {
              selectedMap[s._id] = true;
            });
            setRowSelection(!!value ? selectedMap : {});
            setSelectedServices(!!value ? selected : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const service = row.original;
        const isChecked = selectedServices.some((s) => s._id === service._id);

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => {
              setRowSelection((prev) => {
                const updated = { ...prev };
                if (value) {
                  updated[service._id] = true;
                } else {
                  delete updated[service._id];
                }
                return updated;
              });

              setSelectedServices((prev) => {
                const exists = prev.find((s) => s._id === service._id);
                if (value && !exists) {
                  return [...prev, service];
                } else if (!value && exists) {
                  return prev.filter((s) => s._id !== service._id);
                }
                return prev;
              });
            }}
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
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
  ];
  const handleCountryWiseServiceChange = (val) => {
    setSelectedCategory(val);
  };

  return (
    <div>
      <h1 className="font-bold text-lg mb-4">Country wise service</h1>

      <div className="flex justify-between mb-4">
        <div className="w-[300px]">
          <Select value={selectedCategory} onValueChange={handleCountryWiseServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryList?.data?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button> */}
      </div>

      {selectedCategory && (
        <DataTable
          data={selectedCategoryData?.serviceIds || []}
          columns={columns}
          searchColumn="name"
          rowSelection={rowSelection}
          onRowSelectionChange={(updated) => {
            setRowSelection(updated);
            const selectedIds = Object.keys(updated).filter((key) => updated[key]);
            const selectedFull = serviceData.filter((s) =>
              selectedIds.includes(s._id)
            );
            setSelectedServices(selectedFull);
          }}
        />
      )}
    </div>
  );
}
