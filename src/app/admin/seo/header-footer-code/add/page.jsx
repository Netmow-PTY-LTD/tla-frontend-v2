'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useCreateHeaderFooterCodeMutation } from '@/store/features/seo/seoApi';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    code: z.string().min(2, {
        message: 'Code must be at least 2 characters.',
    }),
    notes: z.string(),
    position: z.enum(['header', 'footer']),
    isActive: z.boolean().default(true),
});

export default function AddCodePage() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            code: '',
            notes: '',
            position: 'header',
            isActive: true,
        },
    });

    const [addCode, { isLoading }] = useCreateHeaderFooterCodeMutation();

    async function onSubmit(values) {
        try {
            const result = await addCode(values).unwrap();
            if (result.success) {
                showSuccessToast(result?.message || 'Code added successfully!');
                form.reset();
                router.push('/admin/seo/header-footer-code')
            }
        } catch (error) {
            const fallbackMessage = 'An unexpected error occurred.';
            const message =
                error?.data?.errorSources?.[0]?.message ||
                error?.data?.message ||
                fallbackMessage;

            showErrorToast(message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-6">Add Header/Footer Code</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Code Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Position */}
                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="header">Header</option>
                                        <option value="footer">Footer</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Code */}
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => {
                            const textareaRef = React.useRef(null);

                            const handleInput = (e) => {
                                const textarea = e.target;
                                textarea.style.height = 'auto'; // reset height
                                textarea.style.height = textarea.scrollHeight + 'px'; // adjust to new content
                                field.onChange(e);
                            };

                            // Optional: auto-adjust height when default value is loaded
                            React.useEffect(() => {
                                if (textareaRef.current) {
                                    textareaRef.current.style.height = 'auto';
                                    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                                }
                            }, []);

                            return (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            ref={textareaRef}
                                            onInput={handleInput}
                                            placeholder="Enter your HTML/JS code here"
                                            className="font-mono resize-none overflow-hidden min-h-[120px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter notes here"
                                        className="font-mono resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Active Status */}
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active Status</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Adding...' : 'Add Code'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
