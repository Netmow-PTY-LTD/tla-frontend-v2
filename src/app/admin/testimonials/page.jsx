'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import AddTestimonialModal from './_components/AddTestimonialModal';
import EditTestimonialModal from './_components/EditTestimonialModal';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';
import { useDeleteTestimonialMutation, useGetAllTestimonialsQuery } from '@/store/features/testimonials/testimonialsService';

export default function TestimonialManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [testimonialId, setTestimonialId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const limit = 10;



  const {
    data: testimonialsData,
    isLoading: isTestimonialDataLoading,
    refetch: refetchTestimonialData,
    isFetching,
  } = useGetAllTestimonialsQuery(
    {
  
      search,
      page,
      limit,
    },
    
  );


  const handleEditTestimonialModalOpen = (id) => {
    setIsEditModalOpen(true);
    setTestimonialId(id);
  };

  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const handleDeleteTestimonial = async (id) => {
    try {
      const res = await deleteTestimonial(id).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Testimonial deleted successfully');
        refetchTestimonialData();
      }
    } catch (error) {
      console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to delete testimonial');
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('comment')}</div>
      ),
    },
    {
      accessorKey: 'image',
      header: 'Photo',
      cell: ({ row }) => {
        const imageUrl = row.getValue('image');

        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Testimonial"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            N/A
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
                    handleEditTestimonialModalOpen(item?._id);
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
    <>
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-6">List of Testimonials</h2>
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsModalOpen(true)}>Add Testimonial</Button>
        </div>
      </div>

      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteTestimonial(deleteModalId)}
          title="Are you sure you want to delete this testimonial?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
      <AddTestimonialModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchTestimonialData={refetchTestimonialData}
      />
      <EditTestimonialModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        testimonialId={testimonialId}
        refetchTestimonialData={refetchTestimonialData}
      />
      <DataTableWithPagination
        columns={columns}
        data={testimonialsData?.data || []}
        pagination={testimonialsData?.pagination}
        page={page}
        limit={limit}
        totalPage={testimonialsData?.pagination?.totalPage}
        total={testimonialsData?.pagination?.total}
        onPageChange={setPage}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
        isFetching={isFetching}
      />
    </>
  );
}
