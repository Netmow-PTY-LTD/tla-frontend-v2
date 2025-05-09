'use client';

import { ReusableTable } from '@/components/dashboard/super-admin/ReusableTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { userDummyImage } from '@/data/data';
import {
  useAllServicesQuery,
  useChangeServicesStatusMutation,
  useSingleServicesQuery,
} from '@/store/features/super-admin/servicesApiService';
import { CheckCircle, CircleX, MoreHorizontal, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import LoaderPage from '@/components/common/LoaderPage';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '@/components/dashboard/common/ConfirmationDialog';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

export default function Home() {
  const [serviceData, setServiceData] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const {
    data: allServicesData,
    isLoading: allServicesIsLoading,
    refetch: allServicesRefetch,
  } = useAllServicesQuery();

  const [
    changeServicesStatus,
    {
      data: changeServicesStatusData,
      isLoading: changeServicesStatusIsLoading,
    },
  ] = useChangeServicesStatusMutation();

  const columns = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className="capitalize">
          <Avatar>
            <AvatarImage
              src={row?.original?.image?.url ?? userDummyImage}
              alt="image"
            />
            <AvatarFallback>IMAGE</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: 'serviceName',
      header: 'Service Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('serviceName')}</div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'buttonText',
      header: 'Button Text',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('buttonText')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="text-left font-medium capitalize">
          {row.getValue('status') === 'active' ? (
            <Badge className={'text-green-600 bg-green-100'}>
              {row.getValue('status')}
            </Badge>
          ) : (
            <Badge className={'text-red-600 bg-red-100'}>
              {row.getValue('status')}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const itemData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push(
                    `/dashboard/super-admin/services/edit-service?service_id=${itemData?._id}`
                  );
                }}
              >
                <div className="flex items-center gap-2 text-teal-700 font-medium">
                  <Pencil />
                  Edit
                </div>
              </DropdownMenuItem>
              {itemData?.status === 'active' ? (
                <DropdownMenuItem
                  onClick={() => {
                    setServiceData({ id: itemData?._id, status: 'inactive' });
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2 text-red-400 font-medium">
                    <CircleX />
                    Inactive
                  </div>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setServiceData({ id: itemData?._id, status: 'active' });
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2 text-green-400 font-medium">
                    <CheckCircle />
                    Active
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleConfirmDelete = async (itemData) => {
    console.log('Service Data', itemData);
    try {
      const res = await changeServicesStatus(itemData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Action successful');
        allServicesRefetch();
        setServiceData(null);
        setIsDialogOpen(false);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">List Of Services</h1>
      {allServicesIsLoading ? (
        <LoaderPage />
      ) : (
        <ReusableTable
          columns={columns}
          data={allServicesData?.data || []}
          filterPlaceholder="Filter title..."
          pageSize={10}
          filteredColumn={'title'}
        />
      )}

      {isDialogOpen && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setServiceData({ id: '', status: '' });
            setIsDialogOpen(false);
          }}
          onConfirm={handleConfirmDelete}
          title="Are you absolutely sure?"
          description={`This action will ${serviceData?.status} the service.`}
          confirmText="Confirm"
          cancelText="Cancel"
          itemData={serviceData}
        />
      )}
    </div>
  );
}
