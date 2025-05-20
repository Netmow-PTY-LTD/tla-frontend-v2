import { CloudUpload } from 'lucide-react';

export default function FileUploader({
  label = 'Upload File',
  onChange,
  accept = '*',
  multiple = false,
  height = 'h-30',
  width = 'max-w-sm',
}) {
  return (
    <div className={`${width} `}>
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full ${height} px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition`}
      >
        <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={onChange}
          accept={accept}
          multiple={multiple}
        />
      </label>
      <p className="text-gray-700 font-medium text-center mt-2">{label}</p>
    </div>
  );
}
