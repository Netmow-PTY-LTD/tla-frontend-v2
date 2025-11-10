'use client';
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

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import AddCodeModal from './_components/AddCodeModal';
import EditCodeModal from './_components/EditCodeModal';
import { useDeleteHeaderFooterCodeMutation, useGetHeaderFooterCodesQuery } from '@/store/features/seo/seoApi';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { DataTableWithPagination } from '../../_components/DataTableWithPagination';
import Link from 'next/link';

export default function Page() {
    const [addOpen, setAddOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    // For confirmation modal
    const [isOpen, setIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [search, setSearch] = useState('');

    // Fetch codes with pagination and search
    const { data: codeList, refetch, isFetching } = useGetHeaderFooterCodesQuery({
        page,
        limit,
        search,
    });

    const [deleteCode] = useDeleteHeaderFooterCodeMutation();

    const handleDeleteCode = async () => {
        if (!deleteId) return;

        try {
            const res = await deleteCode(deleteId).unwrap();
            if (res) {
                showSuccessToast(res?.message);
                refetch();
            }
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to delete code.');
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
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('position')}</div>
            ),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <div className="max-w-[300px] truncate font-mono">{row.getValue('code')}</div>
            ),
        },
        {
            accessorKey: 'notes',
            header: 'Notes',
            cell: ({ row }) => (
                <div className="max-w-[300px] truncate font-mono">{row.getValue('notes')}</div>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <div className={`${row.getValue('isActive') ? 'text-green-600' : 'text-red-600'}`}>
                    {row.getValue('isActive') ? 'Active' : 'Inactive'}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const code = row.original;

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
                                {/* <button
                  onClick={() => {
                    setEditId(code?._id);
                    setOpen(true);
                  }}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button> */}

                                <Link href={`/admin/seo/header-footer-code/edit/${code?._id}`}>
                                    <button

                                        className="flex gap-2"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div
                                    className="flex gap-2 cursor-pointer"
                                    onClick={() => {
                                        setDeleteId(code?._id);
                                        setIsOpen(true);
                                    }}
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


    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle search input
    const handleSearch = (value) => {
        setSearch(value);
        setPage(1); // reset to first page on new search
    };

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">Header/Footer Codes</h2>
                {/* <Button onClick={() => setAddOpen(true)}>Add Code</Button> */}
                <Link href={'/admin/seo/header-footer-code/add'}> <Button>Add Code</Button></Link>
            </div>
            <AddCodeModal open={addOpen} onClose={() => setAddOpen(false)} />
            <EditCodeModal
                id={editId}
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditId(null);
                }}
            />

            <DataTableWithPagination
                data={codeList?.data || []}
                columns={columns}
                page={page}
                limit={limit}
                totalPage={codeList?.pagination?.totalPage || 1}
                total={codeList?.pagination?.total || 0}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                isFetching={isFetching}
            />

            <ConfirmationModal
                open={isOpen}
                onOpenChange={setIsOpen}
                onConfirm={handleDeleteCode}
                title="Delete Code"
                description="Are you sure you want to delete this header/footer code? This action cannot be undone."
            />
        </>
    );
}
