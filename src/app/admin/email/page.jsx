'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    useGetAllEmailsQuery,
    useDeleteEmailMutation,
    useSendCampaignNowMutation,
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
    Send, 
    History, 
    BarChart3, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    RotateCw,
    Repeat,
    ArrowUpRight,
    Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CampaignStatsModal from './_components/CampaignStatsModal';
import { Progress } from "@/components/ui/progress";
import { DataTable } from '@/components/common/DataTable';

export default function EmailListPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data: emailsRes, isLoading, refetch } = useGetAllEmailsQuery({ page, limit: 10 });
    const [deleteEmail] = useDeleteEmailMutation();
    const [sendCampaignNow] = useSendCampaignNowMutation();
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const emails = emailsRes?.data || [];
    const totalCount = emailsRes?.totalCount || 0;

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await deleteEmail(id).unwrap();
                showSuccessToast('Campaign deleted successfully.');
                refetch();
            } catch (error) {
                showErrorToast('Failed to delete campaign.');
            }
        }
    };

    const handleSendNow = async (id) => {
        try {
            await sendCampaignNow(id).unwrap();
            showSuccessToast('Campaign dispatch triggered successfully.');
            refetch();
        } catch (error) {
            showErrorToast('Failed to trigger send.');
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Campaign Name',
            cell: ({ row }) => {
                const campaign = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{campaign.title}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            {campaign.isDrip && (
                                <Badge variant="secondary" className="text-[10px] h-4 bg-[#ff8602]/10 text-[#ff8602] border-[#ff8602]/20 uppercase tracking-tighter font-black">
                                    <Zap className="w-2.5 h-2.5 mr-1 fill-[#ff8602]" /> Drip AI
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] h-4 text-slate-500 border-slate-200 uppercase tracking-tighter">
                                {campaign.targetAudience?.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Current Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const variants = {
                    pending: "bg-slate-100 text-slate-600 border-slate-200",
                    sending: "bg-cyan-50 text-[#00c3c0] border-cyan-100 animate-pulse",
                    sent: "bg-green-100 text-green-700 border-green-200",
                    canceled: "bg-red-100 text-red-600 border-red-200",
                    failed: "bg-red-100 text-red-600 border-red-200",
                    draft: "bg-slate-50 text-slate-400 border-slate-200",
                };
                return (
                    <Badge className={`${variants[status] || "bg-slate-100"} capitalize shadow-none border font-medium`}>
                        {status === 'sending' && <RotateCw className="w-3 h-3 mr-1.5 animate-spin" />}
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'delivery',
            header: 'Performance Output',
            cell: ({ row }) => {
                const campaign = row.original;
                const rate = campaign.totalTargeted > 0 
                    ? Math.round((campaign.sentCount / campaign.totalTargeted) * 100) 
                    : 0;
                
                return (
                    <div className="w-[160px] space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-[#00c3c0]">{campaign.sentCount} / <span className="text-slate-400">{campaign.totalTargeted}</span></span>
                            <span className="text-slate-500 font-medium">{rate}% success</span>
                        </div>
                        <Progress value={rate} className="h-1.5 bg-slate-100" />
                    </div>
                );
            },
        },
        {
            accessorKey: 'scheduleType',
            header: 'Schedule Delivery',
            cell: ({ row }) => {
                const campaign = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium lowercase">
                            {campaign.scheduleType === 'recurring' ? (
                                <><Repeat className="w-3 h-3 text-[#00c3c0]" /> {campaign.cronExpression || 'Recurring'}</>
                            ) : campaign.scheduleType === 'scheduled' ? (
                                <><Clock className="w-3 h-3 text-[#00c3c0]" /> {campaign.scheduledAt ? format(new Date(campaign.scheduledAt), 'MMM dd, p') : 'Scheduled'}</>
                            ) : (
                                <><Send className="w-3 h-3 text-[#00c3c0]" /> Immediate Send</>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const campaign = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pb-2">Campaign Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/email/template/edit/${campaign._id}`} className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#00c3c0]/5 focus:text-[#00c3c0] transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-[#ff8602]/10 flex items-center justify-center text-[#ff8602]">
                                        <Edit className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Edit Details</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#00c3c0]/5 focus:text-[#00c3c0] transition-all"
                                onClick={() => {
                                    setSelectedCampaign({ id: campaign._id, title: campaign.title, totalTargeted: campaign.totalTargeted, sentCount: campaign.sentCount, failedCount: campaign.failedCount });
                                    setIsStatsOpen(true);
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-[#00c3c0]">
                                    <BarChart3 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Performance Metrics</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`/admin/email/log/${campaign._id}`} className="flex items-center gap-2 p-2 rounded-lg focus:bg-[#00c3c0]/5 focus:text-[#00c3c0] transition-all text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <History className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Delivery Logs</span>
                                </Link>
                            </DropdownMenuItem>

                            {(campaign.status === 'pending' || campaign.status === 'failed') && (
                                <DropdownMenuItem 
                                    className="flex items-center gap-2 p-2 rounded-lg focus:bg-green-50 focus:text-green-700 transition-all text-green-600"
                                    onClick={() => handleSendNow(campaign._id)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">Force Dispatch Now</span>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            
                            <DropdownMenuItem 
                                className="flex items-center gap-2 p-2 rounded-lg focus:bg-red-50 focus:text-red-700 transition-all text-red-600"
                                onClick={() => handleDelete(campaign._id)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Delete Permanent</span>
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Email <span className="text-[#00c3c0]">Campaigns</span></h1>
                        <p className="text-slate-500 mt-1 font-medium italic">Automate your communication workflow with smart sequences.</p>
                    </div>
                    <Button asChild className="bg-[#ff8602] hover:bg-[#ff8602]/90 text-white shadow-lg shadow-[#ff8602]/20 px-6 py-6 rounded-2xl h-auto border-none">
                        <Link href="/admin/email/template/add" className="flex items-center gap-2">
                            <Plus className="w-5 h-5 font-bold" />
                            <span className="font-extrabold uppercase tracking-widest text-xs">Create New Hub</span>
                        </Link>
                    </Button>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-gradient-to-r from-cyan-50/30 to-white border-b border-slate-50 px-8 py-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#00c3c0]/10 flex items-center justify-center text-[#00c3c0]">
                                <RotateCw className="w-5 h-5" />
                            </div>
                            Live Campaign Monitor
                        </CardTitle>
                        <CardDescription>Track real-time delivery performance and automation health.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={emails}
                            isFetching={isLoading}
                            searchColumn="title"
                        />
                    </CardContent>
                </Card>
            </div>

            <CampaignStatsModal 
                campaign={selectedCampaign} 
                isOpen={isStatsOpen} 
                onOpenChange={setIsStatsOpen} 
            />
        </div>
    );
}
