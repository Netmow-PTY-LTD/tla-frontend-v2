'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    useGetAllScheduledJobsQuery,
    useDeleteScheduledJobMutation,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    MoreHorizontal,
    Plus,
    Trash2,
    Edit,
    Clock,
    Activity,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Zap,
} from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import ScheduledJobForm from './_components/ScheduledJobForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScheduledJobListPage() {
    const { data: jobsRes, isLoading, refetch } = useGetAllScheduledJobsQuery();
    const [deleteJob] = useDeleteScheduledJobMutation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = jobsRes?.data || [];

    const formatCron = (cron) => {
        if (!cron) return 'Not set';
        if (cron === '* * * * *') return 'Every Minute';
        if (cron === '0 * * * *') return 'Every Hour';
        if (cron === '0 0 * * *') return 'Daily (Midnight)';
        if (cron === '0 0 * * 0') return 'Weekly (Sun)';
        if (cron === '0 0 1 * *') return 'Monthly (1st)';

        // Simple decomposition for intervals
        const parts = cron.split(' ');
        if (parts.length === 5) {
            const [m, h, d, mon, dow] = parts;
            if (m.startsWith('*/') && h === '*' && d === '*' && mon === '*' && dow === '*') {
                return `Every ${m.replace('*/', '')} Minutes`;
            }
            if (!m.includes('*') && h.startsWith('*/') && d === '*' && mon === '*' && dow === '*') {
                return `Every ${h.replace('*/', '')} Hours (at ${m}m)`;
            }
            if (!m.includes('*') && !h.includes('*') && d.startsWith('*/') && mon === '*' && dow === '*') {
                return `Every ${d.replace('*/', '')} Days (at ${h}:${m.padStart(2, '0')})`;
            }
            if (!m.includes('*') && !h.includes('*') && d === '*' && mon === '*' && dow !== '*') {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return `Weekly on ${days[dow]} at ${h}:${m.padStart(2, '0')}`;
            }
        }

        return cron; // Fallback to raw cron
    };

    const handleCreate = () => {
        setSelectedJob(null);
        setIsFormOpen(true);
    };

    const handleEdit = (job) => {
        setSelectedJob(job);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scheduled job?')) {
            try {
                await deleteJob(id).unwrap();
                showSuccessToast('Scheduled job deleted successfully');
                refetch();
            } catch (error) {
                showErrorToast('Failed to delete scheduled job');
            }
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:pt-8 pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Scheduled <span className="text-[#00c3c0]">Jobs</span></h1>
                        <p className="text-slate-500 mt-1 font-medium italic text-sm">Automate recurring tasks, email processes, and background workers.</p>
                    </div>
                    <div>
                        <Button
                            onClick={handleCreate}
                            className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white shadow-lg shadow-[#00c3c0]/20 px-6 py-3 rounded-2xl h-auto border-none transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5 font-bold" />
                            <span className="font-bold uppercase tracking-widest text-xs">New Scheduled Job</span>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                                <TableHead className="font-bold text-slate-900 h-14 pl-8 uppercase tracking-widest text-[10px]">Job Name</TableHead>
                                <TableHead className="font-bold text-slate-900 h-14 uppercase tracking-widest text-[10px]">Task / Engine</TableHead>
                                <TableHead className="font-bold text-slate-900 h-14 uppercase tracking-widest text-[10px]">Schedule / Queue</TableHead>
                                <TableHead className="font-bold text-slate-900 h-14 uppercase tracking-widest text-[10px]">Status</TableHead>
                                <TableHead className="font-bold text-slate-900 h-14 uppercase tracking-widest text-[10px]">Last Run</TableHead>
                                <TableHead className="text-right h-14 pr-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="p-8"><Skeleton className="h-8 w-full rounded-xl" /></TableCell>
                                    </TableRow>
                                ))
                            ) : jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                                            <Calendar className="w-12 h-12" />
                                            <p className="text-slate-500 font-medium italic">No scheduled jobs found. Create one to get started.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job) => (
                                    <TableRow key={job._id} className="hover:bg-slate-50/50 border-slate-50 group transition-all">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-base">{job.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                    ID: {job._id}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${job.runner === 'cron' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {job.runner === 'cron' ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">{job.task}</span>
                                                    <Badge variant="outline" className="w-fit text-[9px] h-4 mt-1 border-slate-200 text-slate-500 uppercase font-bold">
                                                        {job.runner}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {job.runner === 'cron' ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                                                            <Calendar className="w-3 h-3 text-[#00c3c0]" />
                                                            {formatCron(job.cron)}
                                                        </div>
                                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                                            {job.cron}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                                                        <Activity className="w-3 h-3 text-amber-500" />
                                                        {job.queueName}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${job.active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                                                variant="outline"
                                            >
                                                {job.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {job.lastRunAt ? (
                                                    <div className="flex items-center gap-2">
                                                        {job.lastStatus === 'success' ? (
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-600">
                                                                {new Date(job.lastRunAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                            </span>
                                                            <span className={`text-[9px] font-black uppercase ${job.lastStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                                {job.lastStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px] italic font-medium uppercase tracking-widest">Never Run</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-100 rounded-full transition-colors">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2">Job Options</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEdit(job)}
                                                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-[#00c3c0]/10 focus:text-[#00c3c0] cursor-pointer"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-[#00c3c0]/10 flex items-center justify-center text-[#00c3c0]">
                                                            <Edit className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-bold">Edit Settings</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(job._id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                            <Trash2 className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-bold">Delete Job</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ScheduledJobForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                job={selectedJob}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
