'use client';

import React, { useState } from 'react';
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
    FormDescription,
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
    useAddEmailTemplateMutation,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { Eye, Loader2, Plus, Trash2, Mail, Users, Settings2, Clock, Zap, ArrowLeft } from 'lucide-react';

const dripStepSchema = z.object({
    dayOffset: z.coerce.number().min(0, "Day offset cannot be negative."),
    subject: z.string().min(1, "Step subject is required"),
    templateKey: z.string().min(1, "Step template is required"),
    headline: z.string().min(1, "Step headline is required"),
    body: z.string().min(10, "Step body must be at least 10 characters."),
});

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    templateKey: z.string().min(1, {
        message: 'Template Key is required.',
    }).optional().or(z.literal('')),
    subject: z.string().min(1, {
        message: 'Subject is required.',
    }).optional().or(z.literal('')),
    targetAudience: z.string().min(1, {
        message: 'Target Audience is required.',
    }),
    segmentId: z.string().optional(),
    scheduleType: z.string().min(1, {
        message: 'Schedule Type is required.',
    }),
    scheduledAt: z.string().optional(),
    cronExpression: z.string().optional(),
    isDrip: z.boolean().default(false),
    dripSteps: z.array(dripStepSchema).optional(),
    headline: z.string().optional(),
    body: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
    footerText: z.string().optional(),
}).refine(data => {
    if (!data.isDrip) {
        return !!data.templateKey && !!data.subject && !!data.headline && !!data.body;
    }
    return data.dripSteps && data.dripSteps.length > 0;
}, {
    message: "Requirement for either standard content or drip steps not met",
    path: ["isDrip"]
});

