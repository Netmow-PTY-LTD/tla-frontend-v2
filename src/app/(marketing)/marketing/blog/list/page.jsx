'use client';
import React, { useState } from 'react';

import {
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
} from '@/store/features/admin/blogApiService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { truncateText } from '@/helpers/truncateText';
import { DataTableWithPagination } from '@/app/admin/_components/DataTableWithPagination';

export default function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(false);

  const limit = 10;
  const {
    data: blogList,
    refetch: refetchBlogs,
    isFetching,
  } = useGetAllBlogsQuery({
    page,
    limit,
    search,
  });

  const [deleteBlog] = useDeleteBlogMutation();

  const handleDeleteBlog = async (id) => {
    // console.log('Deleting blog with ID:', id);
    try {
      const res = await deleteBlog(id).unwrap();
      // console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Blog deleted successfully');
        refetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      showErrorToast(error?.data?.message || 'Failed to delete blog.');
    }
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
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
      accessorKey: 'shortDescription',
      header: 'Description',
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate"
          dangerouslySetInnerHTML={{
            __html: truncateText(row.getValue('shortDescription'), 1000),
          }}
        ></div>
      ),
    },

    {
      accessorKey: 'bannerImage',
      header: 'Banner Image',
      cell: ({ row }) => {
        const bannerImage = row.original?.bannerImage;
        const imageUrl =
          typeof bannerImage === 'string'
            ? bannerImage
            : bannerImage?.url || null;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={row.getValue('title')}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <span>—</span>
        );
      },
    },
    {
      accessorKey: 'metaTitle',
      header: 'Meta Title',
      cell: ({ row }) => {
        const metaTitle = row.original?.seo?.metaTitle;
        return <div className="max-w-[300px] truncate">{metaTitle || '—'}</div>;
      },
    },
    {
      accessorKey: 'metaDescription',
      header: 'Meta Description',
      cell: ({ row }) => {
        const metaDescription = row.original?.seo?.metaDescription;
        return (
          <div className="max-w-[300px] truncate">{metaDescription || '—'}</div>
        );
      },
    },
    {
      accessorKey: 'metaImage',
      header: 'Meta Image',
      cell: ({ row }) => {
        const metaImage = row.original?.seo?.metaImage;
        const title = row.original?.title || 'Meta Image';

        // handle string or object (e.g. { url: '...' })
        const imageUrl =
          typeof metaImage === 'string' ? metaImage : metaImage?.url || null;

        return imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <span>—</span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="bg-gray-300 text-gray-800 text-xs font-medium px-2 py-1 rounded-full text-center">
          {row.getValue('status')}
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/marketing/blog/edit/${item?.slug}`}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  className="flex gap-2 cursor-pointer"
                  onClick={() => setDeleteId(item?._id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-5">
        <h2 className="text-2xl font-semibold">Blog List</h2>
        <Link href="/marketing/blog/add">
          <Button>Add Blog</Button>
        </Link>
      </div>
      <DataTableWithPagination
        data={blogList?.data || []}
        columns={columns}
        total={blogList?.pagination?.total || 0}
        totalPage={blogList?.pagination?.totalPage || 0}
        page={page || 1}
        limit={limit || 0}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isFetching={isFetching}
      />
      <ConfirmationModal
        open={!!deleteId} // modal opens if idToDelete has a value
        onOpenChange={(open) => {
          if (!open) setDeleteId(null); // close modal resets id
        }}
        onConfirm={() => {
          if (deleteId) handleDeleteBlog(deleteId);
        }}
        title="Are you sure you want to delete this blog?"
        description="This action cannot be undone. Please proceed with caution."
        cancelText="No"
      />
    </div>
  );
}
