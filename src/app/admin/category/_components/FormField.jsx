"use client"
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import React, { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form';

export default function FormField({ isLoading, onClose }) {
    const { setValue } = useFormContext();
    const name = useWatch({ name: 'name' });

    useEffect(() => {
        if (name) {
            const slug = name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            setValue('slug', slug);
        }
    }, [name, setValue]);

    return (
        <div className='space-y-5'>
            <TextInput name={'name'} placeholder='Category Name' />
            <TextInput name={'slug'} placeholder='Slug' />
            <AvatarUploader name='image' />
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add'}
                </Button>

            </DialogFooter>
        </div>
    )
}
