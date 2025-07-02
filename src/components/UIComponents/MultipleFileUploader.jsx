'use client';

import { useEffect, useState } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { CloudUpload, Trash } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function MultipleFileUploader({
  name = 'avatar',
  label = 'Upload File(s)',
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { register, setValue, watch, getValues, control } = useFormContext();
  const { isDirty,errors } = useFormState({ control }); // ensures RHF state is ready
  const files = watch(name);
  const [previews, setPreviews] = useState([]);

  console.log('errors ==>',errors)
  // Ensure field is registered
  useEffect(() => {
    register(name);
  }, [register, name]);

  // Convert a URL string to a File object
  // const urlToFile = async (url, index) => {
  //   try {
  //     const res = await fetch(url);
  //     const blob = await res.blob();
  //     const ext = blob.type.split('/')[1] || 'jpg';
  //     return new File([blob], `default-${index}.${ext}`, { type: blob.type });
  //   } catch (err) {
  //     console.error('Error converting URL to file:', url, err);
  //     return null;
  //   }
  // };

  const urlToFile = async (url, index) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      // Normalize known variants
      let mimeType = blob.type;

      if (!mimeType || mimeType === 'application/octet-stream') {
        // Try to guess mimeType from file extension in URL
        const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        if (extensionMatch) {
          const extFromUrl = extensionMatch[1].toLowerCase();
          // map common extensions to mime types
          const mimeMap = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            bmp: 'image/bmp',
            svg: 'image/svg+xml',
          };
          mimeType = mimeMap[extFromUrl] || 'image/jpeg';
        } else {
          mimeType = 'image/jpeg'; // default fallback
        }
      }

      // Normalize progressive jpeg
      if (mimeType === 'image/pjpeg') mimeType = 'image/jpeg';

      const ext = mimeType.split('/')[1].split('+')[0]; // handle cases like svg+xml

      return new File([blob], `default-${index}.${ext}`, { type: mimeType });
    } catch (err) {
      console.error('Error converting URL to file:', url, err);
      return null;
    }
  };

  // Initialize default file values (URLs → File objects)
  useEffect(() => {
    const initDefaultFiles = async () => {
      const defaultValue = getValues(name);

      if (
        !defaultValue ||
        (Array.isArray(defaultValue) && defaultValue[0] instanceof File)
      ) {
        return;
      }

      const urls = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

      const fileObjs = await Promise.all(
        urls.map((url, i) => urlToFile(url, i))
      );
      const validFiles = fileObjs.filter(Boolean);

      setValue(name, multiple ? validFiles : validFiles[0] || null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const blobUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(blobUrls);
    };

    initDefaultFiles();
  }, [isDirty]);

  // Update preview images when files change
  useEffect(() => {
    if (!files) return;

    const fileList = Array.isArray(files) ? files : [files];
    const urls = fileList.map((file) =>
      file instanceof File ? URL.createObjectURL(file) : file
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    if (multiple) {
      const existingFiles = Array.isArray(files) ? [...files] : [];
      const mergedFiles = [...existingFiles, ...selectedFiles];
      setValue(name, mergedFiles, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      // If not multiple, just replace
      setValue(name, selectedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleRemove = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = Array.isArray(files)
      ? [...files].filter((_, i) => i !== index)
      : [];

    setPreviews(updatedPreviews);
    setValue(name, multiple ? updatedFiles : null, { shouldValidate: true });
  };

  return (
    <div>
      <div className="flex gap-4">
      {/* Previews */}
      <div className="flex flex-wrap gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <Avatar className="h-[90px] w-[90px] rounded-lg">
              <AvatarImage src={src} />
              <AvatarFallback>Img</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full shadow p-1 hover:bg-red-100"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload input */}
      <div className="max-w-sm">
        <label
          htmlFor={`file-upload-${name}`}
          className="flex flex-col items-center justify-center w-full px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition"
        >
          {icon}
          <input
            id={`file-upload-${name}`}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
          />
        </label>
        <p className="text-gray-700 font-medium text-center mt-2">{label}</p>
      </div>
    </div>
   
    </div>
  );
}
