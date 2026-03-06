import React, { useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, List, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useUpdateEmailCategoryMutation } from '@/store/features/admin/emailApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
});

export default function EditEmailCategoryDrawer({ open, onOpenChange, category }) {
    const [updateCategory, { isLoading }] = useUpdateEmailCategoryMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (open && category) {
            form.reset({
                name: category.name || '',
                description: category.description || '',
                isActive: category.isActive !== false,
            });
        }
    }, [category, open, form]);

    const onSubmit = async (values) => {
        try {
            await updateCategory({ id: category._id, data: values }).unwrap();
            showSuccessToast('Category updated successfully');
            onOpenChange(false);
        } catch (error) {
            showErrorToast(error?.data?.message || 'Failed to update category');
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md border-l-0 shadow-2xl overflow-y-auto">
                <SheetHeader className="text-left pb-6 border-b border-slate-100 flex flex-row items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ff8602]/10 flex items-center justify-center">
                            <Edit2 className="w-5 h-5 text-[#ff8602]" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold text-slate-800">Edit Category</SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 font-medium">
                                Update email category details.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="py-8 space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <List className="w-3.5 h-3.5 text-slate-400" />
                                        Category Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Newsletters"
                                            className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#00c3c0]/20 focus:border-[#00c3c0] transition-all px-4 font-medium placeholder:text-slate-400"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of this category..."
                                            className="min-h-[100px] resize-none rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#00c3c0]/20 focus:border-[#00c3c0] transition-all px-4 py-3 text-sm placeholder:text-slate-400"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-bold text-slate-700">Active Status</FormLabel>
                                        <SheetDescription className="text-[11px] text-slate-500 font-medium p-0 m-0">
                                            Enable this category for use in templates.
                                        </SheetDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-[#ff8602]"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="h-11 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-full sm:w-auto px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 rounded-xl font-bold bg-[#ff8602] hover:bg-[#ff8602]/90 text-white w-full sm:w-auto px-8 shadow-md shadow-[#ff8602]/20 transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
