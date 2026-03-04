'use client';

import React, { useEffect, useState } from 'react';
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
    useUpdateEmailTemplateMutation,
    useGetSingleEmailQuery,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter, useParams } from 'next/navigation';
import { Eye, Loader2, Plus, Trash2, Mail, Users, Settings2, Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dripStepSchema = z.object({
    dayOffset: z.coerce.number().min(0),
    subject: z.string().min(1, "Step subject is required"),
    templateKey: z.string().min(1, "Step template is required"),
    headline: z.string().min(1, "Step headline is required"),
    body: z.string().min(10, "Step body is required"),
});

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    templateKey: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    targetAudience: z.string().min(1),
    segmentId: z.string().optional(),
    scheduleType: z.string().min(1),
    scheduledAt: z.string().optional(),
    cronExpression: z.string().optional(),
    isDrip: z.boolean().default(false),
    dripSteps: z.array(dripStepSchema).optional(),
    headline: z.string().optional(),
    body: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url().optional().or(z.literal('')),
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

export default function EditEmailCampaign() {
    const router = useRouter();
    const { id } = useParams();
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
            form.reset({
                title: campaign.title || '',
                templateKey: campaign.templateKey || '',
                subject: campaign.subject || '',
                targetAudience: campaign.targetAudience || 'all_lawyers',
                segmentId: campaign.segmentId || '',
                scheduleType: campaign.scheduleType || 'immediate',
                scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
                cronExpression: campaign.cronExpression || '0 9 * * *',
                isDrip: campaign.isDrip || false,
                headline: campaign.customData?.headline || '',
                body: campaign.customData?.body || '',
                ctaLabel: campaign.customData?.ctaLabel || '',
                ctaUrl: campaign.customData?.ctaUrl || '',
                footerText: campaign.customData?.footerText || '',
            });

            if (campaign.isDrip && campaign.dripSteps) {
                replace(campaign.dripSteps.map(step => ({
                    dayOffset: step.dayOffset,
                    subject: step.subject,
                    templateKey: step.templateKey,
                    headline: step.customData?.headline || '',
                    body: step.customData?.body || '',
                })));
            }
        }
    }, [campaign, form, replace]);

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
        if (isLocked) {
            showErrorToast("This campaign is locked and cannot be edited.");
            return;
        }

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

        if (values.targetAudience === 'segment') {
            const selectedSegment = segments.find(s => s.id === values.segmentId);
            formattedData.segmentFilter = selectedSegment?.filter || {};
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
            await updateEmailTemplate({ id, data: formattedData }).unwrap();
            showSuccessToast('Campaign updated successfully.');
            router.push('/admin/email');
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to update campaign.');
        }
    }

    if (isLoadingCampaign) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 bg-slate-50 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">Edit Email Campaign</h1>
                            <p className="text-slate-500">Update your campaign settings and content.</p>
                        </div>
                        <div className="flex gap-3">
                            {!watchIsDrip && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handlePreview}
                                    disabled={isPreviewing || isLocked}
                                >
                                    {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    Test Preview
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting || isLocked} className="bg-primary hover:bg-primary/90 px-8">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {isLocked && (
                        <Alert variant="warning" className="bg-amber-50 border-amber-200">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-amber-800">Campaign Locked</AlertTitle>
                            <AlertDescription className="text-amber-700">
                                This campaign has already been {campaign?.status} and cannot be modified.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Settings2 className="w-5 h-5" />
                                        <CardTitle className="text-lg">Basics & Audience</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Internal Title</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLocked} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="targetAudience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Group</FormLabel>
                                                <Select disabled={isLocked} onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-slate-400" />
                                                                <SelectValue />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="all_lawyers">All Lawyers</SelectItem>
                                                        <SelectItem value="all_clients">All Clients</SelectItem>
                                                        <SelectItem value="all_users">All Users</SelectItem>
                                                        <SelectItem value="segment">Specific Segment</SelectItem>
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
                                                    <FormLabel>Choose Smart Segment</FormLabel>
                                                    <Select disabled={isLocked} onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a segment" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
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

                            <Card className="shadow-sm border-slate-200">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Clock className="w-5 h-5" />
                                        <CardTitle className="text-lg">Scheduling</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="scheduleType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Method</FormLabel>
                                                <Select disabled={isLocked} onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="immediate">Send Now</SelectItem>
                                                        <SelectItem value="scheduled">One-time Scheduled</SelectItem>
                                                        <SelectItem value="recurring">Recurring (Weekly/Daily)</SelectItem>
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
                                                    <FormLabel>Send Date & Time</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLocked} type="datetime-local" {...field} />
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
                                                    <FormLabel>Cron Schedule</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLocked} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-slate-200 overflow-hidden">
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="w-4 h-4" />
                                        <span className="font-medium">Drip Automation</span>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="isDrip"
                                        render={({ field }) => (
                                            <Switch
                                                disabled={isLocked}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            {!watchIsDrip ? (
                                <Card className="shadow-sm border-slate-200">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                                        <CardTitle className="text-lg">Standard Email Content</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="templateKey"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Layout Template</FormLabel>
                                                        <Select disabled={isLocked} onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select layout" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
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
                                                        <FormLabel>Email Subject Line</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={isLocked} {...field} />
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
                                                    <FormLabel>Main Headline</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLocked} {...field} />
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
                                                    <FormLabel>Main Content</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            disabled={isLocked}
                                                            className="min-h-[250px] resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="ctaLabel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Call to Action Button</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={isLocked} {...field} />
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
                                                        <FormLabel>Button Link (URL)</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={isLocked} {...field} />
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
                                                    <FormLabel>Footer Message</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLocked} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-slate-800">Drip Step Sequence</h3>
                                        {!isLocked && (
                                            <Button 
                                                type="button" 
                                                size="sm" 
                                                onClick={() => append({ dayOffset: 0, subject: '', templateKey: 'admin_custom', headline: '', body: '' })}
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add Step
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="shadow-sm border-slate-200">
                                            <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-600">STEP {index + 1}</span>
                                                {!isLocked && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <CardContent className="pt-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`dripSteps.${index}.dayOffset`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Day Offset</FormLabel>
                                                                <FormControl>
                                                                    <Input disabled={isLocked} type="number" {...field} />
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
                                                                    <FormLabel>Layout Template</FormLabel>
                                                                    <Select disabled={isLocked} onValueChange={field.onChange} value={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
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
                                                            <FormLabel>Subject</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={isLocked} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`dripSteps.${index}.headline`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Headline</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={isLocked} {...field} />
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
                                                            <FormLabel>Body</FormLabel>
                                                            <FormControl>
                                                                <Textarea disabled={isLocked} className="min-h-[100px]" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
