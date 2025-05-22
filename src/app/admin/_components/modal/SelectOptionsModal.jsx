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
  const [checkedOptions, setCheckedOptions] = React.useState([]);

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      setCheckedOptions(selectedOptions);
    } else {
      setCheckedOptions(selectedOptions);
    }
  }, []);

  const rowSelection = React.useMemo(() => {
    const map = {};
    selectedOptions.forEach((option) => {
      map[option._id] = true;
    });
    return map;
  }, [selectedOptions]);

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
          rowSelection={rowSelection}
          onRowSelectionChange={(updatedSelection) => {
            const selectedRows = Object.keys(updatedSelection)
              .map((id) => item.options.find((opt) => opt._id === id))
              .filter(Boolean);

            setSelectedOptions(selectedRows);
          }}
        />
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