export default function AddEmailCampaign() {
    const router = useRouter();
    const { data: templatesRes } = useGetTemplatesQuery();
    const { data: segmentsRes } = useGetSegmentsQuery();
    const [addEmailTemplate, { isLoading: isSubmitting }] = useAddEmailTemplateMutation();
    const [sendPreview, { isLoading: isPreviewing }] = useSendPreviewMutation();

    const templates = templatesRes?.data || [];
    const segments = segmentsRes?.data || [];

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
            cronExpression: '0 9 * * *', // Default 9 AM daily
            isDrip: false,
            dripSteps: [],
            headline: '',
            body: '',
            ctaLabel: '',
            ctaUrl: '',
            footerText: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "dripSteps"
    });

    const watchTargetAudience = form.watch('targetAudience');
    const watchScheduleType = form.watch('scheduleType');
    const watchIsDrip = form.watch('isDrip');

    async function handlePreview() {
        if (watchIsDrip) {
            showErrorToast("Preview is only available for standard campaigns.");
            return;
        }
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
            showSuccessToast("Preview email sent to your inbox.");
        } catch (error) {
            showErrorToast("Failed to send preview.");
        }
    }

    async function onSubmit(values) {
        const formattedData = {
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
        }

        if (values.targetAudience === 'segment') {
            const selectedSegment = segments.find(s => s.id === values.segmentId);
            formattedData.segmentFilter = selectedSegment?.filter || {};
        }

        if (values.scheduleType === 'scheduled' && values.scheduledAt) {
            formattedData.scheduledAt = new Date(values.scheduledAt).toISOString();
        } else if (values.scheduleType === 'recurring') {
            formattedData.cronExpression = values.cronExpression;
        }

        try {
            await addEmailTemplate(formattedData).unwrap();
            showSuccessToast('Campaign created successfully.');
            router.push('/admin/email');
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to create campaign.');
        }
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto space-y-8">
                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Design <span className="text-[#00c3c0]">New Campaign</span></h1>
                                <p className="text-slate-500 font-medium">Configure your audience and message sequence.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!watchIsDrip && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handlePreview}
                                    disabled={isPreviewing}
                                    className="rounded-xl border-slate-200 hover:bg-slate-50"
                                >
                                    {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2 text-[#00c3c0]" />}
                                    Send Preview
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting} className="bg-[#ff8602] hover:bg-[#ff8602]/90 px-8 rounded-xl shadow-lg shadow-[#ff8602]/20 border-none transition-all hover:scale-[1.02]">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                                Launch Campaign
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN - CONFIG */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2 text-[#00c3c0]">
                                        <Users className="w-5 h-5" />
                                        <CardTitle className="text-lg font-bold">Target Audience</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Internal Reference</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Q1 Newsletter - Members" className="rounded-xl border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/20" {...field} />
                                                </FormControl>
                                                <FormDescription>Strictly for internal identification.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="targetAudience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Recipient Group</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl border-slate-200">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-slate-400" />
                                                                <SelectValue />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200">
                                                        <SelectItem value="all_lawyers">All Lawyers</SelectItem>
                                                        <SelectItem value="all_clients">All Clients</SelectItem>
                                                        <SelectItem value="all_users">All Users</SelectItem>
                                                        <SelectItem value="segment">Smart Segment</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {watchTargetAudience === 'segment' && (
                                        <FormField
                                            control={form.control}
                                            name="segmentId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Choose Segment</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-xl border-slate-200">
                                                                <SelectValue placeholder="Select segment..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-xl border-slate-200">
                                                            {segments.map(s => (
                                                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2 text-[#00c3c0]">
                                        <Clock className="w-5 h-5" />
                                        <CardTitle className="text-lg font-bold">Delivery Schedule</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField
                                        control={form.control}
                                        name="scheduleType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Dispatch Logic</FormLabel>
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
                                                    <FormLabel className="font-bold text-slate-700">Pick Date & Time</FormLabel>
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
                                                    <FormLabel className="font-bold text-slate-700">Cron Configuration</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0 9 * * *" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Standard cron syntax (min hour day month weekday)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden border-l-4 border-l-[#00c3c0]">
                                <CardContent className="p-0">
                                    <div className="p-5 bg-gradient-to-r from-cyan-50 to-white flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-[#00c3c0]/10 text-[#00c3c0]">
                                                <Zap className="w-5 h-5 fill-[#00c3c0]" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800">Drip AI</span>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automation Sequence</p>
                                            </div>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="isDrip"
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-[#00c3c0]"
                                                />
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN - CONTENT */}
                        <div className="lg:col-span-8">
                            {!watchIsDrip ? (
                                <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-bold">Email Content Design</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-8 space-y-6 px-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="templateKey"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-700">Base Layout</FormLabel>
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
                                                        <FormLabel className="font-bold text-slate-700">Subject Line</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="What recipients will see" className="rounded-xl border-slate-200" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="headline"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Primary Headline</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Large bold text at the top" className="rounded-xl border-slate-200" {...field} />
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
                                                    <FormLabel className="font-bold text-slate-700">Main Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Craft your message here..."
                                                            className="min-h-[300px] resize-none rounded-2xl border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="ctaLabel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-700">Button Text</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Visit our Marketplace" className="rounded-xl border-slate-200" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="ctaUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold text-slate-700">Button Link</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://..." className="rounded-xl border-slate-200" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="footerText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Footer Note</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tagline or secondary info" className="rounded-xl border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-2">
                                        <div>
                                            <h3 className="font-black text-slate-800 text-xl tracking-tight">Sequence <span className="text-[#ff8602]">Architecture</span></h3>
                                            <p className="text-xs text-slate-500 font-medium italic">Define the chain of events for this campaign.</p>
                                        </div>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            onClick={() => append({ dayOffset: fields.length * 2, subject: '', templateKey: 'admin_custom', headline: '', body: '' })}
                                            className="bg-[#00c3c0] hover:bg-[#00c3c0]/90 rounded-xl px-5 h-10 border-none"
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add Step
                                        </Button>
                                    </div>
                                    
                                    {fields.length === 0 && (
                                        <div className="text-center p-20 bg-white border-2 border-dashed border-slate-200 rounded-[32px]">
                                            <Mail className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold text-lg">Your sequence is empty.</p>
                                            <p className="text-slate-400 text-sm mb-6">Start by adding your first automated step.</p>
                                            <Button type="button" variant="link" className="text-[#00c3c0] font-black" onClick={() => append({ dayOffset: 0, subject: '', templateKey: 'admin_custom', headline: '', body: '' })}>
                                                Create Step 01
                                            </Button>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Card key={field.id} className="shadow-sm border-slate-200 rounded-[24px] overflow-hidden border-l-4 border-l-[#ff8602]">
                                                <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full bg-[#ff8602] text-white flex items-center justify-center text-[10px] font-black">0{index + 1}</span>
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Automation Segment</span>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <CardContent className="pt-6 pb-8 px-8 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                        <FormField
                                                            control={form.control}
                                                            name={`dripSteps.${index}.dayOffset`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="font-bold text-slate-700">Days Delay</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="number" className="rounded-xl border-slate-200 focus:ring-[#ff8602]/20 focus:border-[#ff8602]" {...field} />
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
                                                                        <FormLabel className="font-bold text-slate-700">Layout</FormLabel>
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
                                                                <FormLabel className="font-bold text-slate-700">Email Subject</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Subject for this step" className="rounded-xl border-slate-200 focus:ring-[#ff8602]/20 focus:border-[#ff8602]" {...field} />
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
                                                                    <FormLabel className="font-bold text-slate-700">Headline</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Heading text" className="rounded-xl border-slate-200 focus:ring-[#ff8602]/20 focus:border-[#ff8602]" {...field} />
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
                                                                    <FormLabel className="font-bold text-slate-700">Detailed Message</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea className="min-h-[150px] rounded-2xl border-slate-200 focus:ring-[#ff8602]/20 focus:border-[#ff8602]" placeholder="Write step content..." {...field} />
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
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
