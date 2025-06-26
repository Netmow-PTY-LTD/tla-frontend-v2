'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function AvatarUploader({
  name = 'avatar',
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { register, setValue, watch } = useFormContext();
  const file = watch(name);
  const [preview, setPreview] = useState('');

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
    <div className="flex items-center gap-4">
      {/* Shared size classes */}
      <div className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28">
        <Avatar className="h-full w-full rounded-lg">
          <AvatarImage src={preview} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className="max-w-sm">
        <label
          htmlFor={`file-upload-${name}`}
          className="flex flex-col items-center justify-center h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 px-2 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer text-center hover:bg-gray-50 transition"
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
      </div>
    </div>
  );
}
