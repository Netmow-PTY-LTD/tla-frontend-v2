'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
    useGetContactInfoQuery,
    useUpsertContactInfoMutation,
} from '@/store/features/admin/contactApiService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const defaultValues = {
    address: '',
    phone: '',
    email: '',
    website: '',
};

export default function ContactInfoSettings() {
    const { data: contactData, isLoading: isFetching } = useGetContactInfoQuery();
    const [upsertContactInfo, { isLoading: isUpdating }] = useUpsertContactInfoMutation();

    const { register, handleSubmit, reset } = useForm({
        defaultValues,
    });

    useEffect(() => {
        if (contactData?.data) {
            reset(contactData.data);
        }
    }, [contactData, reset]);

    const onSubmit = async (data) => {
        try {
            const res = await upsertContactInfo(data).unwrap();
            if (res.success) {
                toast.success(res.message || 'Contact info updated successfully');
            } else {
                toast.error(res.message || 'Failed to update contact info');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || 'An error occurred while updating contact info');
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-6 border rounded-lg mx-auto"
        >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                📞 Contact Information
            </h2>

            {/* Address */}
            <div>
                <label className="block font-medium text-gray-700">Address</label>
                <textarea
                    disabled={isUpdating}
                    {...register('address', { required: 'Address is required' })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter business address"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    disabled={isUpdating}
                    {...register('email', { required: 'Email is required' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact email"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block font-medium text-gray-700">Phone Number</label>
                <input
                    type="text"
                    disabled={isUpdating}
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact phone number"
                />
            </div>

            {/* Website */}
            <div>
                <label className="block font-medium text-gray-700">Website (Optional)</label>
                <input
                    type="url"
                    disabled={isUpdating}
                    {...register('website')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={isUpdating}
                className="w-full text-white font-semibold py-2 rounded-lg transition"
            >
                {isUpdating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    'Save Contact Info'
                )}
            </Button>
        </form>
    );
}
