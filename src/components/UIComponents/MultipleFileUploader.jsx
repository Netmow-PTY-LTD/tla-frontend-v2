'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function MultipleFileUploader({
  name = 'avatar',
  label = 'Upload File(s)',
  defaultPreview = [],
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { register, setValue, watch } = useFormContext();
  const files = watch(name);
  const [previews, setPreviews] = useState(
    Array.isArray(defaultPreview) ? defaultPreview : [defaultPreview]
  );

  // Update previews when file input changes
  useEffect(() => {
    if (!files) return;

    const fileList = Array.isArray(files) ? files : [files];

    const updatedPreviews = fileList.map((file) =>
      file instanceof File ? URL.createObjectURL(file) : file
    );

    setPreviews(updatedPreviews);

    // Clean up blobs
    return () => {
      updatedPreviews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setValue(name, selectedFiles, { shouldValidate: true });
    }
  };

  const handleRemove = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = Array.isArray(files)
      ? [...files].filter((_, i) => i !== index)
      : [];

    setPreviews(updatedPreviews);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Image Previews with Remove Buttons */}
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
              <X className="h-4 w-4" />
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
