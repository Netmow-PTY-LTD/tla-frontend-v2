


'use client';
import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteServiceMutation,
  useAllServicesQuery,
} from '@/store/features/admin/servicesApiService';
import { useGetAllLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { Archive, Check, MoreHorizontal, MoreHorizontalIcon, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';


export default function LeadManagement() {
  const [page, setPage] = useState(1)

  const { data: leadList, refetch } = useGetAllLeadsQuery({ page, limit: 10, searchKeyword: {} });
  // const [changeStatus] = useLeadStatusChangeMutation();

 

  const handChangeStatus = async (id) => {
    try {
      // const res = await changeStatus(id).unwrap();
      // if (res) {
      //   showSuccessToast(res?.message);
      //   refetch();
      // }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to status change.');
    }
  };

  const columns = [
    {
      accessorKey: 'userProfileId.name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.original?.userProfileId?.name || '-'}</div>
      ),
    },
    {
      accessorKey: 'userProfileId.phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original?.userProfileId?.phone || '-'}</div>,
    },
    {
      accessorKey: 'userProfileId.address',
      header: 'Address',
      cell: ({ row }) => <div>{row.original?.userProfileId?.address || '-'}</div>,
    },

    {
      accessorKey: 'budgetAmount',
      header: 'Budget',
      cell: ({ row }) => <div>${row.getValue('budgetAmount')}</div>,
    },
    {
      accessorKey: 'credit',
      header: 'Credits',
      cell: ({ row }) => <div>{row.getValue('credit')}</div>,
    },
    {
      accessorKey: 'userProfileId.profileType',
      header: 'Profile Type',
      cell: ({ row }) => (
        <div className="capitalize">{row.original?.userProfileId?.profileType || '-'}</div>
      ),
    },
    {
      accessorKey: 'serviceId.name',
      header: 'Service',
      cell: ({ row }) => (
        <div>{row.original?.serviceId?.name || '-'}</div>
      ),
    },
    {
      accessorKey: 'additionalDetails',
      header: 'Details',
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]">
          {row.getValue('additionalDetails')}
        </div>
      ),
    },
    {
      accessorKey: 'isContact',
      header: 'Contacted',
      cell: ({ row }) => (
        <div>{row.getValue('isContact') ? 'Yes' : 'No'}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Approve */}
              <DropdownMenuItem
                onClick={() => handChangeStatus(lead?._id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Approve
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Reject */}
              <DropdownMenuItem
                onClick={() => handChangeStatus(lead?._id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Reject
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Archive */}
              <DropdownMenuItem
                onClick={() => handChangeStatus(lead?._id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4" /> Archive
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];


  return (
    <>

      <DataTable
        data={leadList?.data || []}
        columns={columns}
        searchColumn={'name'}
      />


    </>
  );
}
