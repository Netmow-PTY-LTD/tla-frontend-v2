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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#00c3c0]/10 text-[#00c3c0]">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        Campaign Performance
                    </DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">
                        Detailed analytics for "<span className="text-[#00c3c0]">{campaign?.title}</span>"
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00c3c0]" />
                        <p className="text-slate-500 animate-pulse font-medium">Fetching latest metrics...</p>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-slate-50 border-none shadow-none rounded-2xl">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <Users className="w-4 h-4" />
                                        Total Audience
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-slate-800">{campaign?.totalTargeted || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50/50 border-none shadow-none rounded-2xl">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Successful
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-green-700">{campaign?.sentCount || 0}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-red-50/50 border-none shadow-none rounded-2xl">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider">
                                        <AlertCircle className="w-4 h-4" />
                                        Failures
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-red-700">{campaign?.failedCount || 0}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Delivery Progress */}
                        <div className="p-6 border border-slate-100 rounded-2xl space-y-4 bg-gradient-to-br from-white to-cyan-50/20">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-bold text-slate-800">Delivery Velocity</h4>
                                    <p className="text-xs text-slate-500 font-medium">Percentage of total intended recipients reached</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-[#00c3c0]">{deliveryRate}%</span>
                                </div>
                            </div>
                            <Progress value={deliveryRate} className="h-3 shadow-inner" indicatorClassName="bg-[#00c3c0]" />
                        </div>

                        {/* Daily Activity */}
                        {stats?.dailyStats && stats.dailyStats.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                                    <Calendar className="w-4 h-4 text-[#ff8602]" />
                                    Dispatch History
                                </h4>
                                <div className="space-y-2">
                                    {stats.dailyStats.map((day, idx) => (
                                        <div key={idx} className="flex items-center gap-4 text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                            <span className="w-28 font-bold text-slate-600">{day.date}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                                <div 
                                                    className="h-full bg-[#00c3c0]" 
                                                    style={{ width: `${(day.sent / (day.sent + day.failed || 1)) * 100}%` }} 
                                                />
                                            </div>
                                            <div className="flex gap-4 text-xs font-bold">
                                                <span className="text-green-600">{day.sent} Sent</span>
                                                <span className="text-red-400">{day.failed} Fail</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!stats?.dailyStats?.length && (
                            <div className="text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm italic font-medium">Historical timeline data is currently being processed.</p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
