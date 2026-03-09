'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useGetSingleEmailQuery,
    useUpdateEmailTemplateMutation,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Eye, Loader2, Plus, Trash2, Mail, Users, Settings2, Clock, Zap, ArrowLeft, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dripStepSchema = z.object({
    dayOffset: z.coerce.number().min(0),
    subject: z.string().min(1),
    templateKey: z.string().min(1),
    headline: z.string().min(1),
    body: z.string().min(10),
});

const formSchema = z.object({
    title: z.string().min(2),
    templateKey: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    targetAudience: z.string(),
    segmentId: z.string().optional(),
    scheduleType: z.string(),
    scheduledAt: z.string().optional(),
    cronExpression: z.string().optional(),
    isDrip: z.boolean(),
    dripSteps: z.array(dripStepSchema).optional(),
    headline: z.string().optional(),
    body: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url().optional().or(z.literal('')),
    footerText: z.string().optional(),
});

export default function EditEmailCampaign() {
    const { id } = useParams();
    const router = useRouter();
    const { data: campaignRes, isLoading: isLoadingCampaign } = useGetSingleEmailQuery(id);
    const { data: templatesRes } = useGetTemplatesQuery();
    const { data: segmentsRes } = useGetSegmentsQuery();
    const [updateEmailTemplate, { isLoading: isSubmitting }] = useUpdateEmailTemplateMutation();
    const [sendPreview, { isLoading: isPreviewing }] = useSendPreviewMutation();

    const campaign = campaignRes?.data;
    const templates = templatesRes?.data || [];
    const segments = segmentsRes?.data || [];

    const isLocked = campaign?.status === 'sent' || campaign?.status === 'sending' || campaign?.status === 'canceled';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            templateKey: '',
            subject: '',
            targetAudience: 'all_lawyers',
            segmentId: '',
            scheduleType: 'immediate',
            scheduledAt: '',
            cronExpression: '0 9 * * *',
            isDrip: false,
            dripSteps: [],
            headline: '',
            body: '',
            ctaLabel: '',
            ctaUrl: '',
            footerText: '',
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "dripSteps"
    });

    useEffect(() => {
        if (campaign) {
            const formData = {
                title: campaign.title || '',
                templateKey: campaign.templateKey || '',
                subject: campaign.subject || '',
                targetAudience: campaign.targetAudience || 'all_lawyers',
                scheduleType: campaign.scheduleType || 'immediate',
                isDrip: campaign.isDrip || false,
                headline: campaign.customData?.headline || '',
                body: campaign.customData?.body || '',
                ctaLabel: campaign.customData?.ctaLabel || '',
                ctaUrl: campaign.customData?.ctaUrl || '',
                footerText: campaign.customData?.footerText || '',
                scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
                cronExpression: campaign.cronExpression || '0 9 * * *',
            };

            if (campaign.isDrip && campaign.dripSteps) {
                formData.dripSteps = campaign.dripSteps.map(step => ({
                    dayOffset: step.dayOffset,
                    subject: step.subject,
                    templateKey: step.templateKey,
                    headline: step.customData?.headline || '',
                    body: step.customData?.body || '',
                }));
            }

            form.reset(formData);
        }
    }, [campaign, form]);

    const watchIsDrip = form.watch('isDrip');
    const watchScheduleType = form.watch('scheduleType');

    async function handlePreview() {
        const values = form.getValues();
        try {
            await sendPreview({
                templateKey: values.templateKey,
                subject: values.subject,
                customData: {
                    headline: values.headline,
                    body: values.body,
                    ctaLabel: values.ctaLabel,
                    ctaUrl: values.ctaUrl,
                    footerText: values.footerText,
                }
            }).unwrap();
            showSuccessToast("Preview email sent.");
        } catch (error) {
            showErrorToast("Failed to send preview.");
        }
    }

    async function onSubmit(values) {
        if (isLocked) {
            showErrorToast("This campaign is locked and cannot be edited.");
            return;
        }

        const formattedData = {
            id,
            title: values.title,
            targetAudience: values.targetAudience,
            scheduleType: values.scheduleType,
            isDrip: values.isDrip,
        };

        if (values.isDrip) {
            formattedData.dripSteps = values.dripSteps.map(step => ({
                dayOffset: step.dayOffset,
                subject: step.subject,
                templateKey: step.templateKey,
                customData: {
                    headline: step.headline,
                    body: step.body,
                }
            }));
            formattedData.templateKey = null;
            formattedData.subject = null;
            formattedData.customData = null;
        } else {
            formattedData.templateKey = values.templateKey;
            formattedData.subject = values.subject;
            formattedData.customData = {
                headline: values.headline,
                body: values.body,
                ctaLabel: values.ctaLabel,
                ctaUrl: values.ctaUrl,
                footerText: values.footerText,
            };
            formattedData.dripSteps = [];
        }

        if (values.scheduleType === 'scheduled' && values.scheduledAt) {
            formattedData.scheduledAt = new Date(values.scheduledAt).toISOString();
        } else if (values.scheduleType === 'recurring') {
            formattedData.scheduledAt = null;
            formattedData.cronExpression = values.cronExpression;
        } else {
            formattedData.scheduledAt = null;
        }

        try {
            await updateEmailTemplate(formattedData).unwrap();
            showSuccessToast('Campaign updated successfully.');
            router.push('/admin/email');
        } catch (error) {
            showErrorToast('Failed to update campaign.');
        }
    }

    if (isLoadingCampaign) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#00c3c0]" />
                <p className="text-slate-500 font-bold animate-pulse">Loading Campaign Data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto space-y-8">
                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit <span className="text-[#00c3c0]">Automation Hub</span></h1>
                                    {isLocked && <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100">Locked</Badge>}
                                </div>
                                <p className="text-slate-500 font-medium">Modifying sequence for "<span className="text-[#00c3c0]">{campaign?.title}</span>"</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!watchIsDrip && (
                                <Button type="button" variant="outline" onClick={handlePreview} disabled={isPreviewing} className="rounded-xl border-slate-200">
                                    {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    Send Preview
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting || isLocked} className="bg-[#ff8602] hover:bg-[#ff8602]/90 px-8 rounded-xl shadow-lg shadow-[#ff8602]/20 border-none transition-all">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-[#00c3c0]">
                                        <Settings2 className="w-5 h-5" />
                                        <CardTitle className="text-lg font-bold tracking-tight">System Settings</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Internal Title</FormLabel>
                                                <FormControl>
                                                    <Input className="rounded-xl border-slate-200" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="scheduleType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Delivery Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl border-slate-200">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200">
                                                        <SelectItem value="immediate">Send Instantly</SelectItem>
                                                        <SelectItem value="scheduled">Specific Time</SelectItem>
                                                        <SelectItem value="recurring">Recurring Cycle</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {watchScheduleType === 'scheduled' && (
                                        <FormField
                                            control={form.control}
                                            name="scheduledAt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Time to Launch</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {watchScheduleType === 'recurring' && (
                                        <FormField
                                            control={form.control}
                                            name="cronExpression"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Cron Rule</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0 9 * * *" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <div className="p-5 bg-gradient-to-r from-cyan-50 to-white rounded-2xl flex justify-between items-center border border-cyan-100 mt-6">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 text-[#00c3c0] fill-[#00c3c0]" />
                                            <span className="font-black text-slate-800 tracking-tighter uppercase text-xs">Sequence Mode</span>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="isDrip"
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled
                                                    className="data-[state=checked]:bg-[#00c3c0]"
                                                />
                                            )}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold italic px-2">Automation mode cannot be changed after creation.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-8">
                            {!watchIsDrip ? (
                                <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-white border-b border-slate-50">
                                        <CardTitle className="text-xl font-black text-slate-800 tracking-tight"><span className="text-[#ff8602]">Message</span> Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-8 space-y-6 px-10">
                                        <FormField
                                            control={form.control}
                                            name="templateKey"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Visual Blueprint</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-xl border-slate-200">
                                                                <SelectValue placeholder="Select a layout" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-xl border-slate-200">
                                                            {templates.map(t => (
                                                                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Subject Visibility</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter subject" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="headline"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Main Header</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter headline" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="body"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Message Canvas</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[350px] rounded-2xl border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <div>
                                            <h3 className="font-black text-slate-800 text-xl tracking-tight">Sequence <span className="text-[#ff8602]">Timeline</span></h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-opacity-70 mt-1">Lifecycle Management</p>
                                        </div>
                                        <Button type="button" size="sm" onClick={() => append({ dayOffset: 0, subject: '', templateKey: 'admin_custom', headline: '', body: '' })} className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 rounded-xl px-5 border-none">
                                            <Plus className="w-4 h-4 mr-2" /> Add Next Step
                                        </Button>
                                    </div>

                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="shadow-sm border-slate-200 rounded-[24px] overflow-hidden border-l-4 border-l-[#ff8602]">
                                            <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#ff8602] text-white flex items-center justify-center text-[10px] font-black">S{index + 1}</div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Automation Segment Node</span>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 rounded-lg">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CardContent className="pt-8 pb-10 px-10 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name={`dripSteps.${index}.dayOffset`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-bold text-slate-700">Delay (Days)</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" className="rounded-xl border-slate-200 focus:border-[#ff8602] focus:ring-[#ff8602]/10" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <div className="md:col-span-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`dripSteps.${index}.templateKey`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="font-bold text-slate-700">Step Layout</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="rounded-xl border-slate-200">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent className="rounded-xl border-slate-200">
                                                                            {templates.map(t => (
                                                                                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name={`dripSteps.${index}.subject`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="font-bold text-slate-700">Subject Line</FormLabel>
                                                            <FormControl>
                                                                <Input className="rounded-xl border-slate-200 focus:border-[#ff8602] focus:ring-[#ff8602]/10" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-1 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name={`dripSteps.${index}.headline`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-bold text-slate-700">Headline Tag</FormLabel>
                                                                <FormControl>
                                                                    <Input className="rounded-xl border-slate-200 focus:border-[#ff8602] focus:ring-[#ff8602]/10" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`dripSteps.${index}.body`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-bold text-slate-700">Component Message</FormLabel>
                                                                <FormControl>
                                                                    <Textarea className="min-h-[150px] rounded-2xl border-slate-200 focus:border-[#ff8602] focus:ring-[#ff8602]/10" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
