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

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [editingImage, setEditingImage] = useState(null);

  // React Hook Form
  const methods = useForm({
    defaultValues: {
      file: undefined,
      title: '',
      description: '',
    },
  });

  const { reset, handleSubmit, watch, setValue } = methods;

  const fileValue = watch('file');

  // Add / Edit Image
  const onSubmit = (data) => {

   



    const imageFile = data.file;
    if (!imageFile && !editingImage) {
      toast.error('Please select an image file.');
      return;
    }

    const previewUrl = imageFile
      ? URL.createObjectURL(imageFile)
      : editingImage?.url || '';

    if (editingImage) {
      // Update existing
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? { ...img, ...data, url: previewUrl, file: imageFile || img.file }
            : img
        )
      );
      toast.success('Image updated successfully!');
      setEditingImage(null);
    } else {
      // Add new
      const newImage = {
        id: Date.now().toString(),
        url: previewUrl,
        title: data.title,
        file: imageFile,
      };
      setImages((prev) => [newImage, ...prev]);
      toast.success('Image added successfully!');
    }

    reset({ file: undefined, title: '', description: '' });


  };

  // Delete Image
  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.success('Image removed.');
  };

  // Copy Image URL
  const handleCopyLink = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success('Image URL copied!');
  };

  // Filtered Images
  const filteredImages = images.filter((img) =>
    img.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-semibold">🖼️ Image Gallery</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search images..."
            className="pl-8 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add/Edit Dialog */}
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setEditingImage(null);
              reset({ file: undefined, title: '', description: '' });
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
                  defaultPreview={editingImage?.url}
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

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <p className="text-gray-500 text-center">No images found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <Card key={img.id} className="overflow-hidden relative group">
              <CardContent className="p-0 relative h-48">
                <Image
                  src={img.url}
                  alt={img.title || 'Image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => window.open(img.url, '_blank')}
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
                    onClick={() => handleCopyLink(img.url)}
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-2">
                <div>
                  <p className="font-medium text-sm truncate">{img.title}</p>
                  
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => handleDelete(img.id)}
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



// 'use client';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Copy, Edit, Eye, Search, Trash, Upload, X } from 'lucide-react';
// import { toast } from 'sonner';
// import { useForm, FormProvider } from 'react-hook-form';

// import TextInput from '@/components/form/TextInput';
// import GalleryImageInput from '@/components/form/GalleryImageInput';

// import {
//   useGetImagesQuery,
//   useAddImageMutation,
//   useUpdateImageMutation,
//   useDeleteImageMutation,
//   Image as ImageType,
// } from '@/redux/api/imageApi';

// export default function Gallery() {
//   const [search, setSearch] = useState('');
//   const [editingImage, setEditingImage] = useState(null);

//   // RTK Query hooks
//   const { data: images = [], isLoading } = useGetImagesQuery();
//   const [addImage] = useAddImageMutation();
//   const [updateImage] = useUpdateImageMutation();
//   const [deleteImage] = useDeleteImageMutation();

//   // React Hook Form
//   const methods = useForm({
//     defaultValues: { file: undefined, title: '',  },
//   });
//   const { reset, handleSubmit, watch } = methods;
//   const fileValue = watch('file');

//   // Submit handler
//   const onSubmit = async (data) => {
//     try {
//       if (!data.file && !editingImage) {
//         toast.error('Please select an image file.');
//         return;
//       }

//       const formData = new FormData();
//       if (data.file) formData.append('file', data.file);
//       formData.append('title', data.title || '');
//       formData.append('description', data.description || '');

//       if (editingImage) {
//         await updateImage({ id: editingImage.id, formData }).unwrap();
//         toast.success('Image updated successfully!');
//         setEditingImage(null);
//       } else {
//         await addImage(formData).unwrap();
//         toast.success('Image added successfully!');
//       }

//       reset({ file: undefined, title: '',  });
//     } catch (err) {
//       toast.error('Something went wrong!');
//     }
//   };

//   // Delete handler
//   const handleDelete = async (id) => {
//     try {
//       await deleteImage(id).unwrap();
//       toast.success('Image removed.');
//     } catch (err) {
//       toast.error('Failed to delete image.');
//     }
//   };

//   // Copy URL
//   const handleCopyLink = async (url) => {
//     await navigator.clipboard.writeText(url);
//     toast.success('Image URL copied!');
//   };

//   // Filter images
//   const filteredImages = images.filter((img) =>
//     img.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between gap-3 flex-wrap">
//         <h2 className="text-2xl font-semibold">🖼️ Image Gallery</h2>

//         <div className="relative">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search images..."
//             className="pl-8 w-64"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Dialog
//           onOpenChange={(open) => {
//             if (!open) {
//               setEditingImage(null);
//               reset({ file: undefined, title: '', description: '' });
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Upload size={18} /> {editingImage ? 'Edit Image' : 'Add Image'}
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 {editingImage ? 'Edit Image' : 'Add New Image'}
//               </DialogTitle>
//             </DialogHeader>

//             <FormProvider {...methods}>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <GalleryImageInput
//                   name="file"
//                   label="Upload Image"
//                   defaultPreview={editingImage?.url}
//                 />
//                 <TextInput
//                   name="title"
//                   label="Title"
//                   placeholder="Enter title"
//                 />

//                 <Button type="submit" className="w-full">
//                   {editingImage ? 'Update Image' : 'Add Image'}
//                 </Button>
//               </form>
//             </FormProvider>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : filteredImages.length === 0 ? (
//         <p className="text-gray-500 text-center">No images found.</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//           {filteredImages.map((img) => (
//             <Card key={img.id} className="overflow-hidden relative group">
//               <CardContent className="p-0 relative h-48">
//                 <Image
//                   src={img.url}
//                   alt={img.title || 'Image'}
//                   fill
//                   className="object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
//                   <Button
//                     size="icon"
//                     variant="secondary"
//                     onClick={() => window.open(img.url, '_blank')}
//                   >
//                     <Eye size={16} />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant="secondary"
//                     onClick={() => {
//                       setEditingImage(img);
//                       reset({
//                         title: img.title,
//                         description: img.description,
//                         file: undefined,
//                       });
//                     }}
//                   >
//                     <Edit size={16} />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant="secondary"
//                     onClick={() => handleCopyLink(img.url)}
//                   >
//                     <Copy size={16} />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant="destructive"
//                     onClick={() => handleDelete(img.id)}
//                   >
//                     <Trash size={16} />
//                   </Button>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between items-center p-2">
//                 <p className="font-medium text-sm truncate">{img.title}</p>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   className="hover:bg-transparent"
//                   onClick={() => handleDelete(img.id)}
//                 >
//                   <X size={16} />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
