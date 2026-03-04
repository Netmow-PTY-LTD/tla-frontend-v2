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
    useDeleteEmailMutation,
    useGetAllEmailsQuery,
} from '@/store/features/admin/emailApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function EmailListPage() {
    const { data: emailList, refetch, isFetching } = useGetAllEmailsQuery();
    const [deleteEmail] = useDeleteEmailMutation();

    const handleDeleteEmail = async (id) => {
        if (!window.confirm('Are you sure you want to delete this email template?')) return;
        try {
            const res = await deleteEmail(id).unwrap();
            if (res) {
                showSuccessToast(res?.message || 'Email deleted successfully');
                refetch();
            }
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to delete email.');
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'templateNo',
            header: 'Template No.',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('templateNo')}</div>
            ),
        },
        {
            accessorKey: 'subject',
            header: 'Subject',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('subject')}</div>
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
                const email = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/admin/email/template/edit/${email?._id}`}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteEmail(email?._id)}
                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Email Templates</h2>
                <Button asChild>
                    <Link href="/admin/email/template/add">Add New Email Template</Link>
                </Button>
            </div>
            <DataTable
                data={emailList?.data || []}
                columns={columns}
                searchColumn={'title'}
                isFetching={isFetching}
            />
        </div>
    );
}
