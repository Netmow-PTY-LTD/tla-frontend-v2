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
import { Eye, Loader2, Plus, Trash2, Mail, Users, Settings2, Clock } from 'lucide-react';

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
    // Standard content (for non-drip)
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
        <div className="p-4 bg-slate-50 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">Create Email Campaign</h1>
                            <p className="text-slate-500">Design and automate your outreach with advanced targeting.</p>
                        </div>
                        <div className="flex gap-3">
                            {!watchIsDrip && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handlePreview}
                                    disabled={isPreviewing}
                                >
                                    {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    Test Preview
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 px-8">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                                Launch Campaign
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT COLUMN - CONFIG */}
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
                                                    <Input placeholder="e.g. Q1 Newsletter" {...field} />
                                                </FormControl>
                                                <FormDescription>For internal tracking only.</FormDescription>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        <Input type="datetime-local" {...field} />
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
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormDescription>Standard cron format (min hour day month weekday)</FormDescription>
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
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <CardContent className="pt-4">
                                    <p className="text-xs text-slate-500">
                                        Drip campaigns allow sending a sequence of emails over time.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN - CONTENT */}
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
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                            <Input placeholder="Recipient will see this" {...field} />
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
                                                        <Input placeholder="Bold text at the top" {...field} />
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
                                                            placeholder="Write your email message here..."
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
                                                            <Input placeholder="e.g. Visit Website" {...field} />
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
                                                    <FormLabel>Footer Message</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Follow us on Social Media" {...field} />
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
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            onClick={() => append({ dayOffset: fields.length * 2, subject: '', templateKey: 'admin_custom', headline: '', body: '' })}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Step
                                        </Button>
                                    </div>
                                    
                                    {fields.length === 0 && (
                                        <div className="text-center p-12 bg-white border-2 border-dashed rounded-lg">
                                            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium">No steps defined yet.</p>
                                            <Button type="button" variant="link" onClick={() => append({ dayOffset: 0, subject: '', templateKey: 'admin_custom', headline: '', body: '' })}>
                                                Create your first step
                                            </Button>
                                        </div>
                                    )}

                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="shadow-sm border-slate-200 overflow-hidden">
                                            <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-600">STEP {index + 1}</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
                                                                    <Input type="number" {...field} />
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
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                            <FormLabel>Email Subject</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
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
                                                                <Input {...field} />
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
                                                            <FormLabel>Content Body</FormLabel>
                                                            <FormControl>
                                                                <Textarea className="min-h-[120px]" {...field} />
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
