import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect, useMemo, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { DataTable } from '@/components/common/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { useEditOptionMutation } from '@/store/features/admin/optionApiService';

export function SelectOptionsModal({
  open,
  onOpenChange,
  item,
  option,
  refetch,
  selectedOptions,
  setSelectedOptions,
}) {
  console.log('selected options', option);
  // const [selectedOptions, setSelectedOptions] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [updateOption] = useEditOptionMutation();

  // Initialize selectedOptions and rowSelection when modal opens
  useEffect(() => {
    if (!option?.selected_options || !item?.options) return;

    // Get selected option IDs
    const preselectedIds = new Set(option.selected_options.map((s) => s._id));

    // Match full option objects from item.options
    const preselectedOptions = item?.options?.filter((opt) =>
      preselectedIds.has(opt._id)
    );

    setSelectedOptions(preselectedOptions);

    // Build rowSelection object: { "optionId1": true, "optionId2": true }
    const initialRowSelection = {};
    preselectedOptions.forEach((opt) => {
      initialRowSelection[opt._id] = true;
    });

    setRowSelection(initialRowSelection);
  }, [option, item?.options, open]);

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
            const selected = table
              .getRowModel()
              .rows.map((row) => row.original);

            // Build new rowSelection map
            const selectedMap = {};
            selected.forEach((opt) => {
              selectedMap[opt._id] = true;
            });

            setRowSelection(!!value ? selectedMap : {});
            setSelectedOptions(!!value ? selected : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const option = row.original;
        const isChecked = selectedOptions.some((s) => s._id === option._id);

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => {
              setRowSelection((prev) => {
                const updated = { ...prev };
                if (value) {
                  updated[option._id] = true;
                } else {
                  delete updated[option._id];
                }
                return updated;
              });

              setSelectedOptions((prev) => {
                const exists = prev.find((s) => s._id === option._id);
                if (value && !exists) {
                  return [...prev, option];
                } else if (!value && exists) {
                  return prev.filter((s) => s._id !== option._id);
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
      header: 'Option Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
  ];

  const handleSave = async () => {
    if (!selectedOptions.length) return showErrorToast('Please select options');
    try {
      const response = await updateOption({
        id: option._id,
        selected_options: selectedOptions,
      }).unwrap();

      if (response) {
        showSuccessToast(response?.message || 'Options updated');
        refetch();
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Save failed:', err);
      showErrorToast('Failed to save options');
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
          rowSelection={rowSelection}
          onRowSelectionChange={(updated) => {
            const selectedIds = Object.keys(updated).filter(
              (key) => updated[key]
            );
            const newSelectedOptions = item.options.filter((opt) =>
              selectedIds.includes(opt._id)
            );
            setSelectedOptions(newSelectedOptions);
            setRowSelection(updated);
          }}
        />

        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
