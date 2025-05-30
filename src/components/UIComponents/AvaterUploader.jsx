'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function AvatarUploader({
  name = 'avatar',
  label = 'Upload File',
  defaultPreview = '',
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { register, setValue, watch } = useFormContext();
  const file = watch(name);
  const [preview, setPreview] = useState(defaultPreview || '');

  // Handle preview generation for File or string URL
  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof file === 'string') {
      setPreview(file); // for default URL-based preview
    }
  }, [file]);

  const handleChange = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setValue(name, uploaded, { shouldValidate: true });
    }
  };

  return (
    <div className="flex items-center gap-4 ">
      <Avatar className="h-[90px] w-[90px]">
        <AvatarImage src={preview} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

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
