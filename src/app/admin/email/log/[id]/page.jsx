'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCampaignLogQuery, useGetSingleEmailQuery } from '@/store/features/admin/emailApiService';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Mail, Users, AlertCircle } from 'lucide-react';
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
                <div className="flex items-center gap-2 font-medium text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
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
                <div className="text-sm text-slate-500 font-medium">
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
                    <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 p-1.5 rounded-lg border border-red-100 max-w-[400px]">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span className="truncate" title={error}>{error}</span>
                    </div>
                ) : (
                    <span className="text-slate-400 italic text-xs">Delivered successfully</span>
                );
            },
        },
    ];

    return (
        <div className="p-4 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-xl shadow-sm bg-white" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Campaign Dispatch Logs</h2>
                            <p className="text-slate-500 text-sm font-medium italic">Tracing deliveries for: <span className="text-primary not-italic font-bold">{campaign?.title || 'Segment Hub'}</span></p>
                        </div>
                    </div>
                    {isFetching && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                        <div className="h-1 bg-slate-200" />
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                <Users className="w-3 h-3" /> Target Audience
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-800 tracking-tighter">{campaign?.totalTargeted || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                        <div className="h-1 bg-green-500" />
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-1.5 text-green-600 font-bold uppercase tracking-wider text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> Reached
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-green-700 tracking-tighter">{campaign?.sentCount || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                        <div className="h-1 bg-red-500" />
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-1.5 text-red-600 font-bold uppercase tracking-wider text-[10px]">
                                <XCircle className="w-3 h-3" /> Bounced / Failed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-red-700 tracking-tighter">{campaign?.failedCount || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b px-8 py-5">
                        <CardTitle className="text-lg font-bold">Granular Delivery Timeline</CardTitle>
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
