'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useAllCategoriesQuery,
  useEditCategoryMutation,
} from '@/store/features/admin/categoryApiService';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { CategoryDataTable } from './_components/CategoryDataTable';
import { Button } from '@/components/ui/button';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Form } from 'react-hook-form';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data: categoryList, isLoading } = useAllCategoriesQuery();
  const { data: servicesList } = useAllServicesQuery();

  const selectedCategoryData = categoryList?.data?.find(
    (cat) => cat._id === selectedCategory
  );

  const serviceData = selectedCategoryData?.serviceIds || [];

  const columns = [
    {
      id: 'select',
      header: ({ table }) => {
        const allSelected = table.getIsAllPageRowsSelected();
        const someSelected = table.getIsSomePageRowsSelected();

        return (
          <Checkbox
            checked={
              allSelected ? true : someSelected ? 'indeterminate' : false
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);

              const selectedRows = table.getRowModel().rows;
              const selectedMap = {};
              const selectedList = [];

              selectedRows.forEach((row) => {
                const service = row.original;
                if (value) {
                  selectedMap[service._id] = true;
                  selectedList.push(service);
                }
              });

              setRowSelection((prev) => {
                const newSelection = { ...prev };
                selectedRows.forEach((row) => {
                  const id = row.original._id;
                  if (value) {
                    newSelection[id] = true;
                  } else {
                    delete newSelection[id];
                  }
                });
                return newSelection;
              });

              setSelectedServices((prev) => {
                if (value) {
                  // Add new selected only if not already in
                  const newServices = selectedList.filter(
                    (s) => !prev.some((p) => p._id === s._id)
                  );
                  return [...prev, ...newServices];
                } else {
                  // Remove deselected
                  const deselectedIds = selectedRows.map((r) => r.original._id);
                  return prev.filter((s) => !deselectedIds.includes(s._id));
                }
              });
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const service = row.original;
        const isChecked = rowSelection[service._id] || false;

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
  const handleCategoryWiseServiceChange = (categoryId) => {
    setSelectedCategory(categoryId);

    console.log('categoryId', categoryId);
  };

  const [updateCategoryWiseService, { isLoading: isUpdating }] =
    useEditCategoryMutation();

  const handleSave = async () => {
    const payload = {
      serviceIds: selectedServices.map((s) => s._id),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    try {
      const res = await updateCategoryWiseService({
        id: selectedCategory,
        data: formData,
      }).unwrap();
      console.log('res', res);
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Category updated successfully');
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to update service.';
      showErrorToast(errorMessage);
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedCategory || !servicesList?.data || !categoryList?.data) return;

    const selectedCat = categoryList.data.find(
      (c) => c._id === selectedCategory
    );
    const selectedIds = (selectedCat?.serviceIds || [])
      .filter(Boolean)
      .map((service) => String(service._id || service));

    const normalizedSelectedIds = selectedIds.map((id) => String(id));

    const allServices = servicesList.data;
    const selectedFullServices = allServices.filter((s) =>
      normalizedSelectedIds.includes(String(s._id))
    );

    const selectionMap = {};
    selectedFullServices.forEach((s) => {
      selectionMap[s._id] = true;
    });

    setSelectedServices(selectedFullServices);
    setRowSelection(selectionMap);
  }, [selectedCategory, servicesList?.data, categoryList?.data]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category wise service</h2>

      <div className="flex justify-between mb-4">
        <div className="w-[300px]">
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryWiseServiceChange}
          >
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
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {selectedCategory && (
        <CategoryDataTable
          // data={selectedCategoryData?.serviceIds || []}
          data={servicesList?.data || []}
          columns={columns}
          searchColumn="name"
          rowSelection={rowSelection}
          onRowSelectionChange={(updated) => {
            setRowSelection(updated);

            // Sync selectedServices as well
            const selectedIds = Object.keys(updated).filter(
              (key) => updated[key]
            );
            const selectedFull = servicesList.data.filter((service) =>
              selectedIds.includes(service._id)
            );
            setSelectedServices(selectedFull);
          }}
        />
      )}
    </div>
  );
}
