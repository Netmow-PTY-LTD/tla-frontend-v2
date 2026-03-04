'use client';

import React, { useEffect, useState } from 'react';
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
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useAddEmailTemplateMutation,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { Eye, Send, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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

export default function AddEmailCampaign() {
    const router = useRouter();
    const { data: templatesRes } = useGetTemplatesQuery();
    const { data: segmentsRes } = useGetSegmentsQuery();
    const [sendPreview, { isLoading: isPreviewing }] = useSendPreviewMutation();
    const [addEmailTemplate, { isLoading: isCreating }] = useAddEmailTemplateMutation();

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
            headline: '',
            body: '',
            ctaLabel: '',
            ctaUrl: '',
            footerText: '',
        },
    });

    const watchTargetAudience = form.watch('targetAudience');
    const watchScheduleType = form.watch('scheduleType');

    async function handlePreview() {
        const values = form.getValues();
        if (!values.templateKey || !values.subject || !values.headline || !values.body) {
            showErrorToast("Please fill in template, subject, headline and body to preview.");
            return;
        }

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
            const result = await addEmailTemplate(formattedData).unwrap();
            showSuccessToast(result?.message || 'Email campaign created.');
            router.push('/admin/email');
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to create campaign.');
        }
    }

    return (
        <div className="p-4">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="border-b bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Launch New Campaign</CardTitle>
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
                            {/* Basic Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Campaign Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. March Lawyer Newsletter" {...field} />
                                            </FormControl>
                                            <FormDescription>Internal name for your campaign</FormDescription>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                            {/* Audience Section */}
                            <div className="bg-slate-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="targetAudience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Audience</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Who should receive this?" />
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select segment" />
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

                            {/* Scheduling Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="scheduleType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Schedule Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="When to send?" />
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
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Subject Line</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Catchy subject to improve open rates" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Content Section */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-800 text-white px-4 py-2 text-sm font-medium">Email Content (Template Data)</div>
                                <div className="p-4 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="headline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Main Headline</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Large text at top of email" {...field} />
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
                                                <FormLabel>Message Body</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write your email body here..."
                                                        className="min-h-[200px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Supports plain text or HTML depending on template.</FormDescription>
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
                                                    <FormLabel>Button Label (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Read More" {...field} />
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
                                                    <FormLabel>Button Link (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} />
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
                                                <FormLabel>Footer Text (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Unsubscribe info or disclaimers" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <Button type="submit" size="lg" disabled={isCreating} className="w-full md:w-auto px-12">
                                    {isCreating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : 'Launch Campaign'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.push('/admin/email')}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
