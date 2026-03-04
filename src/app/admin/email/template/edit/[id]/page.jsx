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
    useGetSingleEmailQuery,
    useUpdateEmailTemplateMutation
} from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter, useParams } from 'next/navigation';

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
    scheduleType: z.string().min(1, {
        message: 'Schedule Type is required.',
    }),
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

    const { data: emailData, isLoading: isFetching } = useGetSingleEmailQuery(id);
    const [updateEmailTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            templateKey: '',
            subject: '',
            targetAudience: 'all_lawyers',
            scheduleType: 'immediate',
            headline: '',
            body: '',
            ctaLabel: '',
            ctaUrl: '',
            footerText: '',
        },
    });

    useEffect(() => {
        if (emailData?.data) {
            const data = emailData.data;
            form.reset({
                title: data.title || '',
                templateKey: data.templateKey || '',
                subject: data.subject || '',
                targetAudience: data.targetAudience || 'all_lawyers',
                scheduleType: data.scheduleType || 'immediate',
                headline: data.customData?.headline || '',
                body: data.customData?.body || '',
                ctaLabel: data.customData?.ctaLabel || '',
                ctaUrl: data.customData?.ctaUrl || '',
                footerText: data.customData?.footerText || '',
            });
        }
    }, [emailData, form]);

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

        try {
            const result = await updateEmailTemplate({ id, data: formattedData }).unwrap();
            showSuccessToast(result?.message || 'Email campaign updated successfully.');
            setTimeout(() => {
                router.push('/admin/email');
            }, 2000);
        } catch (error) {
            const backendMessage =
                error?.data?.errorSources?.[0]?.message ||
                error?.data?.message ||
                'Failed to update email campaign.';

            showErrorToast(backendMessage);
            console.error('Error updating email campaign:', error);
        }
    }

    if (isFetching) {
        return <div className="p-4 text-center">Loading campaign data...</div>;
    }

    return (
        <div className="p-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Email Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Welcome New Lawyers" {...field} />
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
                                            <FormLabel>Template Key</FormLabel>
                                            <FormControl>
                                                <Input placeholder="welcome_to_lawyer" {...field} />
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
                                            <FormLabel>Target Audience</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select target" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all_lawyers">All Lawyers</SelectItem>
                                                    <SelectItem value="all_clients">All Clients</SelectItem>
                                                    <SelectItem value="all_users">All Users</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scheduleType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Schedule Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select schedule" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="immediate">Immediate</SelectItem>
                                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email subject" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Custom Data (Content)</h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="headline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Headline</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Main headline" {...field} />
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
                                                    <SimpleEditor name="body" />
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
                                                    <FormLabel>CTA Label</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Claim Your Discount" {...field} />
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
                                                    <FormLabel>CTA URL</FormLabel>
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
                                                <FormLabel>Footer Text</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Terms and conditions apply..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/email')}
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
