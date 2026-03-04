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
import { useAddEmailTemplateMutation } from '@/store/features/admin/emailApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { Mail, ChevronLeft, Save, Tag, X, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    templateKey: z.string().min(1, {
        message: 'Template Key is required.',
    }),
    templateType: z.string().min(1, {
        message: 'Template Type is required.',
    }),
    subject: z.string().min(1, {
        message: 'Subject is required.',
    }),
    body: z.string().min(10, {
        message: 'Body must be at least 10 characters.',
    }),
    variables: z.array(z.string()).default([]),
});

export default function EmailTemplateAddPage() {
    const router = useRouter();
    const [addEmailTemplate, { isLoading }] = useAddEmailTemplateMutation();
    const [variableInput, setVariableInput] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            templateKey: '',
            templateType: 'lawyer',
            subject: '',
            body: '',
            variables: [],
        },
    });

    const addVariable = () => {
        if (!variableInput.trim()) return;
        const currentVars = form.getValues('variables');
        if (!currentVars.includes(variableInput.trim())) {
            form.setValue('variables', [...currentVars, variableInput.trim()], { shouldDirty: true });
        }
        setVariableInput('');
    };

    const removeVariable = (tag) => {
        const currentVars = form.getValues('variables');
        form.setValue('variables', currentVars.filter(v => v !== tag), { shouldDirty: true });
    };

    async function onSubmit(values) {
        try {
            await addEmailTemplate(values).unwrap();
            showSuccessToast('Email template created successfully.');
            router.push('/admin/email/template/list');
        } catch (error) {
            const backendMessage =
                error?.data?.errorSources?.[0]?.message ||
                error?.data?.message ||
                'Failed to create template.';
            showErrorToast(backendMessage);
            console.error('Error creating template:', error);
        }
    }

    return (
        <div className="p-4 bg-slate-50/30 min-h-screen pb-20">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Link href="/admin/email/template/list" className="hover:text-[#00c3c0] flex items-center gap-1 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Back to Repository</span>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Design New <span className="text-[#00c3c0]">Template</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic text-sm">Follow the standard data format for automated campaign delivery.</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Metadata & Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                                    <CardHeader className="bg-gradient-to-r from-cyan-50/30 to-white border-b border-slate-50 px-8 py-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-800">
                                            <div className="w-9 h-9 rounded-xl bg-[#00c3c0]/10 flex items-center justify-center text-[#00c3c0]">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            Core Identification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Internal Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Welcome New Lawyer"
                                                                className="h-11 border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/10 rounded-xl px-4 text-sm"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="templateKey"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Unique Key</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="welcome_new_lawyer"
                                                                className="h-11 border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/10 rounded-xl px-4 font-mono text-[13px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="templateType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Target Entity Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/10 rounded-xl px-4 text-sm">
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                                <SelectItem value="lawyer">Lawyer</SelectItem>
                                                                <SelectItem value="client">Client</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                                <SelectItem value="generic">Generic</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="subject"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Email Subject Line</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Welcome to Our Platform {{lawyerName}}"
                                                                className="h-11 border-slate-200 focus:border-[#00c3c0] focus:ring-[#00c3c0]/10 rounded-xl px-4 text-sm font-medium"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                                    <CardHeader className="bg-gradient-to-r from-[#ff8602]/5 to-white border-b border-slate-50 px-8 py-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-800">
                                            <div className="w-9 h-9 rounded-xl bg-[#ff8602]/10 flex items-center justify-center text-[#ff8602]">
                                                <Save className="w-4 h-4" />
                                            </div>
                                            Rich Content Canvas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <FormField
                                            control={form.control}
                                            name="body"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#00c3c0]/20 transition-all shadow-inner bg-white">
                                                            <SimpleEditor name="body" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs mt-2" />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column: Dynamic Variables */}
                            <div className="space-y-6">
                                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white sticky top-24">
                                    <CardHeader className="bg-gradient-to-br from-indigo-50/50 to-white border-b border-slate-50 px-6 py-5">
                                        <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
                                            <Tag className="w-4 h-4 text-indigo-500" />
                                            Data Placeholders
                                        </CardTitle>
                                        <CardDescription className="text-[11px]">Define variables to use in subject or body using <span className="font-mono text-indigo-600">{"{{variableName}}"}</span>.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={variableInput}
                                                    onChange={(e) => setVariableInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                                                    placeholder="Enter variable name..."
                                                    className="h-10 border-slate-200 rounded-xl text-xs"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addVariable}
                                                    className="bg-indigo-500 hover:bg-indigo-600 h-10 w-10 p-0 rounded-xl"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                {form.watch('variables').length === 0 ? (
                                                    <div className="w-full flex flex-col items-center justify-center text-slate-400 py-4 opacity-70">
                                                        <Tag className="w-8 h-8 mb-2 stroke-1" />
                                                        <p className="text-[10px] font-medium italic">No variables added yet.</p>
                                                    </div>
                                                ) : (
                                                    form.watch('variables').map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            className="bg-white text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer group px-3 py-1.5 rounded-lg flex items-center gap-2"
                                                        >
                                                            <span className="font-mono text-[11px] font-bold tracking-tight">{tag}</span>
                                                            <X className="w-3 h-3 text-slate-300 group-hover:text-red-400" onClick={() => removeVariable(tag)} />
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50">
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full h-12 rounded-xl bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white shadow-lg shadow-[#00c3c0]/20 transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? 'Processing...' : (
                                                    <>
                                                        Save Design
                                                        <Save className="w-3.5 h-3.5" />
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="w-full mt-2 h-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-[10px] font-bold uppercase tracking-widest"
                                                onClick={() => router.push('/admin/email/template/list')}
                                            >
                                                Cancel Operation
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}