'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useGetCampaignStatsQuery } from '@/store/features/admin/emailApiService';
import { Loader2, TrendingUp, Users, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

export default function CampaignStatsModal({ campaign, isOpen, onOpenChange }) {
    const { data: statsRes, isLoading } = useGetCampaignStatsQuery(campaign?.id, {
        skip: !campaign?.id || !isOpen,
    });

    const stats = statsRes?.data;
    const deliveryRate = campaign?.totalTargeted > 0 
        ? Math.round((campaign?.sentCount / campaign?.totalTargeted) * 100) 
        : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Campaign Performance
                    </DialogTitle>
                    <DialogDescription>
                        Analytics for "{campaign?.title}"
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-slate-500 animate-pulse">Fetching latest metrics...</p>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-slate-50 border-none shadow-none">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Users className="w-4 h-4" />
                                        Total Audience
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{campaign?.totalTargeted || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50/50 border-none shadow-none">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Successfully Sent
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-700">{campaign?.sentCount || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-red-50/50 border-none shadow-none">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        Delivery Failures
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-700">{campaign?.failedCount || 0}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Delivery Progress */}
                        <div className="p-4 border rounded-xl space-y-3 bg-white shadow-sm">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-bold text-slate-800">Overall Delivery Success</h4>
                                    <p className="text-xs text-slate-500">Percentage of target audience reached</p>
                                </div>
                                <span className="text-xl font-black text-primary">{deliveryRate}%</span>
                            </div>
                            <Progress value={deliveryRate} className="h-3" />
                        </div>

                        {/* Daily Activity (if available in backend stats) */}
                        {stats?.dailyStats && stats.dailyStats.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Dispatch Timeline (Last 7 Days)
                                </h4>
                                <div className="space-y-2">
                                    {stats.dailyStats.map((day, idx) => (
                                        <div key={idx} className="flex items-center gap-4 text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <span className="w-24 font-medium text-slate-600">{day.date}</span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden flex">
                                                <div 
                                                    className="h-full bg-primary" 
                                                    style={{ width: `${(day.sent / (day.sent + day.failed || 1)) * 100}%` }} 
                                                />
                                            </div>
                                            <div className="flex gap-3 text-xs">
                                                <span className="text-green-600 font-bold">{day.sent} Sent</span>
                                                <span className="text-red-500">{day.failed} Failed</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!stats?.dailyStats?.length && (
                            <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed">
                                <p className="text-slate-500 text-sm italic">No detailed timeline data available for this campaign yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
