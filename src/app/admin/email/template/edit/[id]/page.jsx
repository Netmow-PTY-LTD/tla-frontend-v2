'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useGetSingleEmailQuery,
    useUpdateEmailTemplateMutation,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter, useParams } from 'next/navigation';
import { Eye, Loader2, Save } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    templateKey: z.string().min(1, {
        message: 'Template Key is required.',
    }),
    subject: z.string().min(1, {
        message: 'Subject is required.',
    }),
    targetAudience: z.string().min(1, {
        message: 'Target Audience is required.',
    }),
    segmentId: z.string().optional(),
    scheduleType: z.string().min(1, {
        message: 'Schedule Type is required.',
    }),
    scheduledAt: z.string().optional(),
    headline: z.string().min(1, {
        message: 'Headline is required.',
    }),
    body: z.string().min(10, {
        message: 'Body must be at least 10 characters.',
    }),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
    footerText: z.string().optional(),
});

export default function EditEmailCampaign() {
    const router = useRouter();
    const { id } = useParams();

    const { data: campaignRes, isLoading: isFetching } = useGetSingleEmailQuery(id);
    const { data: templatesRes } = useGetTemplatesQuery();
    const { data: segmentsRes } = useGetSegmentsQuery();
    const [updateEmailTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();
    const [sendPreview, { isLoading: isPreviewing }] = useSendPreviewMutation();

    const templates = templatesRes?.data || [];
    const segments = segmentsRes?.data || [];
    const campaign = campaignRes?.data;

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
            headline: '',
            body: '',
            ctaLabel: '',
            ctaUrl: '',
            footerText: '',
        },
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
                headline: campaign.customData?.headline || '',
                body: campaign.customData?.body || '',
                ctaLabel: campaign.customData?.ctaLabel || '',
                ctaUrl: campaign.customData?.ctaUrl || '',
                footerText: campaign.customData?.footerText || '',
            });
        }
    }, [campaign, form]);

    const watchTargetAudience = form.watch('targetAudience');
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
        const formattedData = {
            title: values.title,
            templateKey: values.templateKey,
            subject: values.subject,
            targetAudience: values.targetAudience,
            scheduleType: values.scheduleType,
            customData: {
                headline: values.headline,
                body: values.body,
                ctaLabel: values.ctaLabel,
                ctaUrl: values.ctaUrl,
                footerText: values.footerText,
            },
        };

        if (values.targetAudience === 'segment') {
            formattedData.segmentId = values.segmentId;
        }

        if (values.scheduleType === 'scheduled' && values.scheduledAt) {
            formattedData.scheduledAt = new Date(values.scheduledAt).toISOString();
        }

        try {
            await updateEmailTemplate({ id, data: formattedData }).unwrap();
            showSuccessToast('Campaign updated successfully.');
            router.push('/admin/email');
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to update campaign.');
        }
    }

    if (isFetching) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading campaign data...</span>
            </div>
        );
    }

    const isLocked = ['sending', 'sent', 'canceled'].includes(campaign?.status);

    return (
        <div className="p-4">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="border-b bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold">Edit Campaign</CardTitle>
                            {isLocked && (
                                <p className="text-amber-600 text-sm font-medium mt-1">
                                    Note: This campaign is {campaign.status} and some fields may not be editable.
                                </p>
                            )}
                        </div>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={handlePreview}
                            disabled={isPreviewing}
                        >
                            {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            Test Preview
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Campaign Title</FormLabel>
                                            <FormControl>
                                                <Input disabled={isLocked} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="templateKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Template</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLocked}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a template" />
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

                            <div className="bg-slate-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="targetAudience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Audience</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLocked}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
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
                                                <FormLabel>Choose Segment</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isLocked}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="scheduleType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Schedule Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLocked}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="immediate">Send Immediately</SelectItem>
                                                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
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
                                                <FormLabel>Date & Time</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} disabled={isLocked} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-800 text-white px-4 py-2 text-sm font-medium">Email Content</div>
                                <div className="p-4 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject Line</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLocked} {...field} />
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
                                        name="body"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Body Content</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="min-h-[200px]"
                                                        disabled={isLocked}
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
                                                    <FormLabel>Button Label</FormLabel>
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
                                                    <FormLabel>Button Link</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={isLocked} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {!isLocked && (
                                <div className="flex gap-4 pt-4 border-t">
                                    <Button type="submit" size="lg" disabled={isUpdating} className="px-12">
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => router.push('/admin/email')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
