'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Power, List, GripVertical } from 'lucide-react';
import AddFaqModal from './_components/AddFaqModal';
import EditFaqModal from './_components/EditFaqModal';
import DraggableFaqList from './_components/DraggableFaqList';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { DataTableWithPagination } from '@/app/admin/_components/DataTableWithPagination';
import {
  useDeleteWebsiteFaqMutation,
  useGetAllWebsiteFaqsQuery,
  useToggleWebsiteFaqStatusMutation,
} from '@/store/features/admin/websiteFaqApiService';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


const FAQ_CATEGORY_LABELS = {
  client: 'Client',
  lawyer: 'Lawyer',
  general: 'General',
};

const WEBSITE_TYPE_LABELS = {
  tla_main: 'TLA Main',
  company: 'Company',
};

export default function WebsiteFaqManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqId, setFaqId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [websiteTypeFilter, setWebsiteTypeFilter] = useState('all');

  const limit = 10;

  const {
    data: faqsData,
    refetch: refetchFaqData,
    isFetching,
  } = useGetAllWebsiteFaqsQuery({
    search,
    page,
    limit,
    websiteType: websiteTypeFilter === 'all' ? undefined : websiteTypeFilter,
  });

  // Fetch all FAQs for drag-and-drop (without pagination)
  const {
    data: allFaqsData,
    refetch: refetchAllFaqsData,
  } = useGetAllWebsiteFaqsQuery({
    page: 1,
    limit: 1000,
    websiteType: websiteTypeFilter === 'all' ? undefined : websiteTypeFilter,
  });

  const handleEditFaqModalOpen = (id) => {
    setIsEditModalOpen(true);
    setFaqId(id);
  };

  const [deleteFaq] = useDeleteWebsiteFaqMutation();
  const handleDeleteFaq = async (id) => {
    try {
      const res = await deleteFaq(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'FAQ deleted successfully');
        refetchFaqData();
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to delete FAQ');
    }
  };

  const [toggleStatus] = useToggleWebsiteFaqStatusMutation();
  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleStatus(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Status updated successfully');
        refetchFaqData();
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('question')}</div>
      ),
    },
    {
      accessorKey: 'answer',
      header: 'Answer',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-md line-clamp-2">
          {row.getValue('answer')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category');
        return (
          <Badge variant="outline" className="capitalize">
            {FAQ_CATEGORY_LABELS[category] || category}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'websiteType',
      header: 'Website',
      cell: ({ row }) => {
        const websiteType = row.getValue('websiteType');
        return (
          <Badge variant="secondary" className="capitalize">
            {WEBSITE_TYPE_LABELS[websiteType] || websiteType}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('order')}</div>
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    handleEditFaqModalOpen(item?._id);
                  }}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleToggleStatus(item?._id)}
                  className="flex gap-2"
                >
                  <Power className="w-4 h-4" />
                  {item?.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => setDeleteModalId(item?._id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
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
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Website FAQs</h2>
          <Tabs value={websiteTypeFilter} onValueChange={(val) => { setWebsiteTypeFilter(val); setPage(1); }} className="w-auto mt-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tla_main">TLA Main</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-end gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="reorder" className="flex items-center gap-2">
                <GripVertical className="w-4 h-4" />
                Drag & Drop Order
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsModalOpen(true)}>Add FAQ</Button>
        </div>
      </div>

      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteFaq(deleteModalId)}
          title="Are you sure you want to delete this FAQ?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
      <AddFaqModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchFaqData={refetchFaqData}
      />
      <EditFaqModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        faqId={faqId}
        refetchFaqData={refetchFaqData}
      />

      {viewMode === 'table' ? (
        <DataTableWithPagination
          columns={columns}
          data={faqsData?.data || []}
          pagination={faqsData?.pagination}
          page={page}
          limit={limit}
          totalPage={faqsData?.pagination?.totalPage}
          total={faqsData?.pagination?.total}
          onPageChange={setPage}
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          isFetching={isFetching}
        />
      ) : (
        <DraggableFaqList
          faqs={allFaqsData?.data || []}
          onReorderSuccess={() => {
            refetchAllFaqsData();
            refetchFaqData();
          }}
        />
      )}
    </>
  );
}
