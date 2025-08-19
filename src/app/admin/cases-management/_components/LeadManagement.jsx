'use client';
import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  useGetAllLeadsForAdminQuery,
  useUpdateLeadMutation,
} from '@/store/features/lawyer/LeadsApiService';
import {
  Archive,
  Check,
  MoreHorizontalIcon,
  Pencil,
  Trash2,
  View,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { LeadDataTable } from './LeadDataTable';
import { LeadDetailsModal } from './LeadDetailsModal';

export default function LeadManagement() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // state for selected lead
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); // Search term

  const {
    data: leadList,
    refetch,
    isFetching,
  } = useGetAllLeadsForAdminQuery({ page, limit: 10 });


  const [changeStatus] = useUpdateLeadMutation();

  const handChangeStatus = async (id, status) => {
    try {
      const res = await changeStatus({ data: { status }, id }).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        refetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to status change.');
    }
  };

  const columns = [
    {
      id: 'userProfileId.name',
      accessorKey: 'userProfileId.name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original?.userProfileId?.name || '-'}
        </div>
      ),
    },
    {
      id: 'userProfileId.user?.isVerifiedAccount',
      accessorKey: 'userProfileId.user?.isVerifiedAccount',
      header: 'Email Verified',
      cell: ({ row }) => {
        const isVerifiedAccount = row.original?.userProfileId.user?.isVerifiedAccount
        return (
          <div className="capitalize">
            {isVerifiedAccount ? "Verified Account" : "Not Verified"}
          </div>
        )
      },
    },
    {
      accessorKey: 'userProfileId.phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original?.userProfileId?.phone || '-'}</div>,
    },
    {
      accessorKey: 'userProfileId.address',
      header: 'Address',
      cell: ({ row }) => (
        <div>{row.original?.userProfileId?.address || '-'}</div>
      ),
    },

    {
      accessorKey: 'budgetAmount',
      header: 'Budget',
      cell: ({ row }) => {
        const countryCode = row.original.countryCode || "AUD";
        const budgetAmount = row.getValue("budgetAmount");

        return (
          <div>
            {countryCode} {budgetAmount.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'credit',
      header: 'Credits',
      cell: ({ row }) => <div>{row.getValue('credit')}</div>,
    },
    // {
    //   accessorKey: 'userProfileId.profileType',
    //   header: 'Profile Type',
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.original?.userProfileId?.profileType || '-'}</div>
    //   ),
    // },
    {
      accessorKey: 'serviceId.name',
      header: 'Service',
      cell: ({ row }) => <div>{row.original?.serviceId?.name || '-'}</div>,
    },
    // {
    //   accessorKey: 'additionalDetails',
    //   header: 'Details',
    //   cell: ({ row }) => (
    //     <div className="truncate max-w-[200px]">
    //       {row.getValue('additionalDetails')}
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'isContact',
    //   header: 'Contacted',
    //   cell: ({ row }) => (
    //     <div>{row.getValue('isContact') ? 'Yes' : 'No'}</div>
    //   ),
    // },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: 'leadPriority',
      header: 'Priority',
      cell: ({ row }) => {
        const value = row.getValue('leadPriority');
        const formatted = value
          ? value
            .split('_')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ')
          : '';
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div> {row.getValue('status')}</div>,
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
                onClick={() => handChangeStatus(lead?._id, 'approved')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Approve
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Reject */}
              <DropdownMenuItem
                onClick={() => handChangeStatus(lead?._id, 'rejected')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Reject
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Archive */}
              <DropdownMenuItem
                onClick={() => handChangeStatus(lead?._id, 'archive')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4" /> Archive
                </div>
              </DropdownMenuItem>
              {/* Details Page */}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedLead(lead); // set current lead
                  setOpen(true); // open modal
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <View className="w-4 h-4" /> View
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <LeadDataTable
        data={leadList?.data || []}
        columns={columns}
        searchColumn="userProfileId.name"
        page={page}
        setPage={setPage}
        totalPages={leadList?.pagination?.totalPage || 1}
        isFetching={isFetching}
      />
      {/* <DataTable
        data={leadList?.data || []}
        columns={columns}
        searchColumn={'name'}
        page={page}
        setPage={setPage}
        totalPages={leadList?.pagination?.totalPages || 1}
        isFetching={isFetching}
      /> */}

      <LeadDetailsModal
        data={selectedLead}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
