import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { DataTable } from '@/components/common/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { useEditOptionMutation } from '@/store/features/admin/optionApiService';

export function SelectOptionsModal({ open, onOpenChange, item, optionId }) {
  console.log('selected next question', item);

  const [selectedOptions, setSelectedOptions] = React.useState([]);

  async function onSubmit(values) {
    //console.log('values', values);
    const updatedData = {
      id: item?._id,
      countyId: item?.countryId?._id,
      serviceId: item?.serviceId?._id,
      ...values,
    };
    console.log(updatedData);
    try {
      const result = await updateQuestion(updatedData).unwrap();
      // Optionally reset form or show success toast
      if (result) {
        showSuccessToast(result?.message);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      // Optionally show error toast
      showErrorToast(
        error?.data?.errorSources?.[0]?.message ||
          error?.data?.message ||
          'Failed to add question.'
      );
    }
  }

  const getColumns = (setSelectedOptions) => [
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
            const selected = table
              .getRowModel()
              .rows.map((row) => row.original);

            setSelectedOptions(!!value ? selected : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            const selectedRow = row.original;

            setSelectedOptions((prev) => {
              if (!!value) {
                return [...prev, selectedRow];
              } else {
                return prev.filter((s) => s._id !== selectedRow._id);
              }
            });
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Option Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
  ];

  const columns = getColumns(setSelectedOptions);

  //handling data save

  const [updateOption] = useEditOptionMutation();

  const handleSave = async () => {
    if (!selectedOptions.length) return alert('Please select options');

    try {
      const response = await updateOption({
        id: optionId,
        selected_options: selectedOptions,
      }).unwrap();
      if (response) {
        showSuccessToast(response?.message);
        onOpenChange(false);
      }
      console.log('Submitted:', response);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader className="flex justify-between">
          <DialogTitle>Select Options</DialogTitle>
        </DialogHeader>
        <DataTable
          data={item?.options ?? []}
          columns={columns}
          searchColumn="name"
        />
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
