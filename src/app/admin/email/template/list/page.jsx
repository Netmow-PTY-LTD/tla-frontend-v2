'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    useGetAllEmailTemplatesQuery,
    useDeleteEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useGetAllEmailCategoriesQuery,
} from '@/store/features/admin/emailApiService';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    MoreHorizontal,
    Plus,
    Trash2,
    Edit,
    Eye,
    Layout,
    Clock,
    Monitor,
    Smartphone,
    X,
    GripVertical,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import Link from 'next/link';
import { EmailTemplateSortableTable } from './_components/EmailTemplateSortableTable';
import { useRowSortable } from './_components/EmailTemplateSortableTable';

// Reusable Drag Handle Component for the Column
function DragHandle() {
    const { attributes, listeners } = useRowSortable();
    return (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors">
            <GripVertical className="w-4 h-4" />
        </div>
    );
}

export default function EmailTemplateListPage() {
    const [page, setPage] = useState(1);
    const [categoryId, setCategoryId] = useState('all');

    const { data: categoriesRes } = useGetAllEmailCategoriesQuery({ page: 1, limit: 100 });
    const categories = categoriesRes?.data || [];

    const { data: templatesRes, isLoading, refetch } = useGetAllEmailTemplatesQuery({
        page,
        limit: 10,
        categoryId: categoryId === 'all' ? undefined : categoryId
    });
    const [deleteEmailTemplate] = useDeleteEmailTemplateMutation();
    const [updateEmailTemplate] = useUpdateEmailTemplateMutation();

    // Preview state
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewMode, setPreviewMode] = useState('desktop');

    const templates = useMemo(() => {
        if (!templatesRes?.data) return [];
        return [...templatesRes.data].sort((a, b) => (a.step || 0) - (b.step || 0));
    }, [templatesRes?.data]);

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

    const handleReorder = async (reorderedData) => {
        try {
            // Identify the items that need a step update
            // For simplicity and matching the request, we can update the items whose index changed
            // Or just update the one that was moved.
            // Requirement: "here in payload templateid and step will be sent"

            // Find the moved item by comparing current templates with reordered data
            // However, a better approach for UX is to update all affected items' steps

            for (let i = 0; i < reorderedData.length; i++) {
                const item = reorderedData[i];
                const newStep = i + 1;

                // Only update if the step actually changed relative to its position in the current list
                // If the API is efficient, this is fine.
                if (item.step !== newStep) {
                    const payload = {
                        title: item.title,
                        subject: item.subject,
                        categoryId: item.categoryId?._id || item.categoryId,
                        step: newStep,
                        delayTime: item.delayTime, // already in ms from builder
                        body: item.body,
                        isActive: item.isActive ?? true
                    };

                    await updateEmailTemplate({ id: item._id, data: payload }).unwrap();
                }
            }
            showSuccessToast('Templates reordered successfully.');
            refetch();
        } catch (error) {
            showErrorToast('Failed to sync new order.');
            console.error('Reorder error:', error);
        }
    };

    const columns = [
        {
            id: 'order',
            header: 'Order',
            cell: ({ row }) => {
                const index = row.index;
                return (
                    <div className="flex items-center gap-2">
                        <DragHandle />
                        <span className="text-slate-500 font-bold bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                            {index + 1}
                        </span>
                    </div>
                );
            },
        },
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
            accessorKey: 'subject',
            header: 'Email Subject',
            cell: ({ row }) => (
                <div className="max-w-[250px] truncate text-slate-600 italic">
                    {row.getValue('subject')}
                </div>
            ),
        },
        {
            accessorKey: 'categoryId',
            header: 'Category',
            cell: ({ row }) => {
                const categoryId = row.getValue('categoryId');
                return categoryId ? (
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 font-medium">
                        {categoryId?.name || 'Unknown Category'}
                    </Badge>
                ) : (
                    <span className="text-slate-400 text-xs italic">Uncategorized</span>
                );
            },
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
                                <Link href={`/admin/email/builder?id=${template._id}`} className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#00c3c0]/5 focus:text-[#00c3c0] cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-[#00c3c0]/10 flex items-center justify-center text-[#00c3c0]">
                                        <Edit className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Update Template</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-cyan-50 focus:text-cyan-700 cursor-pointer"
                                onClick={() => {
                                    setPreviewTemplate(template);
                                    setShowPreview(true);
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                                    <Eye className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Quick Preview</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-100 my-1" />

                            <DropdownMenuItem
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-red-50 focus:text-red-700 text-red-600 cursor-pointer"
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
        <div className="p-4 bg-[#f8fafc] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-8 pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Email <span className="text-[#00c3c0]">Templates</span></h1>
                        <p className="text-slate-500 mt-1 font-medium italic text-sm">Design and manage reusable structural blueprints for campaign delivery.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger className="w-[250px] h-10 rounded-xl bg-white border-slate-200 shadow-sm">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button asChild className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white shadow-lg shadow-[#00c3c0]/20 px-5 py-2.5 rounded-xl h-auto border-none transition-all hover:scale-[1.02] active:scale-95">
                            <Link href="/admin/email/builder" className="flex items-center gap-2">
                                <Plus className="w-4 h-4 font-bold" />
                                <span className="font-bold uppercase tracking-widest text-[10px]">New Template Design</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 px-6 py-4 border border-slate-100">
                    <EmailTemplateSortableTable
                        columns={columns}
                        data={templates}
                        isFetching={isLoading}
                        searchColumn="title"
                        onReorder={handleReorder}
                    />
                </div>
            </div>

            {/* Quick Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b flex flex-row items-center justify-between shrink-0">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-black text-slate-900">
                                Preview: <span className="text-[#00c3c0]">{previewTemplate?.title}</span>
                            </DialogTitle>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic truncate max-w-[500px]">
                                Subject: {previewTemplate?.subject}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pr-8">
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                <button
                                    onClick={() => setPreviewMode('desktop')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-[#00c3c0] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPreviewMode('mobile')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-[#00c3c0] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 bg-slate-200/50 p-8 overflow-auto flex justify-center items-start transition-all duration-300">
                        <div
                            className="bg-white shadow-2xl transition-all duration-300 overflow-hidden rounded-xl border border-white"
                            style={{
                                width: previewMode === 'mobile' ? '375px' : '100%',
                                maxWidth: previewMode === 'mobile' ? '375px' : '800px',
                                minHeight: '100%'
                            }}
                        >
                            <iframe
                                title="Email Preview"
                                srcDoc={previewTemplate?.body || ''}
                                className="w-full h-full border-none min-h-[700px]"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}