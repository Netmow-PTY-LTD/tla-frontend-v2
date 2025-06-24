'use client';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, Trash } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function MultipleFileUploader({
  name = 'avatar',
  label = 'Upload File(s)',
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { setValue, watch, getValues } = useFormContext();
  const files = watch(name);
  const [previews, setPreviews] = useState([]);

  // Convert a URL to a File object
  const urlToFile = async (url, index) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      return new File([blob], `default-${index}.${ext}`, { type: blob.type });
    } catch (err) {
      console.error('Error converting URL to file:', url, err);
      return null;
    }
  };

  // ⬇️ On mount: check defaultValues from RHF and convert to Files
  useEffect(() => {
    const initDefaultFiles = async () => {
      const defaultFieldValue = getValues(name);

      // If it's already File objects, just skip
      if (!defaultFieldValue || defaultFieldValue[0] instanceof File) return;

      const urls = Array.isArray(defaultFieldValue)
        ? defaultFieldValue
        : [defaultFieldValue];

      const filesFromUrls = await Promise.all(
        urls.map((url, i) => urlToFile(url, i))
      );
      const validFiles = filesFromUrls.filter(Boolean);

      setValue(name, multiple ? validFiles : validFiles[0] || null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const blobUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(blobUrls);
    };

    initDefaultFiles();
  }, []);

  // ⬇️ Update previews when files change
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

  // ⬇️ File selection handler
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setValue(name, multiple ? selectedFiles : selectedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // ⬇️ File removal handler
  const handleRemove = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = Array.isArray(files)
      ? [...files].filter((_, i) => i !== index)
      : [];

    setPreviews(updatedPreviews);
    setValue(name, multiple ? updatedFiles : null, { shouldValidate: true });
  };

  return (
    <div className="flex gap-4">
      {/* Image Previews */}
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

      {/* File Upload Input */}
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
  );
}
