

// 'use client';
// import React, { useState } from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
// import { toast } from 'sonner';

// export default function GalleryImageInput({
//   name,
//   label,
//   accept = 'image/*',
// }) {
//   const { control } = useFormContext();
//   const [previewFiles, setPreviewFiles] = useState([]);

//   const handleCopyUrl = (url) => {
//     navigator.clipboard.writeText(url);
//     toast.success('Image URL copied!');
//   };

//   const handleRemove = (index, fieldValue, onChange) => {
//     const updated = fieldValue.filter((_, i) => i !== index);
//     setPreviewFiles(updated.map((file) => URL.createObjectURL(file)));
//     onChange(updated);
//   };

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field: { onChange, value = [] } }) => (
//         <FormItem>
//           {label && <FormLabel>{label}</FormLabel>}
//           <FormControl>
//             <Input
//               type="file"
//               accept={accept}
//               multiple
//               onChange={(e) => {
//                 const files = Array.from(e.target.files);
//                 const updated = [...value, ...files];
//                 setPreviewFiles(updated.map((file) => URL.createObjectURL(file)));
//                 onChange(updated);
//               }}
//             />
//           </FormControl>

//           {/* Preview grid */}
//           {value.length > 0 && (
//             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {value.map((file, index) => {
//                 const previewUrl =
//                   typeof file === 'string'
//                     ? file
//                     : previewFiles[index] || URL.createObjectURL(file);

//                 return (
//                   <div
//                     key={index}
//                     className="relative rounded-lg overflow-hidden border group"
//                   >
//                     <Image
//                       src={previewUrl}
//                       alt="Preview"
//                       width={200}
//                       height={150}
//                       className="object-cover w-full h-40"
//                     />

//                     {/* Hover Actions */}
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition">
//                       <Button
//                         size="icon"
//                         variant="secondary"
//                         onClick={() => handleCopyUrl(previewUrl)}
//                       >
//                         <Copy className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="icon"
//                         variant="secondary"
//                         onClick={() => window.open(previewUrl, '_blank')}
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="icon"
//                         variant="secondary"
//                         onClick={() =>
//                           handleRemove(index, value, onChange)
//                         }
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }


'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext,  } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Copy, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';



export default function GalleryImageInput({
  name,
  label,
  accept = 'image/*',
}) {
  const { control, setValue, watch } = useFormContext();
  const watchedFile = watch(name); 
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (watchedFile) {
      // If the value is a File, create a URL for preview
      if (watchedFile instanceof File) {
        setPreviewFile(URL.createObjectURL(watchedFile));
      } else if (typeof watchedFile === 'string') {
        setPreviewFile(watchedFile);
      }
    } else {
      setPreviewFile(null);
    }
  }, [watchedFile]);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied!');
  };

  const handleRemove = () => {
    setValue(name, null, { shouldValidate: true });
    setPreviewFile(null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setValue(name, file, { shouldValidate: true });
                if (file) {
                  setPreviewFile(URL.createObjectURL(file));
                }
              }}
            />
          </FormControl>

          {/* Preview */}
          {previewFile && (
            <div className="relative w-full h-48 mt-4 rounded-lg overflow-hidden border group">
              <Image
                src={previewFile}
                alt="Preview"
                fill
                className="object-cover w-full h-full"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleCopyUrl(previewFile)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => window.open(previewFile, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={handleRemove}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

