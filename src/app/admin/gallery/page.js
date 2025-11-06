

'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Edit, Eye, Loader, Loader2, Search, Trash, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, FormProvider } from 'react-hook-form';

import TextInput from '@/components/form/TextInput';
import GalleryImageInput from '@/components/form/GalleryImageInput';


import { useCreateGalleryMutation, useDeleteGalleryMutation, useGetAllGalleriesQuery, useUpdateGalleryMutation } from '@/store/features/admin/galleryApiService';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';



const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

const gallerySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    file: z
        .any()
        .refine((file) => {
            // Allow no file if editing existing image
            if (!file) return true;

            // Check instance
            if (!(file instanceof File)) return false;

            // Check type
            const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
            if (!isValidType) return false;

            // Check size
            const isValidSize = file.size <= MAX_FILE_SIZE;
            return isValidSize;
        }, {
            message: 'File must be JPG or PNG and max size 2 MB',
        }),
});





export default function Gallery() {
    const [search, setSearch] = useState('');
    const [editingImage, setEditingImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalId, setDeleteModalId] = useState(null);

    // RTK Query hooks
    const { data: images = [], isLoading } = useGetAllGalleriesQuery();
    const [addImage, { isLoading: addLoading }] = useCreateGalleryMutation();
    const [updateImage, { isLoading: updateLoading }] = useUpdateGalleryMutation();
    const [deleteImage, { isLoading: deleteLoading }] = useDeleteGalleryMutation();


    // React Hook Form
    const methods = useForm({
        resolver: zodResolver(gallerySchema),
        defaultValues: { file: undefined, title: '', },
    });
    const { reset, handleSubmit, watch } = methods;


    // Submit handler
    const onSubmit = async (data) => {
        try {
            if (!data.file && !editingImage) {
                toast.error('Please select an image file.');
                return;
            }

            const formData = new FormData();
            if (data.file) formData.append('galleryImage', data.file);
            formData.append('title', data.title || '');

            if (editingImage) {

                const res = await updateImage({ galleryId: editingImage._id, formData }).unwrap();
                if (res.success) {


                    toast.success(res.message || 'Image updated successfully!');
                    setEditingImage(null);
                    setIsModalOpen(false);
                } else {
                    toast.error(res.message || "something wen wrong");
                }

            } else {
                const res = await addImage(formData).unwrap();
                if (res.success) {

                    toast.success(res.message || 'Image added successfully!');
                    setIsModalOpen(false);
                } else {
                    toast.error(res.message || "something wen wrong");
                }

            }

            reset({ file: undefined, title: '', });
        } catch (err) {
            toast.error('Something went wrong!');
        }
    };

    // Delete handler
    const handleDelete = async (id) => {

        try {
            const res = await deleteImage(id).unwrap();

            if (res.success) {
                toast.success(res.message || 'Image removed.');
                setDeleteModalId(null);

            }

        } catch (err) {
            toast.error('Failed to delete image.');
        }
    };





    // Copy URL
    const handleCopyLink = async (url) => {
        await navigator.clipboard.writeText(url);
        toast.success('Image URL copied!');
    };

    // Filter images
    const filteredImages = images?.data?.filter((img) =>
        img?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className=" sticky top-0 z-20 bg-white pb-3 pt-2 flex items-center justify-between gap-3 flex-wrap border-b border-gray-200">
                <h2 className="text-2xl font-semibold"> Image Gallery</h2>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search images..."
                        className="pl-8 w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Dialog
                    open={isModalOpen}
                    onOpenChange={(open) => {
                        setIsModalOpen(open);
                        if (!open) {
                            setEditingImage(null);
                            reset({ file: undefined, title: '' });
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Upload size={18} /> {editingImage ? 'Edit Image' : 'Add Image'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingImage ? 'Edit Image' : 'Add New Image'}
                            </DialogTitle>
                        </DialogHeader>

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <GalleryImageInput
                                    name="file"
                                    label="Upload Image"
                                    defaultPreview={editingImage?.image}
                                />
                                <TextInput
                                    name="title"
                                    label="Title"
                                    placeholder="Enter title"
                                />

                                <Button type="submit" className="w-full" disabled={addLoading || updateLoading}>
                                    {(addLoading || updateLoading) ? (
                                        <>
                                            <Loader className="animate-spin h-4 w-4 mr-2" /> Saving...
                                        </>
                                    ) : editingImage ? (
                                        'Update Image'
                                    ) : (
                                        'Add Image'
                                    )}
                                </Button>

                            </form>
                        </FormProvider>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                        <Loader className="animate-spin h-6 w-6" />
                        <p>Loading...</p>
                    </div>
                </div>
            ) : filteredImages.length === 0 ? (
                <p className="text-gray-500 text-center">No images found.</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredImages.map((img) => (
                        <Card key={img.id} className="overflow-hidden relative group">
                            <CardContent className="p-0 relative h-48">
                                <Image
                                    src={img.image}
                                    alt={img.title || 'Image'}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => window.open(img.image, '_blank')}
                                    >
                                        <Eye size={16} />
                                    </Button>
                                    {/* <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingImage(img);
                                            reset({
                                                title: img.title,
                                                file: undefined,
                                            });
                                        }}
                                    >
                                        <Edit size={16} />
                                    </Button> */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => handleCopyLink(img.image)}
                                    >
                                        <Copy size={16} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"

                                        onClick={() => setDeleteModalId(img._id)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center p-2">
                                <p className="font-medium text-sm truncate">{img.title}</p>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-transparent"

                                    onClick={() => setDeleteModalId(img._id)}
                                >
                                    <X size={16} />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}


            {deleteModalId && (
                <ConfirmationModal
                    open={!!deleteModalId}
                    onOpenChange={() => setDeleteModalId(null)}
                    onConfirm={() => handleDelete(deleteModalId)}
                    title="Are you sure you want to delete this image?"
                    description="This action cannot be undone. Please proceed with caution."
                    cancelText="Cancel"
                    confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
                    confirmVariant="destructive"
                />
            )}

        </div>
    );
}
