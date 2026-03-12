'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    useCreateScheduledJobMutation,
    useUpdateScheduledJobMutation,
    useGetAvailableTasksQuery,
} from '@/store/features/admin/emailApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { Loader2, Clock } from 'lucide-react';

export default function ScheduledJobForm({ open, onOpenChange, job, onSuccess }) {
    const isEdit = !!job;
    const { data: tasksData, isLoading: isLoadingTasks } = useGetAvailableTasksQuery();
    const [createJob, { isLoading: isCreating }] = useCreateScheduledJobMutation();
    const [updateJob, { isLoading: isUpdating }] = useUpdateScheduledJobMutation();

    const [scheduleType, setScheduleType] = React.useState('custom');
    const [intervalData, setIntervalData] = React.useState({ days: 0, hours: 1, minutes: 0 });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            task: '',
            cron: '* * * * *',
            runner: 'cron',
            active: true,
            queueName: 'email-queue',
            priority: 1,
            attempts: 3,
            delay: 0,
        },
    });

    const runner = watch('runner');

    const updateInterval = (field, value) => {
        const newData = { ...intervalData, [field]: parseInt(value) || 0 };
        setIntervalData(newData);

        // Simple cron mapping for common intervals
        let cron = '* * * * *';
        const { days, hours, minutes } = newData;

        if (days > 0) {
            // Every X days at H:M
            cron = `${minutes} ${hours} */${days} * *`;
        } else if (hours > 0) {
            // Every X hours at M minute
            cron = `${minutes} */${hours} * * *`;
        } else if (minutes > 0) {
            // Every X minutes
            cron = `*/${minutes} * * * *`;
        }

        setValue('cron', cron);
    };

    useEffect(() => {
        if (job) {
            reset({
                name: job.name,
                task: job.task,
                cron: job.cron || '* * * * *',
                runner: job.runner,
                active: job.active,
                queueName: job.queueName || 'email-queue',
                priority: job.priority || 1,
                attempts: job.attempts || 3,
                delay: job.delay || 0,
            });

            // Try to guess schedule type from cron
            if (job.cron) {
                if (job.cron === '* * * * *') setScheduleType('every_minute');
                else if (job.cron === '0 * * * *') setScheduleType('every_hour');
                else if (job.cron === '0 0 * * *') setScheduleType('daily');
                else if (job.cron.includes('*/')) setScheduleType('interval');
                else setScheduleType('custom');
            }
        } else {
            reset({
                name: '',
                task: '',
                cron: '* * * * *',
                runner: 'cron',
                active: true,
                queueName: 'email-queue',
                priority: 1,
                attempts: 3,
                delay: 0,
            });
        }
    }, [job, reset, open]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateJob({ id: job._id, data }).unwrap();
                showSuccessToast('Scheduled job updated successfully');
            } else {
                await createJob(data).unwrap();
                showSuccessToast('Scheduled job created successfully');
            }
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to save scheduled job');
        }
    };

    const availableTasks = runner === 'cron' ? tasksData?.data?.cron : tasksData?.data?.bullmq;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-3xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900">
                        {isEdit ? 'Edit' : 'Create'} <span className="text-[#00c3c0]">Scheduled Job</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Job Name</Label>
                            <Input
                                id="name"
                                placeholder="Daily Email Cleanup"
                                className="rounded-xl border-slate-200 focus:ring-[#00c3c0]"
                                {...register('name', { required: 'Job name is required' })}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="runner" className="text-xs font-bold uppercase tracking-widest text-slate-400">Runner Type</Label>
                            <Select
                                value={runner}
                                onValueChange={(val) => {
                                    setValue('runner', val);
                                    setValue('task', ''); // Reset task when runner changes
                                }}
                            >
                                <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#00c3c0]">
                                    <SelectValue placeholder="Select runner" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="cron">Standard Cron</SelectItem>
                                    <SelectItem value="bullmq">BullMQ Worker</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="task" className="text-xs font-bold uppercase tracking-widest text-slate-400">Task To Execute</Label>
                            <Select
                                value={watch('task')}
                                onValueChange={(val) => setValue('task', val)}
                                disabled={isLoadingTasks}
                            >
                                <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#00c3c0]">
                                    <SelectValue placeholder={isLoadingTasks ? "Loading tasks..." : "Select task"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {availableTasks?.map((task) => (
                                        <SelectItem key={task.value} value={task.value}>
                                            {task.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.task && <p className="text-red-500 text-xs">{errors.task.message}</p>}
                        </div>

                        {runner === 'cron' && (
                            <div className="md:col-span-2 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Schedule Type</Label>
                                    <Select
                                        value={scheduleType}
                                        onValueChange={(val) => {
                                            setScheduleType(val);
                                            // Set default values for the selected type
                                            if (val === 'every_minute') setValue('cron', '* * * * *');
                                            if (val === 'every_hour') setValue('cron', '0 * * * *');
                                            if (val === 'daily') setValue('cron', '0 0 * * *');
                                            if (val === 'weekly') setValue('cron', '0 0 * * 0');
                                            if (val === 'monthly') setValue('cron', '0 0 1 * *');
                                        }}
                                    >
                                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#00c3c0]">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="every_minute">Every Minute</SelectItem>
                                            <SelectItem value="every_hour">Every Hour</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="interval">Custom Interval</SelectItem>
                                            <SelectItem value="custom">Advanced (Cron Expression)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {scheduleType === 'interval' && (
                                    <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Days</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                className="h-8 text-xs rounded-lg"
                                                value={intervalData.days}
                                                onChange={(e) => updateInterval('days', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Hours</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="23"
                                                className="h-8 text-xs rounded-lg"
                                                value={intervalData.hours}
                                                onChange={(e) => updateInterval('hours', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Mins</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="59"
                                                className="h-8 text-xs rounded-lg"
                                                value={intervalData.minutes}
                                                onChange={(e) => updateInterval('minutes', e.target.value)}
                                            />
                                        </div>
                                        <p className="col-span-3 text-[10px] text-slate-500 italic mt-1 text-center">
                                            Converts to best-fit cron: {watch('cron')}
                                        </p>
                                    </div>
                                )}

                                {scheduleType === 'custom' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="cron" className="text-xs font-bold uppercase tracking-widest text-slate-400">Cron Expression</Label>
                                        <Input
                                            id="cron"
                                            placeholder="0 0 * * *"
                                            className="rounded-xl border-slate-200 font-mono focus:ring-[#00c3c0]"
                                            {...register('cron', { required: runner === 'cron' ? 'Cron expression is required' : false })}
                                        />
                                        <p className="text-[10px] text-slate-400 italic">Format: minute hour day month day-of-week</p>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                        <div className="flex items-center gap-2 text-indigo-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold font-mono">{watch('cron')}</span>
                                        </div>
                                    </div>
                                )}
                                {errors.cron && <p className="text-red-500 text-xs">{errors.cron.message}</p>}
                            </div>
                        )}

                        {runner === 'bullmq' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="queueName" className="text-xs font-bold uppercase tracking-widest text-slate-400">Queue Name</Label>
                                    <Input
                                        id="queueName"
                                        className="rounded-xl border-slate-200 focus:ring-[#00c3c0]"
                                        {...register('queueName')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-widest text-slate-400">Priority (1-10)</Label>
                                    <Input
                                        id="priority"
                                        type="number"
                                        className="rounded-xl border-slate-200 focus:ring-[#00c3c0]"
                                        {...register('priority', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="attempts" className="text-xs font-bold uppercase tracking-widest text-slate-400">Retry Attempts</Label>
                                    <Input
                                        id="attempts"
                                        type="number"
                                        className="rounded-xl border-slate-200 focus:ring-[#00c3c0]"
                                        {...register('attempts', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="delay" className="text-xs font-bold uppercase tracking-widest text-slate-400">Delay (ms)</Label>
                                    <Input
                                        id="delay"
                                        type="number"
                                        className="rounded-xl border-slate-200 focus:ring-[#00c3c0]"
                                        {...register('delay', { valueAsNumber: true })}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl md:col-span-2 border border-slate-100">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-slate-700">Active Status</Label>
                                <p className="text-xs text-slate-500">Enable or disable this job from running.</p>
                            </div>
                            <Switch
                                checked={watch('active')}
                                onCheckedChange={(val) => setValue('active', val)}
                                className="data-[state=checked]:bg-[#00c3c0]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white rounded-xl px-8 shadow-lg shadow-[#00c3c0]/20"
                        >
                            {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update' : 'Create'} Job
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
