'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { userDummyImage } from '@/data/data';
import resizeAndConvertToWebP from './resizeAndConvertToWebP';

export default function AvatarUploader({
  name = 'avatar',
  accept = 'image/*',
  multiple = false,
  icon = <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />,
}) {
  const { register, setValue, watch, getValues } = useFormContext();
  const file = watch(name);
  const [preview, setPreview] = useState(null);

  // Handle preview generation
  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof file === 'string') {
      setPreview(file); // from backend or default
    }
  }, [file]);

  // Handle file input
  const handleChange =async (e) => {
    const uploaded = e.target.files?.[0];
        const webpFile = await resizeAndConvertToWebP(uploaded, 500, 0.8);
    if (webpFile) {
      setValue(name, webpFile, { shouldValidate: true });
    }
  };

  // Handle remove image
  const handleRemove = () => {
    setValue(name, '', { shouldValidate: true });
    setPreview('');
  };

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        <div className="relative h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
          <Avatar className="h-full w-full rounded-lg">
            <AvatarImage src={preview} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Remove Button */}
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-600 rounded-full p-1 shadow hover:text-red-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-sm relative w-28 h-28 md:h-32 md:w-32 lg:h-36 lg:w-36 z-[1]">
          <Avatar className="h-full w-full rounded-lg absolute top-0 left-0 z-[-1] opacity-50">
            <AvatarImage src={userDummyImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <label
            htmlFor={`file-upload-${name}`}
            className="flex flex-col items-center justify-center h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 px-2 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer text-center hover:bg-gray-50 transition"
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
      )}
    </div>
  );
}
