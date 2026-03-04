'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    useGetAllEmailTemplatesQuery,
    useDeleteEmailTemplateMutation,
} from '@/store/features/admin/emailApiService';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Plus,
    Trash2,
    Edit,
    Eye,
    Layout,
    Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import Link from 'next/link';
import { DataTable } from '@/components/common/DataTable';

export default function EmailTemplateListPage() {
    const [page, setPage] = useState(1);
    const { data: templatesRes, isLoading, refetch } = useGetAllEmailTemplatesQuery({ page, limit: 10 });
    const [deleteEmailTemplate] = useDeleteEmailTemplateMutation();

    const templates = templatesRes?.data || [];

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await deleteEmailTemplate(id).unwrap();
                showSuccessToast('Template deleted successfully.');
                refetch();
            } catch (error) {
                showErrorToast('Failed to delete template.');
            }
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Template Name',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.getValue('title')}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        ID: {row.original._id}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'templateKey',
            header: 'Template Key',
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-mono text-[11px]">
                    {row.getValue('templateKey')}
                </Badge>
            ),
        },
        {
            accessorKey: 'templateType',
            header: 'Entity',
            cell: ({ row }) => (
                <Badge className="bg-cyan-50 text-cyan-700 border-cyan-100 capitalize font-medium">
                    {row.getValue('templateType') || 'Generic'}
                </Badge>
            ),
        },
        {
            accessorKey: 'subject',
            header: 'Email Subject',
            cell: ({ row }) => (
                <div className="max-w-[250px] truncate text-slate-600 italic">
                    {row.getValue('subject')}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Creation Date',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(row.getValue('createdAt')).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const template = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">Actions</DropdownMenuLabel>

                            <DropdownMenuItem asChild>
                                <Link href={`/admin/email/template/edit/${template._id}`} className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#00c3c0]/5 focus:text-[#00c3c0]">
                                    <div className="w-8 h-8 rounded-lg bg-[#00c3c0]/10 flex items-center justify-center text-[#00c3c0]">
                                        <Edit className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Update Template</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg focus:bg-cyan-50 focus:text-cyan-700">
                                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                                    <Eye className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Quick Preview</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-100 my-1" />

                            <DropdownMenuItem
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-red-50 focus:text-red-700 text-red-600"
                                onClick={() => handleDelete(template._id)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Remove Template</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="p-4 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Email <span className="text-[#ff8602]">Templates</span></h1>
                        <p className="text-slate-500 mt-1 font-medium italic text-sm">Design and manage reusable structural blueprints for campaign delivery.</p>
                    </div>
                    <Button asChild className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white shadow-md shadow-[#00c3c0]/20 px-4 py-2.5 rounded-xl h-auto border-none transition-all hover:scale-[1.02]">
                        <Link href="/admin/email/template/add" className="flex items-center gap-2">
                            <Plus className="w-4 h-4 font-bold" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">New Template Design</span>
                        </Link>
                    </Button>
                </div>

                <div className="rounded-3xl overflow-hidden bg-white">
                    <DataTable
                        columns={columns}
                        data={templates}
                        isFetching={isLoading}
                        searchColumn="title"
                    />
                </div>
            </div>
        </div>
    );
}