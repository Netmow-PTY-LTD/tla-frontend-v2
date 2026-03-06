'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCampaignLogQuery, useGetSingleEmailQuery } from '@/store/features/admin/emailApiService';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Mail, Users, AlertCircle, Search } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';

export default function CampaignLogPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: campaignRes } = useGetSingleEmailQuery(id);
    const { data: logRes, isFetching } = useGetCampaignLogQuery({ id, params: { limit: 100 } });

    const campaign = campaignRes?.data;
    const logs = logRes?.data || [];

    const columns = [
        {
            accessorKey: 'recipientEmail',
            header: 'Recipient Email',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    {row.original.recipientEmail}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Delivery Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const isSent = status === 'sent';
                return (
                    <Badge 
                        variant="outline" 
                        className={isSent 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'}
                    >
                        {isSent ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <XCircle className="w-3 h-3 mr-1.5" />}
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'sentAt',
            header: 'Timestamp',
            cell: ({ row }) => (
                <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                    {row.original.sentAt ? new Date(row.original.sentAt).toLocaleString() : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'error',
            header: 'Execution Details',
            cell: ({ row }) => {
                const error = row.original.error;
                return error ? (
                    <div className="flex items-center gap-2 text-[10px] text-red-500 bg-red-50/50 p-2 rounded-xl border border-red-100 max-w-[350px]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate font-bold" title={error}>{error}</span>
                    </div>
                ) : (
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pl-2">Confirmed Handover</span>
                );
            },
        },
    ];

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-slate-50">
                    <div className="flex items-center gap-5">
                        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-2xl border-slate-200 shadow-sm hover:bg-slate-50">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Campaign <span className="text-[#00c3c0]">Logs</span></h2>
                            <p className="text-slate-500 text-sm font-medium italic mt-1">Tracing deliveries for: <span className="text-slate-800 not-italic font-black decoration-[#00c3c0] underline underline-offset-4">{campaign?.title || 'Active Hub'}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isFetching && (
                            <div className="flex items-center gap-2 text-[#00c3c0] font-black text-xs uppercase tracking-widest">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Live Polling...
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-none shadow-sm rounded-3xl bg-slate-50 overflow-hidden">
                        <CardHeader className="pb-2 px-6">
                            <CardDescription className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                <Users className="w-3.5 h-3.5" /> Total Audience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-4xl font-black text-slate-800 tracking-tighter">{campaign?.totalTargeted || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-green-50/50 overflow-hidden border-b-4 border-b-green-500">
                        <CardHeader className="pb-2 px-6">
                            <CardDescription className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-4xl font-black text-green-700 tracking-tighter">{campaign?.sentCount || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-red-50/50 overflow-hidden border-b-4 border-b-red-500">
                        <CardHeader className="pb-2 px-6">
                            <CardDescription className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-[10px]">
                                <XCircle className="w-3.5 h-3.5" /> Failed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-4xl font-black text-red-700 tracking-tighter">{campaign?.failedCount || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-cyan-50/50 overflow-hidden border-b-4 border-b-[#00c3c0]">
                        <CardHeader className="pb-2 px-6">
                            <CardDescription className="flex items-center gap-2 text-[#00c3c0] font-black uppercase tracking-widest text-[10px]">
                                <Mail className="w-3.5 h-3.5" /> Active Sequence
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-4xl font-black text-[#00c3c0] tracking-tighter">{campaign?.isDrip ? 'ENABLED' : 'STATIC'}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b px-8 py-5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800">Timeline Analysis</CardTitle>
                            <CardDescription className="text-xs font-medium">Detailed breakdown of every dispatched message node.</CardDescription>
                        </div>
                        <Search className="w-5 h-5 text-slate-300" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            data={logs}
                            columns={columns}
                            isFetching={isFetching}
                            searchColumn="recipientEmail"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
