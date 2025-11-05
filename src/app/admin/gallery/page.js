

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
import { Copy, Edit, Eye, Search, Trash, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, FormProvider } from 'react-hook-form';

import TextInput from '@/components/form/TextInput';
import GalleryImageInput from '@/components/form/GalleryImageInput';


import { useCreateGalleryMutation, useDeleteGalleryMutation, useGetAllGalleriesQuery, useUpdateGalleryMutation } from '@/store/features/admin/galleryApiService';

export default function Gallery() {
    const [search, setSearch] = useState('');
    const [editingImage, setEditingImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // RTK Query hooks
    const { data: images = [], isLoading } = useGetAllGalleriesQuery();
    const [addImage] = useCreateGalleryMutation();
    const [updateImage] = useUpdateGalleryMutation();
    const [deleteImage] = useDeleteGalleryMutation();

    // React Hook Form
    const methods = useForm({
        defaultValues: { file: undefined, title: '', },
    });
    const { reset, handleSubmit, watch } = methods;
    const fileValue = watch('file');

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
                const res = await updateImage({ id: editingImage.id, formData }).unwrap();
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
                    console.log('result ', res)
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
            await deleteImage(id).unwrap();
            toast.success('Image removed.');
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
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-2xl font-semibold">🖼️ Image Gallery</h2>

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

                                <Button type="submit" className="w-full">
                                    {editingImage ? 'Update Image' : 'Add Image'}
                                </Button>
                            </form>
                        </FormProvider>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <p>Loading...</p>
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
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingImage(img);
                                            reset({
                                                title: img.title,
                                                description: img.description,
                                                file: undefined,
                                            });
                                        }}
                                    >
                                        <Edit size={16} />
                                    </Button>
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
                                        onClick={() => handleDelete(img._id)}
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
                                    onClick={() => handleDelete(img._id)}
                                >
                                    <X size={16} />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
