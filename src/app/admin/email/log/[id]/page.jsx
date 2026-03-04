'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCampaignLogQuery, useGetSingleEmailQuery } from '@/store/features/admin/emailApiService';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function CampaignLogPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: campaignRes } = useGetSingleEmailQuery(id);
    const { data: logRes, isFetching } = useGetCampaignLogQuery({ id, params: { limit: 100 } });

    const campaign = campaignRes?.data;
    const logs = logRes?.data || [];

    const columns = [
        {
            accessorKey: 'email',
            header: 'Recipient Email',
            cell: ({ row }) => <div className="font-medium">{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status');
                return (
                    <Badge 
                        variant="outline" 
                        className={status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                    >
                        {status === 'sent' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'sentAt',
            header: 'Sent At',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {new Date(row.getValue('sentAt')).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: 'error',
            header: 'Error/Details',
            cell: ({ row }) => (
                <div className="text-sm text-red-500 max-w-[300px] truncate" title={row.getValue('error')}>
                    {row.getValue('error') || '-'}
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">Delivery Log</h2>
                        <p className="text-gray-500">Campaign: {campaign?.title || 'Loading...'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2 text-sm font-medium text-gray-500">Total Targeted</CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaign?.totalTargeted || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 text-sm font-medium text-green-600">Successfully Sent</CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{campaign?.sentCount || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 text-sm font-medium text-red-600">Failed</CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{campaign?.failedCount || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <DataTable
                            data={logs}
                            columns={columns}
                            searchColumn="email"
                            isFetching={isFetching}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
