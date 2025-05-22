'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useEditZipCodeMutation,
  useGetCountryListQuery,
  useGetSingleZipCodeQuery,
} from '@/store/features/public/publicApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const formSchema = z.object({
  zipcode: z.string().min(4, { message: 'Zip Code must be at least 4 digits' }),
  countryId: z.string().min(1, { message: 'Country is required' }),
});

export default function EditZipCodeModal({ open, onClose, zipId }) {
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipcode: '',
      countryId: '',
    },
  });

  const {
    data: singleZipCode,
    isSuccess,
    refetch,
  } = useGetSingleZipCodeQuery(zipId, {
    skip: !zipId,
  });

  const { data: countryList } = useGetCountryListQuery();
  const [editZipCode, { isLoading }] = useEditZipCodeMutation();

  // Trigger loader on open
  useEffect(() => {
    if (open && zipId) {
      setIsLocalLoading(true);
      refetch();
    }
  }, [open, zipId, refetch]);

  // Populate form when data is loaded
  useEffect(() => {
    if (isSuccess && singleZipCode?.data) {
      form.reset({
        zipcode: singleZipCode.data.zipcode,
        countryId: singleZipCode.data.countryId,
      });
      setIsLocalLoading(false);
    }
  }, [isSuccess, singleZipCode, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        _id: zipId,
        zipcode: values.zipcode,
        countryId: values.countryId,
      };
      const res = await editZipCode(payload).unwrap();
      showSuccessToast(res?.message || 'Zip Code updated successfully!');
      onClose(); // Close modal after update
    } catch (error) {
      const message = error?.data?.message || 'Failed to update Zip Code.';
      showErrorToast(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Zip Code</DialogTitle>
        </DialogHeader>

        {isLocalLoading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading zip code details...</p>
            {/* You can replace this with a spinner */}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryList?.data?.map((country) => (
                          <SelectItem key={country._id} value={country._id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
