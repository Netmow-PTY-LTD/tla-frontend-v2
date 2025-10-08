'use client';
import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import CheckboxInput from '@/components/form/CheckboxInput';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useAddCreditPackageMutation,
  useGetAllCreditPackagesQuery,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { z } from 'zod';
import EditCreditPackageModal from '../_components/EditCreditPackageModal';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const handleModalOpen = (item) => {
    setModalOpen(true);
    setSelectedPackage(item);
  };

  const defaultValues = {
    name: '',
    creditAmount: '',
    price: '',
    priceDisplay: '',
    pricePerCredit: '',
    discountPercentage: '',
    isActive: false,
  };

  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Package name must be at least 2 characters.',
    }),
    credit: z
      .string()
      .min(1, { message: 'Credit is required.' })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Credit must be a non-negative number.',
      }),
    price: z
      .string()
      .min(1, { message: 'Package Price is required.' })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Package Price must be a non-negative number.',
      }),
    priceDisplay: z.string().min(1, {
      message: 'Price display is required.',
    }),
    pricePerCredit: z
      .string()
      .min(1, { message: 'Price per credit is required.' })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Price per credit must be a non-negative number.',
      }),
    discountPercentage: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
        {
          message: 'Discount percentage must be between 0 and 100.',
        }
      ),
    isActive: z.boolean().optional(),
  });

  const {
    data: allCreditPackages,
    isLoading: isLoadingCreditPackages,
    refetch: refetchCreditPackages,
    isFetching,
  } = useGetAllCreditPackagesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const formRef = useRef();

  const [addCreditPackage, { isLoading }] = useAddCreditPackageMutation();

  const handleSubmit = async (data) => {
    const {
      name,
      credit,
      price,
      priceDisplay,
      pricePerCredit,
      discountPercentage,
      isActive,
    } = data;

    const payload = {
      name,
      credit: Number(credit),
      price: Number(price),
      priceDisplay: Number(priceDisplay),
      pricePerCredit: Number(pricePerCredit),
      discountPercentage: discountPercentage
        ? Number(discountPercentage)
        : null,
      isActive: isActive ? true : false,
    };

    try {
      const res = await addCreditPackage(payload).unwrap();
      // Optionally reset form or show success toast
      if (res) {
        showSuccessToast(res?.message || 'Package added successfully!');
        refetchCreditPackages();
        formRef.current?.reset();
      }
    } catch (error) {
      console.error('Error adding package:', error);
      // Optionally show error toast
      showErrorToast(error?.data?.message || 'Failed to add package.');
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Package Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('credit')}</div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('price')}</div>
      ),
    },
    {
      accessorKey: 'pricePerCredit',
      header: 'Price Per Credit',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('pricePerCredit')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer px-2"
                onClick={() => handleModalOpen(item)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/3 lg:pr-3">
        <Card>
          <CardHeader>
            <CardTitle className="heading">Add Package</CardTitle>
          </CardHeader>
          <CardContent>
            <FormWrapper
              formRef={formRef}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              schema={formSchema}
            >
              <TextInput
                type="text"
                label="Package Name"
                name="name"
                placeholder="Enter Package Name"
              />
              <TextInput
                type="number"
                label="Credit"
                name="credit"
                placeholder="Enter credit amount"
              />

              <TextInput
                type="number"
                label="Package Price"
                name="price"
                placeholder="Enter Package Name"
              />

              <TextInput
                type="number"
                label="Price Display"
                name="priceDisplay"
                placeholder="Enter price display"
              />

              <TextInput
                type="number"
                label="Price Per Credit"
                name="pricePerCredit"
                placeholder="Enter price per credit"
              />

              <TextInput
                label="Discount Percentage"
                name="discountPercentage"
                placeholder="Enter discount percentage"
              />
              <CheckboxInput label="Active" name="isActive" />
              <Button type="submit">Save</Button>
            </FormWrapper>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-2/3 lg:pl-3">
        <Card>
          <CardHeader>
            <CardTitle className="heading">Packages List</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={allCreditPackages?.data || []}
              columns={columns}
              searchColumn="name"
              isFetching={isFetching}
            />
          </CardContent>
          <EditCreditPackageModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            selectedPackage={selectedPackage}
            schema={formSchema}
            refetchCreditPackages={refetchCreditPackages}
          />
        </Card>
      </div>
    </div>
  );
}
