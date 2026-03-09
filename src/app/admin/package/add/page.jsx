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
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import SelectInput from '@/components/form/SelectInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  const [filterCountry, setFilterCountry] = useState('all');
  const [filterIsActive, setFilterIsActive] = useState('true');

  const { data: countryList } = useGetCountryListQuery();

  const defaultValues = {
    name: '',
    credit: '',
    price: '',
    priceDisplay: '',
    pricePerCredit: '',
    discountPercentage: '',
    isActive: true,
    country: '',
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
          val === '' ||
          (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
        {
          message: 'Discount percentage must be between 0 and 100.',
        }
      ),
    isActive: z.boolean().optional(),
    country: z.string().min(1, { message: 'Country is required.' }),
  });

  const queryParams = {};
  if (filterCountry !== 'all') queryParams.country = filterCountry;
  if (filterIsActive !== 'all') queryParams.isActive = filterIsActive;

  const {
    data: allCreditPackages,
    isLoading: isLoadingCreditPackages,
    refetch: refetchCreditPackages,
    isFetching,
  } = useGetAllCreditPackagesQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

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
      country,
    } = data;

    const payload = {
      name,
      credit: Number(credit),
      price: Number(price),
      priceDisplay: Number(priceDisplay),
      pricePerCredit: Number(pricePerCredit),
      discountPercentage: Number(discountPercentage),
      isActive: isActive ? true : false,
      country: country,
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
      accessorKey: 'discountPercentage',
      header: 'Discount (%)',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('discountPercentage')}</div>
      ),
    },
    {
      id: 'discountedPrice',
      header: 'Discounted Price',
      cell: ({ row }) => {
        const price = Number(row.getValue('price'));
        const discountPercentage = Number(row.getValue('discountPercentage'));
        const credit = Number(row.getValue('credit'));

        if (discountPercentage && discountPercentage > 0) {
          const discountedPrice = price - (price * discountPercentage) / 100;
          const discountedPricePerCredit = discountedPrice / credit;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-green-600">
                {discountedPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {discountedPricePerCredit.toFixed(2)} / credit
              </span>
            </div>
          );
        }
        return <div className="text-slate-400">-</div>;
      },
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <div className="capitalize">{row.original.country?.name || '-'}</div>
      ),
    },
    {
      id: 'currency',
      header: 'Currency',
      cell: ({ row }) => (
        <div className="uppercase font-medium">
          {row.original.country?.currency || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </div>
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
              <SelectInput
                name="country"
                label="Country"
                options={countryList?.data?.map((c) => ({
                  label: c.name,
                  value: c._id,
                }))}
                placeholder="Select Country"
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
            <div className="flex justify-between items-center">
              <CardTitle className="heading">Packages List</CardTitle>
              <div className="flex gap-2">
                <Select
                  value={filterCountry}
                  onValueChange={(val) => setFilterCountry(val)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countryList?.data?.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterIsActive}
                  onValueChange={(val) => setFilterIsActive(val)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
