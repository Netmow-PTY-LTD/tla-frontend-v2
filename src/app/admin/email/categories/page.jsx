'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/common/DataTable';
import { MoreHorizontal, Plus, Edit2, Trash2, List } from 'lucide-react';
import AddEmailCategoryDrawer from './_components/AddEmailCategoryDrawer';
import EditEmailCategoryDrawer from './_components/EditEmailCategoryDrawer';
import {
    useGetAllEmailCategoriesQuery,
    useDeleteEmailCategoryMutation,
} from '@/store/features/admin/emailApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

export default function EmailCategoriesPage() {
    const [page, setPage] = useState(1);
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { data: categoriesRes, isLoading, refetch } = useGetAllEmailCategoriesQuery({ page, limit: 10 });
    const [deleteCategory] = useDeleteEmailCategoryMutation();

    const categories = categoriesRes?.data || [];

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setIsEditDrawerOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                showSuccessToast('Category deleted successfully');
                refetch();
            } catch (error) {
                showErrorToast(error?.data?.message || 'Failed to delete category');
            }
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Category Name',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                        <List className="w-4 h-4 text-slate-400" />
                        {row.getValue('name')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter ml-6">
                        ID: {row.original._id}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <div className="max-w-[300px] truncate text-slate-500 text-xs text-wrap italic">
                    {row.getValue('description') || 'No description provided.'}
                </div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-mono text-[11px]">
                    {row.getValue('slug')}
                </Badge>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('isActive');
                return (
                    <Badge className={isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}>
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created On',
            cell: ({ row }) => (
                <div className="text-xs text-slate-500 font-medium">
                    {new Date(row.getValue('createdAt')).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const category = row.original;
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

                            <DropdownMenuItem
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#ff8602]/10 focus:text-[#ff8602] cursor-pointer"
                                onClick={() => handleEditClick(category)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#ff8602]/10 flex items-center justify-center text-[#ff8602]">
                                    <Edit2 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Edit Category</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-100 my-1" />

                            <DropdownMenuItem
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-red-50 focus:text-red-700 text-red-600 cursor-pointer"
                                onClick={() => handleDeleteClick(category._id)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Delete Category</span>
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Email <span className="text-[#00c3c0]">Categories</span></h1>
                        <p className="text-slate-500 mt-1 font-medium italic text-sm">Organize and manage categorizations for your email templates.</p>
                    </div>
                    <Button
                        onClick={() => setIsAddDrawerOpen(true)}
                        className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white shadow-md shadow-[#00c3c0]/20 px-4 py-2.5 rounded-xl h-auto border-none transition-all hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 font-bold" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">New Category</span>
                        </div>
                    </Button>
                </div>

                <div className="rounded-3xl overflow-hidden bg-white">
                    <DataTable
                        columns={columns}
                        data={categories}
                        isFetching={isLoading}
                        searchColumn="name"
                    />
                </div>
            </div>

            <AddEmailCategoryDrawer
                open={isAddDrawerOpen}
                onOpenChange={setIsAddDrawerOpen}
            />

            <EditEmailCategoryDrawer
                open={isEditDrawerOpen}
                onOpenChange={setIsEditDrawerOpen}
                category={selectedCategory}
            />
        </div>
    );
}