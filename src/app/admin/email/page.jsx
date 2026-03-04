'use client';

import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    useSendCampaignNowMutation,
} from '@/store/features/admin/emailApiService';
import { MoreHorizontal, Pencil, Trash2, Send, FileText, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const StatusBadge = ({ status }) => {
    const variants = {
        draft: 'bg-gray-100 text-gray-800 border-gray-200',
        queued: 'bg-blue-100 text-blue-800 border-blue-200',
        sending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        sent: 'bg-green-100 text-green-800 border-green-200',
        failed: 'bg-red-100 text-red-800 border-red-200',
        canceled: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    const icons = {
        draft: <Pencil className="w-3 h-3 mr-1" />,
        queued: <Clock className="w-3 h-3 mr-1" />,
        sending: <Send className="w-3 h-3 mr-1 animate-pulse" />,
        sent: <CheckCircle2 className="w-3 h-3 mr-1" />,
        failed: <AlertCircle className="w-3 h-3 mr-1" />,
        canceled: <XCircle className="w-3 h-3 mr-1" />,
    };

    return (
        <Badge variant="outline" className={`${variants[status] || ''} capitalize flex items-center w-fit`}>
            {icons[status] || null}
            {status}
        </Badge>
    );
};

export default function EmailListPage() {
    const { data: emailList, refetch, isFetching } = useGetAllEmailsQuery();
    const [deleteEmail] = useDeleteEmailMutation();
    const [sendNow, { isLoading: isSendingNow }] = useSendCampaignNowMutation();

    const handleDeleteEmail = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            const res = await deleteEmail(id).unwrap();
            if (res) {
                showSuccessToast(res?.message || 'Campaign deleted successfully');
                refetch();
            }
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to delete campaign.');
        }
    };

    const handleSendNow = async (id) => {
        if (!window.confirm('Are you sure you want to send this campaign now?')) return;
        try {
            const res = await sendNow(id).unwrap();
            showSuccessToast(res?.message || 'Campaign dispatch started.');
            refetch();
        } catch (error) {
            console.error(error);
            showErrorToast(error?.data?.message || 'Failed to send campaign.');
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium max-w-[200px] truncate">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
        },
        {
            accessorKey: 'delivery',
            header: 'Sent / Total',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="text-sm">
                        <span className="font-semibold">{item.sentCount}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span>{item.totalTargeted}</span>
                        {item.totalTargeted > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                                {Math.round((item.sentCount / item.totalTargeted) * 100)}% Delivered
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'scheduleType',
            header: 'Schedule',
            cell: ({ row }) => (
                <div className="capitalize text-sm">{row.getValue('scheduleType')}</div>
            ),
        },
        {
            accessorKey: 'targetAudience',
            header: 'Audience',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('targetAudience')?.replace('_', ' ')}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => (
                <div className="text-sm">{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const campaign = row.original;
                const canSendNow = ['draft', 'queued'].includes(campaign.status);

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
                                    href={`/admin/email/template/edit/${campaign?._id}`}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            {canSendNow && (
                                <DropdownMenuItem
                                    onClick={() => handleSendNow(campaign?._id)}
                                    className="flex items-center gap-2 cursor-pointer text-blue-600 focus:text-blue-600"
                                >
                                    <Send className="w-4 h-4" /> Send Now
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/admin/email/log/${campaign?._id}`}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <FileText className="w-4 h-4" /> View Log
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteEmail(campaign?._id)}
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
                <div>
                    <h2 className="text-2xl font-bold">Email Campaigns</h2>
                    <p className="text-gray-500 text-sm">Create and track automated email outreach</p>
                </div>
                <Button asChild>
                    <Link href="/admin/email/template/add">Add New Campaign</Link>
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
