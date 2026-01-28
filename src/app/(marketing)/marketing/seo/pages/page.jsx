'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { showSuccessToast } from '@/components/common/toasts';

import { DataTable } from '@/components/common/DataTable';
import {
  useDeleteMetaInfoMutation,
  useGetAllMetaInfoQuery,
} from '@/store/features/admin/SEOMetaApiService';
import AddNewMetaInfoModal from '../_components/AddNewMetaPageModal';
import EditSEOMetaPageModal from '../_components/EditSEOMetaPageModal';
export default function SEOPages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const handleEditPageModalOpen = (id) => {
    setIsEditModalOpen(true);
    setPageId(id);
  };

  const {
    data: metaInfo,
    isLoading: isLoadingMetaInfo,
    refetch: refetchMetaInfo,
    isFetching,
  } = useGetAllMetaInfoQuery();

  console.log('metaInfo', metaInfo);

  const [deleteMetaInfo, { isLoading: isDeleteInfoLoading }] =
    useDeleteMetaInfoMutation();

  const handleDeleteMetaInfo = async (id) => {
    try {
      const res = await deleteMetaInfo(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Page deleted successfully');
        setDeleteModalId(null);
        refetchMetaInfo();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      showErrorToast(error?.data?.message || 'Failed to delete page');
    }
  };

  const columns = [
    {
      accessorKey: 'pageKey',
      header: 'Page Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('pageKey')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('slug')}</div>
      ),
    },
    {
      accessorKey: 'metaTitle',
      header: 'Meta Title',
      cell: ({ row }) => <div className="">{row.getValue('metaTitle')}</div>,
    },
    {
      accessorKey: 'metaDescription',
      header: 'Meta Description',
      cell: ({ row }) => (
        <div className="">{row.getValue('metaDescription')}</div>
      ),
    },
    {
      accessorKey: 'metaKeywords',
      header: 'Meta Keywords',
      cell: ({ row }) => {
        const keywords = row.getValue('metaKeywords');

        // Handle both array and fallback cases
        const keywordList = Array.isArray(keywords) ? keywords.join(', ') : '';

        return (
          <div
            className="whitespace-normal break-words max-w-[250px]" // 👈 forces wrapping
            title={keywordList} // optional: tooltip on hover
          >
            {keywordList || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'metaImage',
      header: 'Meta Image',
      cell: ({ row }) => {
        const imageUrl = row.getValue('metaImage');
        return (
          <div>
            <img
              src={imageUrl}
              alt=""
              className="w-12 object-cover rounded-full"
            />
          </div>
        );
      },
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
                    handleEditPageModalOpen(item?._id);
                  }}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">List of Meta Pages</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Meta Info</Button>
      </div>
      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteMetaInfo(deleteModalId)}
          title="Are you sure you want to delete this item?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}

      <AddNewMetaInfoModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchMetaInfo={refetchMetaInfo}
      />

      <EditSEOMetaPageModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        refetchMetaInfo={refetchMetaInfo}
        pageId={pageId}
      />

      <DataTable
        columns={columns}
        data={metaInfo?.data || []}
        searchColumn="metaTitle"
        isFetching={isFetching}
      />
    </div>
  );
}
