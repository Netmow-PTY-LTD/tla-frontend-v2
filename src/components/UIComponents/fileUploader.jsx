import { useFormContext } from 'react-hook-form';

export default function FileUploader({
  name,
  label = 'Upload File',
  onChange,
  accept = '*',
  multiple = false,
  width = 'max-w-sm',
  icon,
}) {
  const { register } = useFormContext();
  return (
    <div className={`${width}`}>
      <label
        htmlFor={name}
        className={`flex flex-col items-center justify-center w-full  px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition`}
      >
        {icon}
        <input
          id={name}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          {...register(name, { onChange })}
        />
      </label>
      <p className="text-gray-700 font-medium text-center mt-2">{label}</p>
    </div>
  );
}
