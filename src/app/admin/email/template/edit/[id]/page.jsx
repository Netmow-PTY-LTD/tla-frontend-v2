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
import { Textarea } from '@/components/ui/textarea';
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
    templateNo: z.string().min(1, {
        message: 'Template No. is required.',
    }),
    subject: z.string().min(2, {
        message: 'Subject must be at least 2 characters.',
    }),
    body: z.string().min(10, {
        message: 'Body must be at least 10 characters.',
    }),
});

export default function EditEmailTemplate() {
    const router = useRouter();
    const { id } = useParams();

    const { data: emailData, isLoading: isFetching } = useGetSingleEmailQuery(id);
    const [updateEmailTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            templateNo: '',
            subject: '',
            body: '',
        },
    });

    useEffect(() => {
        if (emailData?.data) {
            form.reset({
                title: emailData.data.title || '',
                templateNo: emailData.data.templateNo || '',
                subject: emailData.data.subject || '',
                body: emailData.data.body || '',
            });
        }
    }, [emailData, form]);

    async function onSubmit(values) {
        try {
            const result = await updateEmailTemplate({ id, data: values }).unwrap();
            showSuccessToast(result?.message || 'Email template updated successfully.');
            setTimeout(() => {
                router.push('/admin/email');
            }, 2000);
        } catch (error) {
            const backendMessage =
                error?.data?.errorSources?.[0]?.message ||
                error?.data?.message ||
                'Failed to update email template.';

            showErrorToast(backendMessage);
            console.error('Error updating email template:', error);
        }
    }

    if (isFetching) {
        return <div className="p-4 text-center">Loading template data...</div>;
    }

    return (
        <div className="p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Email Template</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="templateNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template No.</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter template number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter email content"
                                                className="min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Updating...' : 'Save Changes'}
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
